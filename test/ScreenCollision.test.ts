import { Sprite } from "pixi.js";
import { ScreenCollision } from "../src/ScreenCollision";
import { Bump } from "../vendor/Bump";

describe("ScreenCollision", () => {
  describe("#collidesBulletsLetters", () => {
    it("returns one collision", () => {
      const bullet = {} as Sprite;
      const letter = {} as Sprite;
      const bumpMock = ({
        hitTestRectangle: jest
          .fn()
          .mockImplementation(
            (sprite, other) => sprite === bullet && other === letter
          )
      } as unknown) as Bump;

      const unit = new ScreenCollision([bullet], [letter], {
        bumpMock
      });
      const collisions = unit.collidesBulletsLetters();

      expect(collisions).toEqual([{ bullet, letter }]);
    });
  });
});
