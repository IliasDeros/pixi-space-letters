import { Screen } from "./Screen";

export const playerSpeedX = 5;
export const bulletSpeedY = -3;

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
}
