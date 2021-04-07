import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { DocumentMock } from "../test/DocumentMock";
import { WindowMock } from "../test/WindowMock";
import { InputKeyboard } from "./InputKeyboard";

export const shootDelayMs = 500;
export const keySpace = " ";
export type InputHandlerProps = {
  app: Application;
  documentMock?: DocumentMock;
  windowMock?: WindowMock;
};

export class InputHandler {
  app: Application;
  document: Document | DocumentMock;
  window: Window | WindowMock;
  instance: InputKeyboard;

  constructor({ app, documentMock, windowMock }: InputHandlerProps) {
    this.app = app;
    this.document = documentMock || document;
    this.window = windowMock || window;

    this.instance = new InputKeyboard(this.document);
  }

  onPressRight(movePlayerRight: () => void) {
    this.instance.onKeydown("ArrowRight", movePlayerRight);
  }

  onPressLeft(movePlayerLeft: () => void) {
    this.instance.onKeydown("ArrowLeft", movePlayerLeft);
  }

  onReleaseRight(stopPlayerRight: () => void) {
    this.instance.onKeyup("ArrowRight", stopPlayerRight);
  }

  onReleaseLeft(stopPlayerLeft: () => void) {
    this.instance.onKeyup("ArrowLeft", stopPlayerLeft);
  }

  onPressShoot(fire: () => void) {
    const { clearInterval, setInterval, setTimeout } = this.window
    const dom = this.document;
    
    let intervalId: number | void
    let canShoot = true

    const fireAtInterval = () => {
      if (!canShoot) {
        return
      }
      
      canShoot = false
      fire()
      intervalId ||= setInterval(fire, shootDelayMs)       
      setTimeout(() => { canShoot = true }, shootDelayMs)
    }
    const cancelInterval = () => intervalId &&= clearInterval(intervalId)

    // start firing
    dom.addEventListener("mousedown", fireAtInterval);
    dom.addEventListener("touchstart", fireAtInterval);
    this.instance.onKeydown(" ", fireAtInterval);

    // stop firing
    dom.addEventListener("mouseup", cancelInterval);
    dom.addEventListener("mouseupoutside", cancelInterval);
    dom.addEventListener("touchend", cancelInterval);
    dom.addEventListener("touchendoutside", cancelInterval);
    this.instance.onKeyup(" ", cancelInterval);
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
}
