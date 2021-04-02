export const keySpace = " ";

export class InputHandler {
  onPressRight(movePlayerRight: () => void) {
    // TODO: run when the right arrow key is pressed
    // callback()

    // function key(event: Event) {
    //   console.log(event);
    // }
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      // right
      if (e.key === "ArrowRight") {
        movePlayerRight();
      }
    });
  }
  onPressLeft(movePlayerLeft: () => void) {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      // left
      if (e.key === "ArrowLeft") {
        movePlayerLeft();
      }
    });
  }

  onReleaseRight(stopPlayerRight: () => void) {
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      // right
      if (e.key === "ArrowRight") {
        stopPlayerRight();
      }
    });
  }

  onReleaseLeft(stopPlayerLeft: () => void) {
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") stopPlayerLeft();
    });
  }
  onPressShoot(fireBullet: () => void) {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === " ") {
        fireBullet();
      }
    });
  }
}
