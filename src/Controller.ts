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
    const { game, screen } = this;

    this.handlePlayerMovement();
    screen.onClickPlayer(game.togglePlayerRotation);
  }

  private handlePlayerMovement() {
    const { inputHandler, game } = this;

    inputHandler.onPressRight(game.movePlayerRight);
    inputHandler.onPressLeft(game.movePlayerLeft);
    inputHandler.onReleaseRight(game.stopPlayerRight);
    inputHandler.onReleaseLeft(game.stopPlayerLeft);
  }
}
