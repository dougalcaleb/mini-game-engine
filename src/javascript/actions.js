import { config } from "./_config.js";

export class Actions {
   constructor() {
      this.quickViewMovement = false;
   }
   
   setEditViewDrag(obj, doc) {
      obj.editView.mode = "drag";
      doc.querySelector(".world-edit").style.cursor = "grab";
      for (let a = 0; a < doc.querySelector(".edit-view-header").children.length; a++) {
         doc.querySelector(".edit-view-header").children[a].classList.remove("header-selected");
      }
      doc.querySelector(".edit-view-drag").classList.add("header-selected");
   }

   setEditViewPlace(obj, doc) {
      obj.editView.mode = "paint";
      doc.querySelector(".world-edit").style.cursor = "default";
      for (let a = 0; a < doc.querySelector(".edit-view-header").children.length; a++) {
         doc.querySelector(".edit-view-header").children[a].classList.remove("header-selected");
      }
      doc.querySelector(".edit-view-place").classList.add("header-selected");
   }

   setEditViewErase(obj, doc) {
      obj.editView.mode = "erase";
      doc.querySelector(".world-edit").style.cursor = "default";
      for (let a = 0; a < doc.querySelector(".edit-view-header").children.length; a++) {
         doc.querySelector(".edit-view-header").children[a].classList.remove("header-selected");
      }
      doc.querySelector(".edit-view-erase").classList.add("header-selected");
   }

   enableQuickViewMovement() {
      this.quickViewMovement = true;
   }

   disableQuickViewMovement() {
      this.quickViewMovement = false;
   }

   moveEditView(obj, doc, direction) {
      let step = config.editviewMoveStep * (this.quickViewMovement ? config.fastMovementMultiplier : 1);
      let beforeMove = doc.querySelector(".world-edit").style.transform.split(", ");
      beforeMove[0] = parseInt(beforeMove[0].split("(").pop());
      beforeMove[1] = parseInt(beforeMove[1]);
      switch (direction) {
         case "l":
            doc.querySelector(".world-edit").style.transform = `translate(${(beforeMove[0] + step)}px, ${beforeMove[1]}px`;
            break;
         case "r":
            doc.querySelector(".world-edit").style.transform = `translate(${(beforeMove[0] - step)}px, ${beforeMove[1]}px`;
            break;
         case "u":
            doc.querySelector(".world-edit").style.transform = `translate(${beforeMove[0]}px, ${(beforeMove[1] + step)}px`;
            break;
         case "d":
            doc.querySelector(".world-edit").style.transform = `translate(${beforeMove[0]}px, ${(beforeMove[1] - step)}px`;
            break;
      }
   }
}