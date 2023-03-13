import { useRef } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { FileOpen as LoadIcon } from "@mui/icons-material";
import { useProjectUpdate } from "../lib/EditorContext";

function LoadProject() {
  const updateProject = useProjectUpdate();

  const openFileRef = useRef<HTMLInputElement>(null);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = JSON.parse(event?.target?.result?.toString() ?? "{}");
      updateProject({
        ...data,
      });
    };
    if (openFileRef.current?.files?.[0]) {
      fileReader.readAsText(openFileRef.current?.files?.[0]);
    }
  };

  const onLoadProject = () => {
    openFileRef.current!.click();
  };

  return (
    <>
      <input
        type="file"
        ref={openFileRef}
        style={{ display: "none" }}
        onChange={onFileSelected}
      />
      <Tooltip title="Load Project">
        <IconButton onClick={onLoadProject} color="primary">
          <LoadIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default LoadProject;
