import { IconButton, Tooltip } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useProject } from "../lib/EditorContext";

function SaveProject() {
  const project = useProject();
  const onSaveProject = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${project.name}-project.json`;
    link.href = url;
    link.click();
  };

  return (
    <Tooltip title="Save Project">
      <IconButton onClick={onSaveProject} color="primary">
        <SaveIcon />
      </IconButton>
    </Tooltip>
  );
}

export default SaveProject;
