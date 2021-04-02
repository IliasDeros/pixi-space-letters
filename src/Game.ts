import { Screen } from "./Screen";

export const playerRotationSpeed = 0.01;
export const playerSpeedX = 1;

type GameProps = {
  screen: Screen;
};

export class Game {
  playerRotation = playerRotationSpeed;
  playerSpeedRight = 0;
  screen: Screen;

  constructor({ screen }: GameProps) {
    this.screen = screen;
  }

  loop() {
    const { playerRotation, playerSpeedRight, screen } = this;
    screen.rotatePlayer(playerRotation);
    screen.movePlayerRelative({
      x: playerSpeedRight
    });
  }

  movePlayerRight = () => {
    this.playerSpeedRight = playerSpeedX;
  };

  stopPlayerRight = () => {
    this.playerSpeedRight = 0;
  };

  togglePlayerRotation = () => {
    this.playerRotation = this.playerRotation ? 0 : playerRotationSpeed;
  };
}
