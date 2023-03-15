import { Box } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark as editorTheme } from "@uiw/codemirror-themes-all";

import { FONTS } from "engine";
import { useProject, useFrame, useFrameUpdate } from "../lib/EditorState";
import { BOTTOM_HEIGHT } from "../lib/constants";

function Editor() {
  const project = useProject();
  const frame = useFrame();
  const updateFrame = useFrameUpdate();

  const code = project.keyframes?.[frame]?.code ?? "";

  if (frame < 0) {
    return null;
  }

  return (
    <Box
      sx={{
        "& .cm-content, & .cm-gutter": {
          fontFamily: `${FONTS[project.font].web}`,
          fontSize: 20,
        },
      }}
    >
      <CodeMirror
        value={code}
        onChange={(code) => updateFrame({ code })}
        extensions={[javascript({ jsx: true })]}
        height={`calc(100vh - ${BOTTOM_HEIGHT}px)`}
        theme={editorTheme}
        style={{
          width: "100%",
          overflow: "scroll",
        }}
      />
    </Box>
  );
}

export default Editor;
