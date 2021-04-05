import { Sprite } from "pixi.js";
import { Bump } from "../vendor/Bump";

export type CollisionBulletLetter = {
  bullet: Sprite;
  letter: Sprite;
};

export type ScreenCollisionOptions = {
  bumpMock?: Bump;
};

export class ScreenCollision {
  bump: Bump;
  others: Sprite[];
  sprites: Sprite[];

  constructor(
    sprites: Sprite[],
    others: Sprite[],
    { bumpMock }: ScreenCollisionOptions = {}
  ) {
    this.others = others;
    this.sprites = sprites;
    this.bump = bumpMock || new Bump();
  }

  /**
   * Detect collisions between bullets and letters.
   * Assuming "this.sprites" is bullets, "this.others"
   * is the letters
   *
   * @returns [{ bullet: Sprite, letter: Sprite }, ...]
   */
  collidesBulletsLetters(): CollisionBulletLetter[] {
    const { sprites: bullets, others: letters } = this;

    return bullets.reduce((acc, bullet) => {
      const collidedLetters = letters.reduce((collisions, letter) => {
        if (this.intersectSprites(bullet, letter)) {
          collisions.push({ bullet, letter });
        }

        return collisions;
      }, [] as CollisionBulletLetter[]);

      return acc.concat(collidedLetters);
    }, [] as CollisionBulletLetter[]);
  }

  /**
   * Detect collision between two sprites
   *
   * @returns true if the two sprites are in collision
   */
  private intersectSprites(sprite: Sprite, other: Sprite) {
    return this.bump.hitTestRectangle(sprite, other);
  }
}
