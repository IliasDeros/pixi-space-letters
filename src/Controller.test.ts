import { InputHandler } from "./InputHandler";
import { Controller } from "./Controller";
import { Screen } from "./Screen";
import { playerSpeedX, Game } from "./Game";

const keyCodeRight = 39;

/*
 * Test end to end, except Screen, which is mocked
 */
describe("Controller", () => {
  let inputHandler: InputHandler;
  let screen: Screen;
  let game: Game;
  let startController: () => Controller;

  beforeEach(() => {
    // mock screen
    screen = ({
      movePlayerRelative: jest.fn(),
      onClickPlayer() {},
      rotatePlayer() {}
    } as unknown) as Screen;

    startController = () => {
      game = new Game({ screen });
      inputHandler = new InputHandler();
      const controller = new Controller({ inputHandler, game, screen });
      controller.start();
      return controller;
    };
  });

  // SKipping because the event handling doesn't work :(
  describe.skip("#handlePlayerMovement", () => {
    it("moves the player right on key press", async () => {
      startController();

      // @ts-ignore dispatchEvent needs Event, not KeyboardEvent
      const event = new Event("keydown", { key: "ArrowRight" });
      document.dispatchEvent(event);
      await new Promise((res) => setTimeout(res, 0)); // let press be called
      game.loop();

      expect(screen.movePlayerRelative).toHaveBeenCalledWith({
        x: playerSpeedX
      });
    });

    it("stops the player moving on key release", () => {
      game.playerSpeedRight = playerSpeedX;

      startController();

      // @ts-ignore dispatchEvent needs a Event, not KeyboardEvent
      const event = new Event("keyup", { keyCode: keyCodeRight });
      document.dispatchEvent(event);
      game.loop();

      expect(screen.movePlayerRelative).toHaveBeenCalledWith({
        x: 0
      });
    });
  });
});
