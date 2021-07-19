import {config} from "./_config.js";

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
				doc.querySelector(".world-edit").style.transform = `translate(${beforeMove[0] + step}px, ${beforeMove[1]}px`;
				break;
			case "r":
				doc.querySelector(".world-edit").style.transform = `translate(${beforeMove[0] - step}px, ${beforeMove[1]}px`;
				break;
			case "u":
				doc.querySelector(".world-edit").style.transform = `translate(${beforeMove[0]}px, ${beforeMove[1] + step}px`;
				break;
			case "d":
				doc.querySelector(".world-edit").style.transform = `translate(${beforeMove[0]}px, ${beforeMove[1] - step}px`;
				break;
		}
	}

	findTopLeftKey(obj, returnRaw = false) {
		let leftCol = Number.MAX_VALUE;
		let topRow = Number.MAX_VALUE;
		let coords = [];
		for (const coord in obj) {
			coords = coord.toString().split("-");
			coords[0] = parseInt(coords[0]);
			coords[1] = parseInt(coords[1]);
			if (coords[0] > leftCol || coords[1] > topRow) {
				continue;
			} else {
				leftCol = coords[0];
				topRow = coords[1];
			}
		}
		if (returnRaw) {
			return [leftCol, topRow];
		}
		return leftCol + "-" + topRow;
	}

	getRandomColor() {
		var letters = "0123456789ABCDEF";
		var color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
   }
   
   /**
    * 
    * @param {String} title The title to display on the error popup
    * @param {String} style The style of the popup (primary, warn, critical)
    * @param {String} message Explanation text on the body of the message
    * @param {Array} buttons Objects defining buttons containing fields "text" [str], "style" [str], and "action" [func]
    */
   async actionPopup(title = "ERROR", style = "primary", message = "Unspecified", buttons = [{ text: "Cancel", style: "primary", action: () => { } }]) {
      return new Promise((resolve, reject) => {
         let popup = document.createElement("DIV");
         popup.innerHTML = `
         <div class="overlay"></div>
         <div class="popup-box-wrap">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="error-btn-wrap"></div>
         </div>
         `;
         popup.classList.add("action-popup");
         switch (style) {
            case "primary":
               popup.classList.add("popup-primary");
               break;
            case "warn":
               popup.classList.add("popup-warn");
               break;
            case "critical":
               popup.classList.add("popup-critical");
               break;
         }
         document.querySelector("body").appendChild(popup);
         for (let a = 0; a < buttons.length; a++) {
            let btn = document.createElement("BUTTON");
            btn.innerText = buttons[a].text;
            switch (buttons[a].style) {
               case "primary":
                  btn.classList.add("error-btn-primary");
                  break;
               case "warn":
                  btn.classList.add("error-btn-warn");
                  break;
               case "critical":
                  btn.classList.add("error-btn-critical");
                  break;
            }
            popup.children[1].children[2].appendChild(btn);
            btn.addEventListener("click", () => {
               buttons[a].action();
               resolve();
            });
         }
      });
   }

   destroyPopup() {
      let popup = document.querySelector(".action-popup");
      popup.parentElement.removeChild(popup);
   }

   /* ex:
   this.Actions.actionPopup("TEST MSG", "This is a message for an action popup", [
         {
            text: "Btn1",
            style: "primary",
            action: () => {
               console.log("BTN1");
            }
         },
         {
            text: "Btn2",
            style: "warn",
            action: () => {
               console.log("BTN2");
            }
         },
         {
            text: "Btn3",
            style: "critical",
            action: () => {
               console.log("BTN3");
            }
         },
      ]);

   */

	DEBUG(output) {
		output.forEach((text) => {
			console.log(text);
		});
	}
}
