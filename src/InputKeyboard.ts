import { DocumentMock } from "../test/DocumentMock";

export class InputKeyboard {
  document: Document | DocumentMock;

  constructor(document: Document | DocumentMock) {
    this.document = document;
  }

  onKeydown(key: string, callback: () => void) {
    this.document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key !== key) {
        return;
      }

      callback();
    });
  }

  onKeyup(key: string, callback: () => void) {
    this.document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key !== key) {
        return;
      }

      callback();
    });
  }
}
