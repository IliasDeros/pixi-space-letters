import { Screen } from "./Screen";

export const playerRotationSpeed = 0.01;
export const playerSpeedX = 1;

type GameProps = {
  screen: Screen;
};

export class Game {
  playerRotation = playerRotationSpeed;
  playerSpeedRight = 0;
  playerSpeedLeft = 0;
  screen: Screen;

  constructor({ screen }: GameProps) {
    this.screen = screen;
  }

  loop() {
    const { playerRotation, playerSpeedRight, playerSpeedLeft, screen } = this;
    screen.rotatePlayer(playerRotation);
    screen.movePlayerRelative({
      x: playerSpeedRight + playerSpeedLeft
    });
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

  togglePlayerRotation = () => {
    this.playerRotation = this.playerRotation ? 0 : playerRotationSpeed;
  };
}
