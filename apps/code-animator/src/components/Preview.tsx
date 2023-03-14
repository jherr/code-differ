import PreviewReact from "preview-react";

import { PREVIEW_FONT_SIZE } from "engine";
import {
  useProject,
  useTime,
  usePreviewError,
  useLayers,
} from "../lib/EditorContext";

const Preview = () => {
  const layers = useLayers(PREVIEW_FONT_SIZE);
  const time = useTime();

  const project = useProject();

  if (usePreviewError()) {
    return null;
  }

  return <PreviewReact project={project} layers={layers} time={time} />;
};

export default Preview;
