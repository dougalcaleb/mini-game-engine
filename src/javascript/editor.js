import { game } from "../../game/game.js";
import { config } from "./_config.js";
import { Actions } from "./actions.js";

export class Editor {
   constructor(splash, physics) {
      this.elements = {};
      this.gameView = {};
      this.editView = {
         mode: "drag",
         selectedElement: null,
      };
      this.inspector = {};

      this.game = {
         objects: {},
         background: "#09c4e8",
      }

      this.Physics = physics;
      this.Splash = splash;

      this.Splash.add("Initializing Actions Module...");
      this.Actions = new Actions();
      this.Splash.add("Actions Module Ready");
   }

   //? ======================================================================================================
   //? COMMENT
   //? ======================================================================================================

   init() {
      this.Splash.add("Initializing Editor...");
      this.createDropdowns();
      this.Splash.add("Editor component 1 complete");
      this.worldeditDrag();
      this.Splash.add("Editor component 2 complete");
      this.worldeditPaintDrag();
      this.Splash.add("Editor component 3 complete");
      this.worldeditEraseDrag();
      this.Splash.add("Editor component 4 complete");
      this.headerBarsEvents();
      this.Splash.add("Editor component 5 complete");
      this.inspectorEvents();
      this.Splash.add("Editor component 6 complete");
      this.populateElements();
      this.Splash.add("Editor component 7 complete");
      this.setupKeybinds();
      this.Splash.add("Editor component 8 complete");
      this.complete();
      // this.debug();
   }

   complete() {
      this.Splash.add("Editor Ready");
   }

   //? ======================================================================================================
   //? General
   //? ======================================================================================================

   createDropdowns() {
      for (let a = 0; a < document.querySelectorAll(".expandable").length; a++) {
         let exp = document.querySelectorAll(".expandable")[a];

         exp.style.paddingTop = "35px";
         
         let button = document.createElement("DIV");
         button.classList.add("expand-button");
         button.innerHTML = `<div class="clickable"></div><svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>`;
         
         exp.insertBefore(button, exp.childNodes[0]);
         
         if (exp.classList.contains("start-expanded")) {
           exp.classList.add("dd-expanded");
         } else {
            button.parentElement.style.height = "0px";
            button.children[1].style.transform = "rotate(90deg)";
         }

         document.querySelectorAll(".expand-button")[a].children[0].addEventListener("click", (event) => {
            let parentExp = event.target.parentElement.parentElement;
            if (parentExp.classList.contains("dd-expanded")) {
               parentExp.style.height = "0px";
               event.target.parentElement.children[1].style.transform = "rotate(90deg)";
               parentExp.classList.remove("dd-expanded");
            } else {
               parentExp.style.height = "";
               parentExp.classList.add("dd-expanded");
               event.target.parentElement.children[1].style.transform = "";
            }
         });
      }
   }

   //? ======================================================================================================
   //? Elements panel
   //? ======================================================================================================

   populateElements() {
      for (let a = 0; a < game.tiles.length; a++) {
         let element = document.createElement("DIV");
         element.classList.add("world-element-tile");
         element.style.backgroundImage = `url("./images/${game.tiles[a].texture}")`;
         element.title = game.tiles[a].name;
         document.querySelector(".world-element-tiles").insertBefore(element, document.querySelector(".world-element-tiles").childNodes[0]);
         element.addEventListener("click", () => {
            this.editView.selectedElement = a;
            for (let a = 0; a < document.querySelectorAll(".world-element-tile").length; a++) {
               document.querySelectorAll(".world-element-tile")[a].style.border = "";
            }
            element.style.border = "2px solid #006b8c";
         });
      }
   }

   //? ======================================================================================================
   //? Inspector panel
   //? ======================================================================================================

   inspectorEvents() {
      
   }

   compile() {

   }

   compileWorld() {

   }

   //? ======================================================================================================
   //? World drag events
   //? ======================================================================================================

   worldeditDrag() {
      let mouseStart = [0, 0];
      let holding = false;
      let pos = [0, 0];
      let currentPos = [0, 0];
      let moveEvery = 30;
      let movement = 0;

      document.querySelector(".world-edit").style.transform = `translate(20px, ${(-1600 + document.querySelector(".edit-view").offsetHeight - 20)}px)`;

      document.querySelector(".world-edit").addEventListener("mousedown", (event) => {
         if (this.editView.mode == "drag") {
            holding = true;
            mouseStart = [event.clientX, event.clientY];
            document.querySelector(".world-edit").style.cursor = "grabbing";

            pos = document.querySelector(".world-edit").style.transform.split(", ");
            pos[0] = parseInt(pos[0].split("(").pop());
            pos[1] = parseInt(pos[1]);
            document.querySelector(".world-edit").style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
         }
      });

      document.querySelector(".world-edit").addEventListener("mousemove", (event) => {
         if (holding && this.editView.mode == "drag" && movement == 0) {
            currentPos = [
               pos[0] + event.clientX - mouseStart[0],
               pos[1] + event.clientY - mouseStart[1]
            ];
            document.querySelector(".world-edit").style.transform = `translate(${currentPos[0]}px, ${currentPos[1]}px)`;
         }
         movement = movement < moveEvery ? movement + 1 : 0;
      });

      document.addEventListener("mouseup", () => {
         if (holding) {
            holding = false;
            document.querySelector(".world-edit").style.cursor = "grab";
            pos = [
               currentPos[0],
               currentPos[1]
            ];
         }
      });
   }

   worldeditPaintDrag() {
      let tileSize = 16;
      let holding = false;
      let pos = [];
      let prevPos = [];
      

      document.querySelector(".world-edit").addEventListener("mousedown", (event) => {
         if (this.editView.mode == "paint") {
            holding = true;

            let bcr = document.querySelector(".world-edit").getBoundingClientRect();

            pos = [
               Math.round((event.clientX - bcr.left - (tileSize / 2)) / tileSize),
               Math.round((event.clientY - bcr.top - (tileSize / 2)) / tileSize),
            ];

            if (this.game.objects[`${pos[0]}-${pos[1]}`] == undefined) {
               let newTile = document.createElement("DIV");
               newTile.classList.add(`world-tile-id-${pos[0]}-${pos[1]}`, `world-tile`);
               newTile.style.transform = `translate(${pos[0] * tileSize}px, ${pos[1] * tileSize}px)`;
               newTile.style.backgroundImage = `url("./images/${game.tiles[this.editView.selectedElement].texture}")`;
               document.querySelector(".world-edit").appendChild(newTile);
               this.game.objects[`${pos[0]}-${pos[1]}`] = this.editView.selectedElement;
            }
         }
      });

      document.querySelector(".world-edit").addEventListener("mousemove", (event) => {
         if (holding && this.editView.mode == "paint") {
            let bcr = document.querySelector(".world-edit").getBoundingClientRect();
            
            pos = [
               Math.round((event.clientX - bcr.left - (tileSize / 2)) / tileSize),
               Math.round((event.clientY - bcr.top - (tileSize / 2)) / tileSize),
            ];

            if ((pos[0] != prevPos[0] || pos[1] != prevPos[1]) && (this.game.objects[`${pos[0]}-${pos[1]}`] == undefined)) {
               let newTile = document.createElement("DIV");
               newTile.classList.add(`world-tile-id-${pos[0]}-${pos[1]}`, `world-tile`);
               newTile.style.transform = `translate(${pos[0] * tileSize}px, ${pos[1] * tileSize}px)`;
               newTile.style.backgroundImage = `url("./images/${game.tiles[this.editView.selectedElement].texture}")`;
               document.querySelector(".world-edit").appendChild(newTile);
               this.game.objects[`${pos[0]}-${pos[1]}`] = this.editView.selectedElement;
            }

            prevPos = [pos[0], pos[1]];
         }
      });

      document.addEventListener("mouseup", () => {
         if (holding) {
            holding = false;
         }
      });
   }

   worldeditEraseDrag() {
      let tileSize = 16;
      let holding = false;
      let marker;
      let pos = [];
      let unusedVar = 0;
      let prevPos = [];

      document.querySelector(".world-edit").addEventListener("mousedown", (event) => {
         if (this.editView.mode == "erase") {
            holding = true;
            marker = document.createElement("DIV");
            marker.classList.add("marker-square");
            marker.style.top = "0px";
            marker.style.left = "0px";
            marker.style.transform = `translate(0px, 0px)`;
            document.querySelector(".world-edit").appendChild(marker);

            let bcr = document.querySelector(".world-edit").getBoundingClientRect();

            pos = [
               Math.round((event.clientX - bcr.left - (tileSize / 2)) / tileSize),
               Math.round((event.clientY - bcr.top - (tileSize / 2)) / tileSize),
            ];

            if (this.game.objects[`${pos[0]}-${pos[1]}`] != undefined) {
               let toRemove = document.querySelector(`.world-tile-id-${pos[0]}-${pos[1]}`);
               toRemove.parentElement.removeChild(toRemove);
               delete this.game.objects[`${pos[0]}-${pos[1]}`];
            }
         }
      });

      document.querySelector(".world-edit").addEventListener("mousemove", (event) => {
         if (holding && this.editView.mode == "erase") {
            let bcr = document.querySelector(".world-edit").getBoundingClientRect();
            
            pos = [
               Math.round((event.clientX - bcr.left - (tileSize / 2)) / tileSize),
               Math.round((event.clientY - bcr.top - (tileSize / 2)) / tileSize),
            ];

            if ((pos[0] != prevPos[0] || pos[1] != prevPos[1]) && (this.game.objects[`${pos[0]}-${pos[1]}`] != undefined)) {
					let toRemove = document.querySelector(`.world-tile-id-${pos[0]}-${pos[1]}`);
					toRemove.parentElement.removeChild(toRemove);
					delete this.game.objects[`${pos[0]}-${pos[1]}`];
            }

            prevPos = [pos[0], pos[1]];

            marker.style.left = pos[0] * tileSize + "px";
            marker.style.top = pos[1] * tileSize + "px";
         }
      });

      document.addEventListener("mouseup", () => {
         if (holding) {
            holding = false;
            marker.parentElement.removeChild(marker);
         }
      });
   }

   //? ======================================================================================================
   //? World header
   //? ======================================================================================================

   headerBarsEvents() {
      document.querySelector(".edit-view-drag").addEventListener("click", () => {
         this.Actions.setEditViewDrag(this, document);
      });
      document.querySelector(".edit-view-place").addEventListener("click", () => {
         this.Actions.setEditViewPlace(this, document);
      });
      document.querySelector(".edit-view-erase").addEventListener("click", () => {
         this.Actions.setEditViewErase(this, document);
      });
      document.querySelector(".world-bg-color").addEventListener("change", () => {
         this.game.background = document.querySelector(".world-bg-color").value;
         document.querySelector(".world-edit").style.backgroundColor = this.game.background;
      });
      document.querySelector(".grid-toggle").addEventListener("change", () => {
         if (document.querySelector(".grid-toggle").checked) {
            document.querySelector(".world-edit").style.backgroundImage = 'url("./images/box-2-sides.png")';
         } else {
            document.querySelector(".world-edit").style.backgroundImage = "none";
         }
      });
   }

   //? ======================================================================================================
   //? Keybinds
   //? ======================================================================================================

   setupKeybinds() {
      document.addEventListener("keydown", (event) => {
         switch (event.key) {
            case config.keybinds[0].key:
               this.Actions.setEditViewDrag(this, document);
               break;
            case config.keybinds[1].key:
               this.Actions.setEditViewPlace(this, document)
               break;
            case config.keybinds[2].key:
               this.Actions.setEditViewErase(this, document);
               break;
            case config.keybinds[3].key:
               this.Actions.moveEditView(this, document, "u");
               break;
            case config.keybinds[4].key:
               this.Actions.moveEditView(this, document, "d");
               break;
            case config.keybinds[5].key:
               this.Actions.moveEditView(this, document, "l");
               break;
            case config.keybinds[6].key:
               this.Actions.moveEditView(this, document, "r");
               break;
            case config.keybinds[7].key:
               this.Actions.enableQuickViewMovement();
               break;
         }
      });

      document.addEventListener("keyup", (event) => {
         switch (event.key) {
            case config.keybinds[7].key:
               this.Actions.disableQuickViewMovement();
               break;
         }
      });
   }

   debug() {
      setInterval(() => {
         console.log(this.game.objects);
      }, 1000);
   }
}