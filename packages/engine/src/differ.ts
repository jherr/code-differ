import parseToTokens from "./javascriptParser";
import createTracks from "./tracks";
import createSpritesFromTracks from "./sprites";

import { Sprite, Token } from "./types";

const convertCodeBlocksToSprites = (
  blocks: string[]
): {
  error?: string;
  tracks: number;
  sprites: Sprite[];
} => {
  let rawTokens: Token[][] = [];
  try {
    rawTokens = parseToTokens(blocks);
  } catch (e) {
    return {
      error: (e as Error).message,
      tracks: 0,
      sprites: [],
    };
  }

  const tracks = createTracks(rawTokens);

  const sprites = createSpritesFromTracks(tracks);

  return {
    tracks: tracks.length,
    sprites,
  };
};

export default convertCodeBlocksToSprites;
