import re

with open('src/tests/glitch_caption_nan.test.tsx', 'r') as f:
    content = f.read()

# Add the import
content = content.replace("import { useProject } from '../react-app/hooks/useProject';", "import { useProject, TimelineClip } from '../react-app/hooks/useProject';")

# Replace any
content = content.replace("let clip: any;", "let clip: TimelineClip | undefined;")
content = content.replace("expect(Number.isFinite(clip.start))", "expect(Number.isFinite(clip!.start))")
content = content.replace("expect(clip.start)", "expect(clip!.start)")
content = content.replace("expect(Number.isFinite(clip.duration))", "expect(Number.isFinite(clip!.duration))")
content = content.replace("expect(clip.outPoint)", "expect(clip!.outPoint)")

content = content.replace("let clips: any[] = [];", "let clips: TimelineClip[] = [];")

with open('src/tests/glitch_caption_nan.test.tsx', 'w') as f:
    f.write(content)
