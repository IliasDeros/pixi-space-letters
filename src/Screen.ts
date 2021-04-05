import { Application, Sprite, Texture } from "pixi.js";
import { ScreenCollision } from "./ScreenCollision";
import { ScreenDrawer } from "./ScreenDrawer";

export const firstTouch = -1;

export type ScreenProps = {
  app: Application;
};

export type ScreenInitializeProps = {
  ship: Sprite;
  bulletTexture: Texture;
  text: string;
};

export class Screen {
  app: Application;
  bulletSprites: Sprite[] = [];
  letterSprites: Sprite[] = [];
  playerSprite!: Sprite;
  screenDrawer!: ScreenDrawer;
  lastTouchX = firstTouch;
  lastTouchY = firstTouch;

  constructor({ app }: ScreenProps) {
    this.app = app;
  }

  initialize({ bulletTexture, ship, text }: ScreenInitializeProps) {
    const { app } = this;
    this.screenDrawer = new ScreenDrawer({ app, bulletTexture });
    this.addPlayer(ship);
    this.addText(text);
  }

  addBullet = () => {
    const spawn = this.getBulletSpawn();
    const bulletSprite = this.screenDrawer.addBullet(spawn);
    this.bulletSprites.push(bulletSprite);
  };

  limitPlayerX() {
    const ship = this.playerSprite;

    const offsetX = ship.width / 2;
    const maxPlayerX = this.app.renderer.width - offsetX;
    const minPlayerX = 0 + offsetX;

    ship.x = Math.min(ship.x, maxPlayerX);
    ship.x = Math.max(ship.x, minPlayerX);
  }

  limitPlayerY() {
    const ship = this.playerSprite;

    const offsetYBottom = ship.height / 2;
    const minPlayerY = this.app.renderer.height / 2;
    const maxPlayerY = this.app.renderer.height - offsetYBottom;

    ship.y = Math.min(ship.y, maxPlayerY);
    ship.y = Math.max(ship.y, minPlayerY);
  }

  onClickPlayer(callback: () => void) {
    this.playerSprite.on("mousedown", callback);
    this.playerSprite.on("touchstart", callback);
  }

  movePlayerAbsolute = ({ x = 0, y = 0 }) => {
    this.playerSprite.x = x;
    this.playerSprite.y = y;

    // Avoid the player going off screen
    this.limitPlayerX();
    this.limitPlayerY();
  };

  movePlayerRelative = ({ x = 0, y = 0 }) => {
    this.playerSprite.x += x;
    this.playerSprite.y += y;

    // Avoid the player going off screen
    this.limitPlayerX();
    this.limitPlayerY();
  };

  movePlayerTouch = ({ x = 0, y = 0 }) => {
    const { lastTouchX, lastTouchY, playerSprite } = this;

    if (lastTouchX !== firstTouch) {
      playerSprite.x += x - lastTouchX;
      playerSprite.y += y - lastTouchY;

      // Avoid the player going off screen
      this.limitPlayerX();
      this.limitPlayerY();
    }

    this.lastTouchX = x;
    this.lastTouchY = y;
  };

  moveBulletRelative({ y = 0 }) {
    this.bulletSprites.forEach((sprite) => (sprite.y += y));
  }

  collisionBulletsLetters() {
    const { bulletSprites, letterSprites } = this;
    const collision = new ScreenCollision(bulletSprites, letterSprites);
    return collision.collidesBulletsLetters();
  }

  onWindowResize() {
    this.screenDrawer.onWindowResize();
  }

  resetPlayerTouch = () => {
    this.lastTouchX = firstTouch;
    this.lastTouchY = firstTouch;
  };

  rotatePlayer(factor: number) {
    this.playerSprite.rotation += factor;
  }

  private addText = (text: string) => {
    const { app, screenDrawer } = this;
    const lettersStartY = app.renderer.height / 10;

    // Split up words
    const words = text.split(" ");

    // Draw each letters in the words individually
    words.reduce((y, word) => {
      const wordText = screenDrawer.generateText(word);
      const wordWidth = wordText.width;

      // Center the word horizontally
      const screenCenterX = app.renderer.width / 2;
      const wordStartX = screenCenterX - wordWidth / 2;
      word.split("").reduce((x, letter) => {
        const letterSprite = screenDrawer.addText({
          text: letter,
          x,
          y
        });

        this.letterSprites.push(letterSprite);

        return x + letterSprite.width;
      }, wordStartX);

      return y + wordText.height;
    }, lettersStartY);
  };

  private addPlayer = (playerSprite: Sprite) => {
    const { app } = this;
    this.playerSprite = playerSprite;
    playerSprite.interactive = true;

    const x = app.renderer.width / 2;
    const y = app.renderer.height - app.renderer.height / 5;

    this.screenDrawer.addPlayer({ playerSprite, x, y });
  };

  /** Spawn on top of the player */
  private getBulletSpawn() {
    const { playerSprite } = this;
    const playerCenter = playerSprite.x + playerSprite.width / 2;
    const playerTop = playerSprite.y;

    const bulletImageOffsetX = 20;
    const bulletImageOffsetY = -5;

    return {
      x: bulletImageOffsetX + playerCenter,
      y: playerTop + bulletImageOffsetY
    };
  }
}
