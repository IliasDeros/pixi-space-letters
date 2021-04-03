import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { DocumentMock } from "../test/DocumentMock";

export const keySpace = " ";
export type InputHandlerProps = {
  app: Application;
  documentMock?: DocumentMock;
};

export class InputHandler {
  app: Application;
  document: Document | DocumentMock;

  constructor({ app, documentMock }: InputHandlerProps) {
    this.app = app;
    this.document = documentMock || document;
  }

  onPressRight(movePlayerRight: () => void) {
    this.onKeydown("ArrowRight", movePlayerRight);
  }

  onPressLeft(movePlayerLeft: () => void) {
    this.onKeydown("ArrowLeft", movePlayerLeft);
  }

  onReleaseRight(stopPlayerRight: () => void) {
    this.onKeyup("ArrowRight", stopPlayerRight);
  }

  onReleaseLeft(stopPlayerLeft: () => void) {
    this.onKeyup("ArrowLeft", stopPlayerLeft);
  }

  onPressShoot(startFiring: () => void) {
    const dom = this.document;
    dom.addEventListener("mousedown", startFiring);
    dom.addEventListener("touchstart", startFiring);

    this.onKeydown(" ", startFiring);
  }

  onReleaseShoot(stopFiring: () => void) {
    const dom = this.document;

    dom.addEventListener("mouseup", stopFiring);
    dom.addEventListener("mouseupoutside", stopFiring);
    dom.addEventListener("touchend", stopFiring);
    dom.addEventListener("touchendoutside", stopFiring);

    this.onKeyup(" ", stopFiring);
  }

  onMouseMove(movePlayer: (xy: { x: number; y: number }) => void) {
    const { app } = this;

    const moveWithCoordinates = (event: PIXI.InteractionEvent) => {
      const { x, y } = event.data.global;
      movePlayer({ x, y });
    };

    app.renderer.plugins.interaction.on("mousemove", moveWithCoordinates);
  }

  onTouchMove(movePlayer: (xy: { x: number; y: number }) => void) {
    const { app } = this;

    const moveWithCoordinates = (event: PIXI.InteractionEvent) => {
      const { x, y } = event.data.global;
      movePlayer({ x, y });
    };

    app.renderer.plugins.interaction.on("touchmove", moveWithCoordinates);
  }

  onTouchEnd(callback: () => void) {
    const { app } = this;

    app.renderer.plugins.interaction.on("touchend", callback);
    app.renderer.plugins.interaction.on("touchendoutside", callback);
  }

  private onKeydown(key: string, callback: () => void) {
    this.document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key !== key) {
        return;
      }

      callback();
    });
  }

  private onKeyup(key: string, callback: () => void) {
    this.document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key !== key) {
        return;
      }

      callback();
    });
  }
}
