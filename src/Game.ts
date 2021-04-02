import { Screen } from "./Screen";

const playerRotationSpeed = 0.01;

type GameProps = {
  screen: Screen;
};

export class Game {
  playerRotation = playerRotationSpeed;
  screen: Screen;

  constructor({ screen }: GameProps) {
    this.screen = screen;
  }

  loop() {
    const { playerRotation, screen } = this;
    screen.rotatePlayer(playerRotation);
  }

  movePlayerRight = () => {
    throw new Error("Not implemented yet");
  };

  stopPlayerRight = () => {
    throw new Error("Not implemented yet");
  };

  togglePlayerRotation = () => {
    this.playerRotation = this.playerRotation ? 0 : playerRotationSpeed;
  };
}
