import { Application, Sprite, Texture } from "pixi.js";
import { ScreenCollision } from "./ScreenCollision";
import { ScreenDrawer } from "./ScreenDrawer";
import { ScreenResizer } from "./ScreenResizer";

export const withoutSprite = (sprites: Sprite[], spriteToRemove: Sprite) => {
  return sprites.filter((sprite) => sprite !== spriteToRemove);
};

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
  deadLetterSprites: Sprite[] = [];
  playerSprite!: Sprite;
  screenDrawer!: ScreenDrawer;
  screenResizer: ScreenResizer;
  lastTouchX = firstTouch;
  lastTouchY = firstTouch;

  constructor({ app }: ScreenProps) {
    this.app = app;
    this.screenResizer = new ScreenResizer({ app });
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

  animateDeadLetters = ({ alphaFactor = 0, rotateFactor = 0, speedY = 0 }) => {
    const { deadLetterSprites } = this;

    deadLetterSprites.forEach((letter) => {
      letter.y += speedY;
      letter.rotation += rotateFactor;
      letter.alpha += alphaFactor;

      if (letter.y <= -100) {
        this.removeDeadLetter(letter);
      }
    });
  };

  collisionBulletsLetters() {
    const { bulletSprites, letterSprites } = this;
    const collision = new ScreenCollision(bulletSprites, letterSprites);
    return collision.collidesBulletsLetters();
  }

  onClickPlayer(callback: () => void) {
    this.playerSprite.on("mousedown", callback);
    this.playerSprite.on("touchstart", callback);
  }

  movePlayerAbsolute = ({ x = 0, y = 0 }) => {
    this.playerSprite.x = x;
    this.playerSprite.y = y;
    this.keepPlayerInScreen();
  };

  movePlayerRelative = ({ x = 0, y = 0 }) => {
    this.playerSprite.x += x;
    this.playerSprite.y += y;
    this.keepPlayerInScreen();
  };

  movePlayerTouch = ({ x = 0, y = 0 }) => {
    const { lastTouchX, lastTouchY, playerSprite } = this;

    if (lastTouchX !== firstTouch) {
      playerSprite.x += x - lastTouchX;
      playerSprite.y += y - lastTouchY;
      this.keepPlayerInScreen();
    }

    this.lastTouchX = x;
    this.lastTouchY = y;
  };

  moveBulletRelative({ y = 0 }) {
    const incrementY = (sprite: Sprite) => (sprite.y += y);
    const removeOffScreen = (sprite: Sprite) => {
      const offScreenSafeDistance = -100;

      if (sprite.y < offScreenSafeDistance) {
        this.removeBullet(sprite);
      }
    };

    this.bulletSprites.forEach((sprite) => {
      incrementY(sprite);
      removeOffScreen(sprite);
    });
  }

  onWindowResize = () => {
    this.screenResizer.onWindowResize(this);
  };

  resetPlayerTouch = () => {
    this.lastTouchX = firstTouch;
    this.lastTouchY = firstTouch;
  };

  rotatePlayer(factor: number) {
    this.playerSprite.rotation += factor;
  }

  shootLetter(bullet: Sprite, letter: Sprite) {
    this.removeBullet(bullet);
    this.killLetter(letter);
  }

  private limitPlayerX() {
    const ship = this.playerSprite;

    const offsetX = ship.width / 2;
    const maxPlayerX = this.app.renderer.width - offsetX;
    const minPlayerX = 0 + offsetX;

    ship.x = Math.min(ship.x, maxPlayerX);
    ship.x = Math.max(ship.x, minPlayerX);
  }

  private limitPlayerY() {
    const ship = this.playerSprite;

    const offsetYBottom = ship.height / 2;
    const minPlayerY = this.app.renderer.height / 2;
    const maxPlayerY = this.app.renderer.height - offsetYBottom;

    ship.y = Math.min(ship.y, maxPlayerY);
    ship.y = Math.max(ship.y, minPlayerY);
  }

  private removeBullet(bullet: Sprite) {
    const { bulletSprites, screenDrawer } = this;
    this.bulletSprites = withoutSprite(bulletSprites, bullet);
    screenDrawer.removeSprite(bullet);
  }

  private removeDeadLetter(letter: Sprite) {
    const { deadLetterSprites, screenDrawer } = this;
    this.deadLetterSprites = withoutSprite(deadLetterSprites, letter);
    screenDrawer.removeSprite(letter);
  }

  private killLetter(letter: Sprite) {
    const { deadLetterSprites, letterSprites } = this;

    this.letterSprites = withoutSprite(letterSprites, letter);
    deadLetterSprites.push(letter);
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

        letterSprite.anchor.x = 0.5;
        letterSprite.anchor.y = 0.5;
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

  private keepPlayerInScreen = () => {
    this.limitPlayerX();
    this.limitPlayerY();
  };

  /** Spawn on top of the player */
  private getBulletSpawn() {
    const { playerSprite } = this;

    const playerTop = playerSprite.y;

    const bulletImageOffsetY = -45;

    return {
      x: playerSprite.x,
      y: playerTop + bulletImageOffsetY
    };
  }
}
