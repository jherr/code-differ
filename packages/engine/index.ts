import convertCodeBlocksToTokens from "./src/differ";
import calculateLayers from "./src/layers";
import measureSprites from "./src/measureSprites";
import calculateExtents from "./src/extents";
import FONTS from "./src/fonts";
import { updateProjectFrame } from "./src/project";
import { calculateLayerAtTime, getLayersWithMaps } from "./src/layerAtTime";

const MARGIN = 20;
const PREVIEW_FONT_SIZE = 20;

export type {
  Sprite,
  Token,
  CompletedSprite,
  Keyframe,
  Layer,
  Transition,
  Project,
} from "./src/types";

export {
  convertCodeBlocksToTokens,
  calculateLayers,
  measureSprites,
  calculateExtents,
  updateProjectFrame,
  calculateLayerAtTime,
  getLayersWithMaps,
  FONTS,
  MARGIN,
  PREVIEW_FONT_SIZE,
};
