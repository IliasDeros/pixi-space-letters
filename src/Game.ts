import { Screen } from "./Screen";

/** Speed is in pixels per second */
export const playerSpeedX = 5;
export const bulletSpeedY = -8;
export const deadLetterSpeedY = -5;
export const deadLetterRotateFactor = 0.05;
export const deadLetterAlphaFactor = -0.025;

export type GameProps = {
  screen: Screen;
};

type SpeedByDeltaProps = {
  /** Time, in milliseconds, since last frame */
  delta: number;

  /** How much pixels we should move every 60/120 frames */
  pixelsPerSecond: number;
};

export class Game {
  playerSpeedRight = 0;
  playerSpeedLeft = 0;
  screen: Screen;
  static message = "";

  constructor({ screen }: GameProps) {
    this.screen = screen;
  }

  loop(frameDeltaMs = 1) {
    const { playerSpeedRight, playerSpeedLeft, screen } = this;

    // Consider frames skipped because the processor was busy
    const adjustSpeed = (speed: number) => {
      return this.speedByDelta({
        delta: frameDeltaMs,
        pixelsPerSecond: speed
      });
    };

    screen.movePlayerRelative({
      x: adjustSpeed(playerSpeedRight) + adjustSpeed(playerSpeedLeft)
    });
    screen.moveBulletRelative({ y: adjustSpeed(bulletSpeedY) });
    screen.animateDeadLetters({
      alphaFactor: adjustSpeed(deadLetterAlphaFactor),
      rotateFactor: adjustSpeed(deadLetterRotateFactor),
      speedY: adjustSpeed(deadLetterSpeedY)
    });
    this.shootLetters();
  }

  movePlayerRight = () => {
    this.playerSpeedRight = playerSpeedX;
  };

  movePlayerLeft = () => {
    this.playerSpeedLeft = -playerSpeedX;
  };

  stopPlayerRight = () => {
    this.playerSpeedRight = 0;
  };

  stopPlayerLeft = () => {
    this.playerSpeedLeft = 0;
  };

  private speedByDelta({ delta, pixelsPerSecond }: SpeedByDeltaProps) {
    return pixelsPerSecond * delta;
  }

  private shootLetters() {
    const [shotLetter] = this.screen.collisionBulletsLetters();

    if (shotLetter) {
      this.screen.shootLetter(shotLetter.bullet, shotLetter.letter);
    }
  }
}
