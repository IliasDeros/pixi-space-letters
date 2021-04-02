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
    this.onKeydown((e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        movePlayerRight();
      }
    });
  }
  onPressLeft(movePlayerLeft: () => void) {
    this.onKeydown((e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        movePlayerLeft();
      }
    });
  }

  onReleaseRight(stopPlayerRight: () => void) {
    this.onKeyup((e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        stopPlayerRight();
      }
    });
  }

  onReleaseLeft(stopPlayerLeft: () => void) {
    this.onKeyup((e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        stopPlayerLeft();
      }
    });
  }

  onPressShoot(fireBullet: () => void) {
    this.onKeydown((e: KeyboardEvent) => {
      if (e.key === " ") {
        fireBullet();
      }
    });
  }

  private onKeydown(callback: (e: KeyboardEvent) => void) {
    this.document.addEventListener("keydown", callback);
  }

  private onKeyup(callback: (e: KeyboardEvent) => void) {
    this.document.addEventListener("keyup", callback);
  }
}
