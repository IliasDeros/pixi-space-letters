import { DocumentMock } from "../test/DocumentMock";

export const keySpace = " ";
export type InputHandlerProps = {
  documentMock?: DocumentMock;
};

export class InputHandler {
  document: Document | DocumentMock;

  constructor({ documentMock }: InputHandlerProps = {}) {
    this.document = documentMock || document;
  }

  onPressRight(movePlayerRight: () => void) {
    this.document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        movePlayerRight();
      }
    });
  }
  onPressLeft(movePlayerLeft: () => void) {
    this.document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        movePlayerLeft();
      }
    });
  }

  onReleaseRight(stopPlayerRight: () => void) {
    this.document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        stopPlayerRight();
      }
    });
  }

  onReleaseLeft(stopPlayerLeft: () => void) {
    this.document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        stopPlayerLeft();
      }
    });
  }
  onPressShoot(fireBullet: () => void) {
    this.document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === " ") {
        fireBullet();
      }
    });
  }
}
