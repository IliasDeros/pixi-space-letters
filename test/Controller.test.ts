import { InputHandler } from "../src/InputHandler";
import { Controller } from "../src/Controller";
import { Screen } from "../src/Screen";
import { playerSpeedX, Game } from "../src/Game";
import { DocumentMock } from "./DocumentMock";
import { Application } from "pixi.js";

const keyCodeRight = 39;

/*
 * Test end to end, except Screen, which is mocked
 */
describe("Controller", () => {
  let inputHandler: InputHandler;
  let screen: Screen;
  let game: Game;
  let startController: () => Controller;
  let appMock: Application;
  let documentMock: DocumentMock;

  beforeEach(() => {
    appMock = ({
      renderer: {
        plugins: {
          interaction: {
            on() {}
          }
        }
      }
    } as unknown) as Application;
    documentMock = new DocumentMock();

    // mock screen
    screen = ({
      movePlayerRelative: jest.fn(),
      moveBulletRelative() {},
      onClickPlayer() {},
      rotatePlayer() {}
    } as unknown) as Screen;

    startController = () => {
      game = new Game({ screen });
      inputHandler = new InputHandler({ app: appMock, documentMock });
      const controller = new Controller({ inputHandler, game, screen });
      controller.start();
      return controller;
    };
  });

  describe("#handlePlayerMovement", () => {
    it("moves the player right on key press", async () => {
      startController();

      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      documentMock.dispatchEvent(event);
      await new Promise((res) => setTimeout(res, 0)); // let keydown be called
      game.loop();

      expect(screen.movePlayerRelative).toHaveBeenCalledWith({
        x: playerSpeedX
      });
    });

    it("stops the player moving on key release", async () => {
      game.playerSpeedRight = playerSpeedX;

      startController();

      const event = new KeyboardEvent("keyup", { keyCode: keyCodeRight });
      documentMock.dispatchEvent(event);
      await new Promise((res) => setTimeout(res, 0)); // let keyup be called
      game.loop();

      expect(screen.movePlayerRelative).toHaveBeenCalledWith({
        x: 0
      });
    });
  });
});
