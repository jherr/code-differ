import { Sprite, Token } from "./types";

function createSpritesFromTracks(tracks: Token[][]): Sprite[] {
  const sprites: Record<number, Sprite> = {};

  tracks.forEach((track, i) => {
    track
      .filter(({ value }) => {
        if (typeof value === "number") {
          return (value as unknown as string).toString();
        }
        return value.trim && value?.trim()?.length;
      })
      .forEach((token) => {
        if (!sprites[token.id!]) {
          sprites[token.id!] = {
            id: token.id!,
            value: token.value,
            locs: new Array(tracks.length).fill(null),
            state: new Array(tracks.length).fill("hidden"),
            color: token.color!,
            italic: token.italic!,
            className: token.className!,
          };
        }
        const sprite: Sprite = sprites[token.id!];
        sprite.locs[i] = [token.loc.start.column, token.loc.start.line];
      });
  });

  Object.keys(sprites).forEach((id) => {
    const sprite: Sprite = sprites[id as unknown as number];
    let visible = false;
    let preShown = true;
    sprite.locs.forEach((loc, i) => {
      if (loc) {
        sprite.state![i] = "shown";
        visible = true;
      } else if (visible) {
        sprite.state![i] = "hidden";
      } else if (preShown) {
        sprite.state![i] = "pre-shown";
      }
    });
  });

  return Object.values(sprites);
}

export default createSpritesFromTracks;
