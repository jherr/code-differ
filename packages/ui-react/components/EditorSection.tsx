import EffectsEditor from "./EffectsEditor";
import Editor from "./Editor";

import { useProject, useFrame } from "../lib/EditorState";

function EditorSection() {
  const project = useProject();
  const frame = useFrame();

  if (frame < 0) {
    return null;
  }

  return project.keyframes?.[frame]?.type === "code" ? (
    <Editor />
  ) : (
    <EffectsEditor />
  );
}

export default EditorSection;
