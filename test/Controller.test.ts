import { InputHandler } from "../src/InputHandler";
import { Controller } from "../src/Controller";
import { Screen } from "../src/Screen";
import { playerSpeedX, Game } from "../src/Game";
import { DocumentMock } from "./DocumentMock";
import { WindowMock } from "./WindowMock";
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
  let windowMock: WindowMock;

  const waitDispatchKey = (keycode: string) => {
    const event = new KeyboardEvent("keydown", { key: keycode });
    documentMock.dispatchEvent(event);
    return new Promise((res) => setTimeout(res, 0)); // let keydown be called
  };

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
    windowMock = {
      clearInterval: jest.fn(),
      setInterval: jest.fn(),
      setTimeout: jest.fn()
    };

    // mock screen
    screen = ({
      addBullet: jest.fn(),
      collisionBulletsLetters: jest.fn(() => []),
      movePlayerRelative: jest.fn(),
      moveBulletRelative() {},
      onClickPlayer() {},
      rotatePlayer() {}
    } as unknown) as Screen;

    startController = () => {
      game = new Game({ screen });
      inputHandler = new InputHandler({
        app: appMock,
        documentMock,
        windowMock
      });
      const controller = new Controller({ inputHandler, game, screen });
      controller.start();
      return controller;
    };
  });

  describe("#playerMovement", () => {
    it("moves the player right on key press", async () => {
      startController();

      await waitDispatchKey("ArrowRight");
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

  describe("#playerShooting", () => {
    const dispatchShoot = () => waitDispatchKey(" ");

    it("fires on space press", async () => {
      startController();

      await dispatchShoot();
      game.loop();

      expect(screen.addBullet).toHaveBeenCalled();
    });

    it("fires every interval on space press", async () => {
      startController();

      await dispatchShoot();
      game.loop();
      const onInterval = (windowMock.setInterval as jest.Mock).mock.calls[0][0];
      onInterval();
      game.loop();

      expect(screen.addBullet).toHaveBeenCalledTimes(2);
    });

    describe("#canShoot", () => {
      it("cannot fire before the interval is done", async () => {
        startController();

        await dispatchShoot();
        game.loop();
        await dispatchShoot();
        game.loop();

        expect(screen.addBullet).toHaveBeenCalledTimes(1);
      });

      it("can fire again after the interval", async () => {
        startController();

        await dispatchShoot();
        game.loop();
        const canShootTimeout = (windowMock.setTimeout as jest.Mock).mock
          .calls[0][0];
        canShootTimeout();
        await dispatchShoot();
        game.loop();

        expect(screen.addBullet).toHaveBeenCalledTimes(2);
      });
    });
  });
});
