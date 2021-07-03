export const config = {
   keybinds: [
      { action: "editview.move", key: "m" },
      { action: "editview.paint", key: "p" },
      { action: "editview.erase", key: "e" },
      { action: "editview.moveUp", key: "ArrowUp" },
      { action: "editview.moveDown", key: "ArrowDown" },
      { action: "editview.moveLeft", key: "ArrowLeft" },
      { action: "editview.moveRight", key: "ArrowRight" },
      { action: "editview.moveFast", key: "Shift" },
   ],
   editviewMoveStep: 25,
   fastMovementMultiplier: 3,
}