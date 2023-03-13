import { getPatch } from "fast-array-diff";

import { Token } from "./types";

const createTracksFromTokens = (rawTokens: Token[][]): Token[][] => {
  if (rawTokens.length === 0) {
    return [];
  }

  let id = 1;
  const sprites: Token[][] = [
    rawTokens[0].map((t) => ({
      id: id++,
      ...t,
    })),
  ];

  for (let i = 1; i < rawTokens.length; i++) {
    let patch = getPatch(
      sprites[i - 1],
      rawTokens[i],
      (a, b) => a.value === b.value
    );

    let newSprites = [...sprites[i - 1]];
    patch
      .filter((p) => p.type === "remove")
      .forEach((p) => {
        p.items.forEach(({ id }) => {
          newSprites = newSprites.filter((s) => s.id !== id);
        });
      });
    patch
      .filter((p) => p.type === "add")
      .forEach((p) => {
        newSprites = [
          ...newSprites.slice(0, p.newPos),
          ...p.items.map((t) => ({
            id: id++,
            ...t,
          })),
          ...newSprites.slice(p.newPos),
        ];
      });

    rawTokens[i].forEach((token, i) => {
      newSprites[i] = {
        ...newSprites[i],
        loc: token.loc,
      };
    });

    sprites.push(newSprites);
  }

  return sprites;
};

export default createTracksFromTokens;
