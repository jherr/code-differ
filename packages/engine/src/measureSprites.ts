import { Sprite, CompletedSprite } from "./types";

let canvas: any = null;
let context: any = null;

const measureText = (
  text: string,
  font: string,
  fontSize: number
): {
  width: number;
  height: number;
} => {
  canvas = canvas || document?.createElement("canvas");
  context = context || canvas?.getContext("2d");

  context!.font = `${fontSize}px ${font}`;

  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
    context!.measureText(text);
  return {
    width,
    height: actualBoundingBoxAscent + actualBoundingBoxDescent,
  };
};

const measureSprites = (
  sprites: Sprite[],
  font: string,
  fontSize: number,
  tracks: number,
  margin: number
): CompletedSprite[] => {
  let maxHeight = 0;
  const measuredSprites = sprites.map((s) => {
    const { width, height } = measureText(s.value, font, fontSize);
    maxHeight = Math.max(maxHeight, height);
    return {
      ...s,
      locs: [...s.locs],
      width,
    };
  });

  const spaceWidth = measureText(" ", font, fontSize).width;

  // Convert character locations to pixel locations
  for (let track = 0; track < tracks; track++) {
    const lines: {
      charLoc: number;
      x: number;
    }[] = [];
    for (const sprite of measuredSprites) {
      if (sprite.locs[track]) {
        const [x, y] = sprite.locs[track]!;
        if (lines[y] === undefined) {
          lines[y] = {
            charLoc: 0,
            x: 0,
          };
        }

        const charWidth = sprite.width < spaceWidth ? spaceWidth : sprite.width;
        const nudge =
          sprite.width < spaceWidth ? (charWidth - sprite.width) / 2 : 0;

        const spaces = x - lines[y].charLoc;
        lines[y].charLoc = x + sprite.value.toString().length;
        lines[y].x += spaces * spaceWidth;

        if (sprite.pixelLocs === undefined) {
          sprite.pixelLocs = [];
        }
        sprite.pixelLocs[track] = [
          lines[y].x + nudge + margin / 2,
          y * (maxHeight * 1.5) + margin / 2,
        ];
        sprite.height = maxHeight * 1.5;
        sprite.textHeight = maxHeight;

        lines[y].x += charWidth;
      }
    }
  }

  return measuredSprites as CompletedSprite[];
};

export default measureSprites;
