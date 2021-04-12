import { Application, Sprite } from "pixi.js";
import { ScreenDrawer } from "./ScreenDrawer";

/**
 * There is an animation when going from mobile to landscape
 * on mobile. Delay the resize handler until after the animation
 */
const fastMobileResizeMs = 500;

/** It takes longer on some slower devices */
const slowMobileResizeMs = 2000;

export type OnWindowResizeProps = {
  letterSprites: Sprite[];
  playerSprite: Sprite;
  screenDrawer: ScreenDrawer;
};

export type ScreenResizerProps = {
  app: Application;
};

export class ScreenResizer {
  app: Application;
  // On PC, we don't want to call the method for every pixel we resize
  resizeTimeoutFast?: number;
  resizeTimeoutSlow?: number;

  constructor({ app }: ScreenResizerProps) {
    this.app = app;
  }

  onWindowResize(props: OnWindowResizeProps) {
    const { app, resizeTimeoutFast, resizeTimeoutSlow } = this;
    const { letterSprites, playerSprite, screenDrawer } = props;
    const { width, height } = screenDrawer.getWindowSize();
    const widthDifference = width - app.renderer.width;
    const heightDifference = height - app.renderer.height;

    // Reposition player
    playerSprite.x += widthDifference / 2;
    playerSprite.y += heightDifference / 2;

    // Reposition letters
    letterSprites.forEach((letter) => {
      letter.x += widthDifference / 2;
      letter.y += heightDifference / 8;
    });

    // Re-draw stage
    screenDrawer.onWindowResize();

    // Repeat for mobile screen rotation delays
    const resize = () => this.onWindowResize(props);
    clearTimeout(resizeTimeoutFast);
    clearTimeout(resizeTimeoutSlow);
    this.resizeTimeoutFast = setTimeout(resize, fastMobileResizeMs);
    this.resizeTimeoutSlow = setTimeout(resize, slowMobileResizeMs);
  }
}
