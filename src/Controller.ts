import { InputHandler } from "./InputHandler";
import { Game } from "./Game";
import { Screen } from "./Screen";

export type ControllerProps = {
  inputHandler: InputHandler;
  game: Game;
  screen: Screen;
};

export class Controller {
  inputHandler: InputHandler;
  game: Game;
  screen: Screen;

  constructor({ inputHandler, game, screen }: ControllerProps) {
    this.inputHandler = inputHandler;
    this.game = game;
    this.screen = screen;
  }

  start() {
    this.handlePlayerMovement();
  }

  private handlePlayerMovement() {
    const { inputHandler, game, screen } = this;

    screen.onClickPlayer(game.togglePlayerRotation);
    inputHandler.onPressRight(game.movePlayerRight);
    inputHandler.onReleaseRight(game.stopPlayerRight);
  }
}
