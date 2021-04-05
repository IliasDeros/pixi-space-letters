import { Sprite } from "pixi.js";
import { ScreenCollision } from "../src/ScreenCollision";
import { Bump } from "../vendor/Bump";

const bullet = {} as Sprite;
const letter = {} as Sprite;

describe("ScreenCollision", () => {
  describe("#collidesBulletsLetters", () => {
    it("returns no collision", () => {
      const bumpMock = ({
        hitTestRectangle() {}
      } as unknown) as Bump;

      const unit = new ScreenCollision([bullet], [letter], {
        bumpMock
      });
      const collisions = unit.collidesBulletsLetters();

      expect(collisions).toEqual([]);
    });

    it("returns one collision", () => {
      const bumpMock = ({
        hitTestRectangle: (sprite: Sprite, other: Sprite) =>
          sprite === bullet && other === letter
      } as unknown) as Bump;

      const unit = new ScreenCollision([bullet], [letter], {
        bumpMock
      });
      const collisions = unit.collidesBulletsLetters();

      expect(collisions).toEqual([{ bullet, letter }]);
    });
  });
});
