import { InputManager } from "./InputManager";
import { Game } from "./Game";
import { Screen } from "./Screen";

export type ControllerProps = {
  inputManager: InputManager;
  game: Game;
  screen: Screen;
};

export class Controller {
  inputManager: InputManager;
  game: Game;
  screen: Screen;

  constructor({ inputManager, game, screen }: ControllerProps) {
    this.inputManager = inputManager;
    this.game = game;
    this.screen = screen;
  }

  enableBasicMoves() {
    this.handleInput();
  }

  private handleInput() {
    const { inputManager, game, screen } = this;

    inputManager.onPressRight(game.movePlayerRight);
    inputManager.onPressLeft(game.movePlayerLeft);
    inputManager.onMouseMove(screen.movePlayerAbsolute);
    inputManager.onTouchMove(screen.movePlayerTouch);
    inputManager.onTouchEnd(screen.resetPlayerTouch);
    inputManager.onReleaseRight(game.stopPlayerRight);
    inputManager.onReleaseLeft(game.stopPlayerLeft);
    inputManager.onPressShoot(screen.addBullet);
  }
}
