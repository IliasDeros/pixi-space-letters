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

    inputHandler.onPressRight(game.movePlayerRight);
    inputHandler.onPressLeft(game.movePlayerLeft);
    inputHandler.onMouseMove(screen.movePlayerAbsolute);
    inputHandler.onTouchMove(screen.movePlayerTouch);
    inputHandler.onTouchEnd(screen.resetPlayerTouch);

    inputHandler.onReleaseRight(game.stopPlayerRight);
    inputHandler.onReleaseLeft(game.stopPlayerLeft);
    inputHandler.onPressShoot(screen.addBullet);
  }
}
