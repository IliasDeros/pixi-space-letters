import { Application, Sprite } from "pixi.js";

export type ScreenProps = {
  app: Application;
};

export class Screen {
  app: Application;
  playerShip!: Sprite;

  constructor({ app }: ScreenProps) {
    this.app = app;

    document.body.appendChild(app.view);
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  addPlayer(sprite: Sprite) {
    this.playerShip = sprite;
    sprite.interactive = true;
    this.initializePlayer();
  }

  onClickPlayer(callback: () => void) {
    this.playerShip.on("mousedown", callback);
    this.playerShip.on("touchstart", callback);
  }

  movePlayerRelative({ x = 0, y = 0 }) {
    this.playerShip.x += x;
    this.playerShip.y += y;
  }

  rotatePlayer(factor: number) {
    this.playerShip.rotation += factor;
  }

  private initializePlayer() {
    const { app, playerShip } = this;

    // Add the ship to the scene we are building.
    app.stage.addChild(playerShip);

    // Setup the position of the ship
    playerShip.x = app.renderer.width / 2;
    playerShip.y = app.renderer.height - app.renderer.height / 5;

    // Rotate around the center
    playerShip.anchor.x = 0.5;
    playerShip.anchor.y = 0.5;
  }
}
