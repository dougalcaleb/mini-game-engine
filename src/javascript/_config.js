export const config = {
   keybinds: [
      { action: "editview.move", key: "m", alternate: "1" },
      { action: "editview.paint", key: "p", alternate: "2" },
      { action: "editview.erase", key: "e", alternate: "3" },
      { action: "editview.moveUp", key: "ArrowUp" },
      { action: "editview.moveDown", key: "ArrowDown" },
      { action: "editview.moveLeft", key: "ArrowLeft" },
      { action: "editview.moveRight", key: "ArrowRight" },
      { action: "editview.moveFast", key: "Shift" },
      { action: "DEBUG", key: "`" },
   ],
   editviewMoveStep: 25,
   fastMovementMultiplier: 3,
}