import { game } from "../../game/game.js";
import { config } from "./_config.js";
import { Actions } from "./actions.js";

export class Editor {
   constructor(splash, physics) {
      this.elements = {};
      this.gameView = {};
      this.editView = {
         mode: "drag",
         world: null,
         selectedElement: null,
      };
      this.inspector = {};

      this.game = {
         objects: {},
         boxes: [],
         world: null,
         background: "#09c4e8",
         tileSize: config.tileSize,
      }

      this.Physics = physics;
      this.Splash = splash;

      this.Splash.add("Initializing Actions Module...");
      this.Actions = new Actions();
      this.Splash.add("Actions Module Ready");
   }

   //? ======================================================================================================
   //? GENERAL
   //? ======================================================================================================

   init() {
      this.Splash.add("Initializing Editor...");
      this.createDropdowns();
      this.Splash.add("Editor component 1 complete");
      this.setupWorld();
      this.Splash.add("Editor component 2 complete");
      this.worldeditDrag();
      this.Splash.add("Editor component 3 complete");
      this.worldeditPaintDrag();
      this.Splash.add("Editor component 4 complete");
      this.worldeditEraseDrag();
      this.Splash.add("Editor component 5 complete");
      this.headerBarsEvents();
      this.Splash.add("Editor component 6 complete");
      this.inspectorEvents();
      this.Splash.add("Editor component 7 complete");
      this.populateElements();
      this.Splash.add("Editor component 8 complete");
      this.setupKeybinds();
      this.Splash.add("Editor component 9 complete");
      this.tryImportExistingGame();
      this.Splash.add("Editor component 10 complete");
      this.complete();
   }

   complete() {
      this.Splash.add("Editor Ready");
   }

   tryImportExistingGame() {
      if (game.hasLevel) {
         this.Splash.add("Found existing game. Importing...");
         this.game.objects = game.level;
         for (const el in this.game.objects) {
            let pos = el.toString().split("-");
            let newTile = document.createElement("DIV");
            newTile.classList.add(`world-tile-id-${el.toString()}`, `world-tile`);
            newTile.style.transform = `translate(${pos[0] * this.game.tileSize}px, ${pos[1] * this.game.tileSize}px)`;
            newTile.style.backgroundImage = `url("./images/${game.tiles[this.game.objects[el]].texture}")`;
            this.editView.world.appendChild(newTile);
         }
      }
   }

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

   setupWorld() {
      this.editView.world = document.querySelector(".world-edit");

      let worldHeight = this.game.tileSize * 100;
      let worldWidth = this.game.tileSize * 200;

      this.editView.world.style.height = worldHeight + "px";
      this.editView.world.style.width = worldWidth + "px";

      this.editView.world.style.transform = `translate(20px, ${(-worldHeight + document.querySelector(".edit-view").offsetHeight - 20)}px)`;
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
      document.querySelector(".compile-all").addEventListener("click", () => {
         this.compile();
      });
      document.querySelector(".compile-world").addEventListener("click", () => {
         this.compileWorld();
      });
      document.querySelector(".export-level").addEventListener("click", () => {
         console.log(this.game.objects);
      });
   }

   compile() {
      console.log("Beginning game compile");
      this.compileWorld();
      console.log("Game compile complete");
   }

   //? ======================================================================================================
   //? Compilation
   //? ======================================================================================================

   compileWorld() {
      let tiles = {};
      let boxes = [];
      Object.assign(tiles, this.game.objects);
      let startObjs = Object.keys(tiles).length;

      console.log("Beginning world compile");
      console.log(`Starting with ${startObjs} world objects`);

      while (Object.keys(tiles).length > 0) { // Iterate through groups
         let startAt = this.Actions.findTopLeftKey(tiles, true);
         let origin = startAt[0] + "-" + startAt[1];
         let x = Number.MAX_VALUE;
         let y = 0;
         let line = 1;
         let texture = tiles[origin];
         while (tiles[startAt[0] + "-" + (startAt[1] + y)] == tiles[origin]) { // while each tile below matches
            line = 0;
            while (tiles[(startAt[0] + line) + "-" + (startAt[1] + y)] == tiles[origin]) { // while each tile to the right matches
               line++;
               if (line >= x) { // ensure that narrower areas don't cause the rectangle to cover mismatching squares
                  break;
               }
            }
            x = line;
            // console.log(`X is ${x}`);
            y++;
         }
         if (x == Number.MAX_VALUE) {
            x = 1;
         }
         delete tiles[origin];
         for (let a = 0; a < x; a++) {
            for (let b = 0; b < y; b++) {
               let toDelete = (startAt[0] + a) + "-" + (startAt[1] + b);
               delete tiles[toDelete];
            }
         }
         let newBox = { origin: origin, dimensions: x + "|" + y, texture: texture };
         boxes.push(newBox);
      }

      let endObjs = Object.keys(boxes).length;
      console.log(`Result: ${endObjs} world objects (${((endObjs / startObjs) * 100).toFixed(1)}%)`);
      
      this.game.boxes = boxes;

      // let numTiles = document.querySelectorAll(".world-tile").length;
      // for (let a = 0; a < numTiles; a++) {
      //    let toRemove = document.querySelectorAll(".world-tile")[0];
      //    toRemove.parentElement.removeChild(toRemove);
      // }

      console.log("World compile complete");

      this.publishToGameView();

      /*
      start at top-leftmost gameobjects key
      loop:
      look for match to right until mismatch, record d1 (horizontal)
      move 1 line down, repeat
         - record shortest line
      on mismatch below origin, end and record d2 (vertical)
      from shortest line, draw box from origin to d1 to d2
         
      remove all included IDs from level and start over

      done on empty tiles object

      - should account for holes in terrain
      - should give good results on stairsteps
      - should reduce leftover single tiles
      - test performance by drawing object, and attempt to beat compiler with different grouping methods
      */
   }

   publishToGameView() {
      document.querySelector(".game-view").style.backgroundColor = this.game.background;
      if (this.game.world) {
         this.game.world.parentElement.removeChild(this.game.world);
      }
      let world = document.createElement("DIV");
      world.classList.add("game-world");
      world.style.height = this.game.tileSize * 100 + "px";
      world.style.width = this.game.tileSize * 200 + "px";
      document.querySelector(".game-view").appendChild(world);
      this.game.world = world;
      this.game.world.style.transform = `translate(20px, ${(-(this.game.tileSize * 100) + document.querySelector(".game-view").offsetHeight - 20)}px)`;
      for (let a = 0; a < this.game.boxes.length; a++) {
         let newElement = document.createElement("DIV");
         newElement.classList.add(`world-box-${this.game.boxes[a].origin}`, "world-box");
         let origin = this.game.boxes[a].origin.split("-");
         let dimensions = this.game.boxes[a].dimensions.split("|");
         newElement.style.width = (dimensions[0] * 16) + "px";
         newElement.style.height = (dimensions[1] * 16) + "px";
         newElement.style.transform = `translate(${(origin[0] * 16)}px, ${(origin[1] * 16)}px)`;
         if (config.debug) {
            newElement.style.backgroundColor = this.Actions.getRandomColor();
         } else {
            newElement.style.backgroundImage = `url("./images/${game.tiles[this.game.boxes[a].texture].texture}")`;
         }
         this.game.world.appendChild(newElement);
      }
      if (document.querySelector(".world-errors").children.length == 2) {
         document.querySelector(".world-errors").children[1].style.display = "none";
      }
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

      this.editView.world.addEventListener("mousedown", (event) => {
         if (this.editView.mode == "drag") {
            holding = true;
            mouseStart = [event.clientX, event.clientY];
            this.editView.world.style.cursor = "grabbing";

            pos = this.editView.world.style.transform.split(", ");
            pos[0] = parseInt(pos[0].split("(").pop());
            pos[1] = parseInt(pos[1]);
            this.editView.world.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
         }
      });

      this.editView.world.addEventListener("mousemove", (event) => {
         if (holding && this.editView.mode == "drag" && movement == 0) {
            currentPos = [
               pos[0] + event.clientX - mouseStart[0],
               pos[1] + event.clientY - mouseStart[1]
            ];
            this.editView.world.style.transform = `translate(${currentPos[0]}px, ${currentPos[1]}px)`;
         }
         movement = movement < moveEvery ? movement + 1 : 0;
      });

      document.addEventListener("mouseup", () => {
         if (holding) {
            holding = false;
            this.editView.world.style.cursor = "grab";
            pos = [
               currentPos[0],
               currentPos[1]
            ];
         }
      });
   }

   worldeditPaintDrag() {
      
      let holding = false;
      let pos = [];
      let prevPos = [];
      

      this.editView.world.addEventListener("mousedown", (event) => {
         if (this.editView.mode == "paint" && this.editView.selectedElement != null) {
            holding = true;

            let bcr = this.editView.world.getBoundingClientRect();

            pos = [
               Math.round((event.clientX - bcr.left - (this.game.tileSize / 2)) / this.game.tileSize),
               Math.round((event.clientY - bcr.top - (this.game.tileSize / 2)) / this.game.tileSize),
            ];

            if (this.game.objects[`${pos[0]}-${pos[1]}`] == undefined) {
               let newTile = document.createElement("DIV");
               newTile.classList.add(`world-tile-id-${pos[0]}-${pos[1]}`, `world-tile`);
               newTile.style.transform = `translate(${pos[0] * this.game.tileSize}px, ${pos[1] * this.game.tileSize}px)`;
               newTile.style.backgroundImage = `url("./images/${game.tiles[this.editView.selectedElement].texture}")`;
               this.editView.world.appendChild(newTile);
               this.game.objects[`${pos[0]}-${pos[1]}`] = this.editView.selectedElement;
            }
         }
      });

      this.editView.world.addEventListener("mousemove", (event) => {
         if (holding && this.editView.mode == "paint") {
            let bcr = this.editView.world.getBoundingClientRect();
            
            pos = [
               Math.round((event.clientX - bcr.left - (this.game.tileSize / 2)) / this.game.tileSize),
               Math.round((event.clientY - bcr.top - (this.game.tileSize / 2)) / this.game.tileSize),
            ];

            if ((pos[0] != prevPos[0] || pos[1] != prevPos[1]) && (this.game.objects[`${pos[0]}-${pos[1]}`] == undefined)) {
               let newTile = document.createElement("DIV");
               newTile.classList.add(`world-tile-id-${pos[0]}-${pos[1]}`, `world-tile`);
               newTile.style.transform = `translate(${pos[0] * this.game.tileSize}px, ${pos[1] * this.game.tileSize}px)`;
               newTile.style.backgroundImage = `url("./images/${game.tiles[this.editView.selectedElement].texture}")`;
               this.editView.world.appendChild(newTile);
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
      let holding = false;
      let marker;
      let pos = [];
      let prevPos = [];

      this.editView.world.addEventListener("mousedown", (event) => {
         if (this.editView.mode == "erase") {
            holding = true;
            marker = document.createElement("DIV");
            marker.classList.add("marker-square");
            marker.style.top = "0px";
            marker.style.left = "0px";
            marker.style.transform = `translate(0px, 0px)`;
            this.editView.world.appendChild(marker);

            let bcr = this.editView.world.getBoundingClientRect();

            pos = [
               Math.round((event.clientX - bcr.left - (this.game.tileSize / 2)) / this.game.tileSize),
               Math.round((event.clientY - bcr.top - (this.game.tileSize / 2)) / this.game.tileSize),
            ];

            if (this.game.objects[`${pos[0]}-${pos[1]}`] != undefined) {
               let toRemove = document.querySelector(`.world-tile-id-${pos[0]}-${pos[1]}`);
               toRemove.parentElement.removeChild(toRemove);
               delete this.game.objects[`${pos[0]}-${pos[1]}`];
            }
         }
      });

      this.editView.world.addEventListener("mousemove", (event) => {
         if (holding && this.editView.mode == "erase") {
            let bcr = this.editView.world.getBoundingClientRect();
            
            pos = [
               Math.round((event.clientX - bcr.left - (this.game.tileSize / 2)) / this.game.tileSize),
               Math.round((event.clientY - bcr.top - (this.game.tileSize / 2)) / this.game.tileSize),
            ];

            if ((pos[0] != prevPos[0] || pos[1] != prevPos[1]) && (this.game.objects[`${pos[0]}-${pos[1]}`] != undefined)) {
					let toRemove = document.querySelector(`.world-tile-id-${pos[0]}-${pos[1]}`);
					toRemove.parentElement.removeChild(toRemove);
					delete this.game.objects[`${pos[0]}-${pos[1]}`];
            }

            prevPos = [pos[0], pos[1]];

            marker.style.left = pos[0] * this.game.tileSize + "px";
            marker.style.top = pos[1] * this.game.tileSize + "px";
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
         this.editView.world.style.backgroundColor = this.game.background;
      });
      document.querySelector(".grid-toggle").addEventListener("change", () => {
         if (document.querySelector(".grid-toggle").checked) {
            this.editView.world.style.backgroundImage = 'url("./images/box-2-sides.png")';
         } else {
            this.editView.world.style.backgroundImage = "none";
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
            case config.keybinds[0].alternate:
               this.Actions.setEditViewDrag(this, document);
               break;
            case config.keybinds[1].key:
            case config.keybinds[1].alternate:
               this.Actions.setEditViewPlace(this, document)
               break;
            case config.keybinds[2].key:
            case config.keybinds[2].alternate:
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
            case config.keybinds[config.keybinds.length - 1].key:
               this.Actions.DEBUG([this.game.objects]);
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
}