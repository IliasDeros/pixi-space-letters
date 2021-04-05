import { Screen } from "./Screen";

export const playerSpeedX = 5;
export const bulletSpeedY = -8;

type GameProps = {
  screen: Screen;
};

export class Game {
  playerSpeedRight = 0;
  playerSpeedLeft = 0;
  screen: Screen;
  static message = "";

  constructor({ screen }: GameProps) {
    this.screen = screen;
  }

  loop() {
    const { playerSpeedRight, playerSpeedLeft, screen } = this;

    screen.movePlayerRelative({
      x: playerSpeedRight + playerSpeedLeft
    });
    screen.moveBulletRelative({ y: bulletSpeedY });
    this.shootLetters();
  }

  movePlayerRight = () => {
    this.playerSpeedRight = playerSpeedX;
  };
  movePlayerLeft = () => {
    this.playerSpeedLeft = -playerSpeedX;
  };

  shootLetters() {
    // If a letter collides with a bullet,
    const collisions = this.screen.collisionBulletsLetters();

    collisions.forEach((collision) =>
      this.screen.shootLetter(collision.bullet, collision.letter)
    );
  }

  stopPlayerRight = () => {
    this.playerSpeedRight = 0;
  };
  stopPlayerLeft = () => {
    this.playerSpeedLeft = 0;
  };
}
