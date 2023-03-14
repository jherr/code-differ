import { IconButton, Tooltip } from "@mui/material";
import {
  calculateExtents,
  MARGIN,
  FONTS,
  createMeasuredSprites,
  getLayers,
} from "engine";
import { useCodeFrames, useProject } from "../lib/EditorContext";
import { Layers as LayersIcon } from "@mui/icons-material";

function SaveLayers() {
  const project = useProject();
  const codeFrames = useCodeFrames();

  const onClick = () => {
    const { sprites } = createMeasuredSprites(project, 50);
    const { extents, extentsByCodeSegment } = calculateExtents(sprites);

    const layers = getLayers(project, 50);

    const rectangles: {
      time: number;
      size: number[];
      anchor: number[];
    }[] = [];
    if (project.showBackground) {
      let anchorOffset = -(extentsByCodeSegment[0][1] + MARGIN);
      for (const codeExtentIndex in extentsByCodeSegment) {
        const codeExtent = extentsByCodeSegment[codeExtentIndex];
        if (+codeExtentIndex > 0) {
          anchorOffset -=
            (codeExtent[1] - extentsByCodeSegment[+codeExtentIndex - 1][1]) / 2;
        }
        rectangles.push({
          time: codeFrames[+codeExtentIndex].time,
          size: [extents[0] + MARGIN, codeExtent[1] + MARGIN],
          anchor: [-(extents[0] + MARGIN), anchorOffset],
        });
      }
    }

    const data = {
      compName: project.name,
      rectangles,
      fontRegular: FONTS[project.font].postRegular,
      fontItalic: FONTS[project.font].postItalic,
      fontSize: 50,
      totalTime: project.totalTime,
      extents: [extents[0] + MARGIN, extents[1] + MARGIN],
      layers,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.download = `${project.name}.json`;
    a.href = url;
    a.click();
  };

  return (
    <Tooltip title="Save Layers">
      <IconButton onClick={onClick} color="primary">
        <LayersIcon />
      </IconButton>
    </Tooltip>
  );
}

export default SaveLayers;
