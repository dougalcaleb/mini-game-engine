import { config } from "./_config.js";
import { Actions } from "./actions.js";

export class Physics {
   constructor(splash, gameFile) {
      this.Splash = splash;
      this.gameFile = gameFile;
      this.objects = {};
      this.gameWorld = null;

      this.runningGame = {};

      this.Actions = new Actions();
   }

   init() {
      this.Splash.add("Initializing Physics...");
      this._complete();
   }

   //? ======================================================================================================
	//? Runtime
	//? ======================================================================================================

   GameStart(game) {
      this.runningGame = {};
      this.runningGame = JSON.parse(JSON.stringify(game));
   }

   GameStop() {
      this.runningGame = {};
   }

   //? ======================================================================================================
	//? Accessible Methods
	//? ======================================================================================================

   /**
    * Add a single impulse force to an object
    * @param {Object} object - The object to add a force to
    * @param {Array} force - The X and Y vectors representing the force
    */
   AddForce(object, force) {

   }

   AddHitboxes(newHitboxes) {
      for (let a = 0; a < newHitboxes.length; a++) {
         this.runningGame.hitboxes[newHitboxes[a]] = 1;
      }
   }

   /**
    * Check the collisions of a nearby object
    * @param {Object} object - The object to check collisions for
    * @returns {Object} - Resolutions for collisions that will happen in the next step
    */
   CheckCollisions(object) {
      let resolutions = {x: null, y: null};
      let vx = Math.sign(object.velocity.x);
      let vy = Math.sign(object.velocity.y);
      let cols = {};
      let rows = {};

      cols[Math.floor(object.position.x)] = true;
      cols[Math.ceil(object.position.x)] = true;

      rows[Math.floor(object.position.y)] = true;
      rows[Math.ceil(object.position.y)] = true;

      if (vy == -1) { // down
         for (const col in cols) {
            let check = col + "-" + (Math.floor(object.position.y) - 1);
            if (this.runningGame.hitboxes[check]) {
               let res = object.position.y - parseInt(check.split("-")[1]) - 1;
               if (res <= Math.abs(object.velocity.y) || res <= 0.001) {
                  resolutions.y = res;
               }
            }
         }
      }

      return resolutions;
   }

   /**
    * Once per tick per object:
    * - Add gravity and other forces
    * - Get/determine direction of motion
    * - Check for potential collisions in direction of motion, calculate next movement
    * - If at 0 velocity, stop ticking and convert to event listener (waiting for force applied)
    *    - Event listeners object: stored with tile coord keys
    * - Check for and trigger event listeners in next-to-be-occupied tiles
    */

   PrepareObjects() {
      if (this.gameFile.compiled) {

      } else {
         this.gameWorld = document.querySelector(".game-world");
      }
      for (const el in this.gameFile.level.physObjs) {
         let obj = document.createElement("DIV");
			obj.classList.add(`world-box-${el.toString()}`, "world-box");
			let origin = el.toString().split("-");
			obj.style.width = config.tileSize + "px";
			obj.style.height = config.tileSize + "px";
         origin[1] = parseInt(origin[1]) + 1;
         this.Actions.tilePosition(obj, origin);
			obj.style.backgroundImage = `url("./images/${this.gameFile.physObjs[this.gameFile.level.physObjs[el]].texture}")`;
         this.gameWorld.appendChild(obj);
         this.objects[el] = {
            velocity: { x: 0, y: 0 },
            position: { x: parseInt(el.split("-")[0]), y: parseInt(el.split("-")[1]) },
            gravity: -0.01,
            linearDrag: -0.25,
            worldElement: obj,
         }
      }

      return this.objects;
   }
   
   _complete() {
      this.Splash.add("Physics Ready");
   }
}