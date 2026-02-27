import cv2
import mediapipe as mp
import sys
import json
import os

def detect_faces(video_path):
    mp_face_detection = mp.solutions.face_detection

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(json.dumps({"error": "Could not open video"}))
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30 # Fallback

    tracks = [] # List of { id: int, data: [], last_seen_frame: int }
    next_track_id = 0
    # Allow gap of 0.5 seconds before considering a track lost
    max_frame_gap = int(fps * 0.5)

    # Process every Nth frame to speed up (interpolate later in frontend)
    # 3 frames ~ 100ms at 30fps, good balance
    PROCESS_STRIDE = 2

    with mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5) as face_detection:
        frame_idx = 0
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                break

            # Skip frames for performance
            if frame_idx % PROCESS_STRIDE != 0:
                frame_idx += 1
                continue

            timestamp = frame_idx / fps

            image.flags.writeable = False
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = face_detection.process(image)

            current_detections = []

            if results.detections:
                for detection in results.detections:
                    bbox = detection.location_data.relative_bounding_box
                    # MediaPipe relative bounding box: xmin, ymin, width, height (normalized 0-1)

                    center_x = bbox.xmin + bbox.width / 2
                    center_y = bbox.ymin + bbox.height / 2

                    current_detections.append({
                        "x": center_x,
                        "y": center_y,
                        "w": bbox.width,
                        "h": bbox.height,
                        "score": detection.score[0]
                    })

            # Match current detections to existing tracks
            # Simple greedy matching based on distance
            used_detections = set()

            # Try to match existing tracks first
            for track in tracks:
                # If track hasn't been seen for too long, stop updating it (it will be closed)
                if frame_idx - track['last_seen_frame'] > max_frame_gap:
                    continue

                # Find closest detection
                last_pos = track['data'][-1]
                best_dist = 0.15 # Max distance threshold (normalized coords) - tuned for tracking
                best_idx = -1

                for i, det in enumerate(current_detections):
                    if i in used_detections:
                        continue

                    # Euclidean distance
                    dist = ((det['x'] - last_pos['x'])**2 + (det['y'] - last_pos['y'])**2)**0.5

                    # Also check size similarity to avoid jumping between faces of very different sizes
                    size_diff = abs(det['w'] - last_pos['w']) + abs(det['h'] - last_pos['h'])

                    if dist < best_dist and size_diff < 0.2:
                        best_dist = dist
                        best_idx = i

                if best_idx != -1:
                    det = current_detections[best_idx]
                    track['data'].append({
                        "t": timestamp,
                        "x": det['x'],
                        "y": det['y'],
                        "w": det['w'],
                        "h": det['h']
                    })
                    track['last_seen_frame'] = frame_idx
                    used_detections.add(best_idx)

            # Create new tracks for unmatched detections
            for i, det in enumerate(current_detections):
                if i not in used_detections:
                    tracks.append({
                        "id": next_track_id,
                        "data": [{
                            "t": timestamp,
                            "x": det['x'],
                            "y": det['y'],
                            "w": det['w'],
                            "h": det['h']
                        }],
                        "last_seen_frame": frame_idx
                    })
                    next_track_id += 1

            frame_idx += 1

    cap.release()

    # Filter and format results
    valid_tracks = []
    min_track_duration = 1.0 # Minimum 1 second to be considered a valid face track

    for track in tracks:
        if not track['data']:
            continue

        start_time = track['data'][0]['t']
        end_time = track['data'][-1]['t']
        duration = end_time - start_time

        if duration >= min_track_duration:
            # Calculate average confidence/size to maybe rank faces later?
            # For now just passing the track data
            valid_tracks.append({
                "id": track['id'],
                "keyframes": track['data']
            })

    # Sort tracks by duration (longest first) - assume longest track is main subject
    valid_tracks.sort(key=lambda t: len(t['keyframes']), reverse=True)

    print(json.dumps({"tracks": valid_tracks}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing video path"}))
        sys.exit(1)

    video_path = sys.argv[1]
    try:
        detect_faces(video_path)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
