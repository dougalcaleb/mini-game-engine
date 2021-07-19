import { config } from "./_config.js";
import { Actions } from "./actions.js";

export class Physics {
   constructor(splash, gameFile) {
      this.Splash = splash;
      this.gameFile = gameFile;
      this.objects = {};
      this.gameWorld = null;

      this.Actions = new Actions();
   }

   init() {
      this.Splash.add("Initializing Physics...");
      // this._prepareObjects();
      // this.Splash.add("Physics component 1 complete");
      this._complete();
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

   /**
    * Check the collisions of a nearby object
    * @param {Object} object - The object to check collisions for
    * @returns {Object} - Resolutions for collisions that will happen in the next step
    */
   CheckCollisions(object) {
      // let collisions = {};
      let resolutions = {x: null, y: null};
      let vx = Math.sign(object.velocity.x);
      let vy = Math.sign(object.velocity.y);
      let cols = {};
      let rows = {};

      cols[Math.floor(object.position.x)] = true;
      cols[Math.ceil(object.position.x)] = true;

      rows[Math.floor(object.position.y)] = true;
      rows[Math.ceil(object.position.y)] = true;

      /**
       * Get position
       * Check next block in direction
       * if hitbox, calc and return difference resolution
       * if nothing, return nothing
       */


      if (vy == -1) { // down
         for (const col in cols) {
            let check = col + "-" + Math.ceil(object.position.y);
            if (this.gameFile.hitboxes[check]) {
               let res = object.position.y - parseInt(check.split("-")[1]);
               resolutions.y = res;
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

   prepareObjects() {
      // console.log("PrepareObjs");
      if (this.gameFile.compiled) {

      } else {
         // console.log("Not compiled;")
         this.gameWorld = document.querySelector(".game-world");
      }
      for (const el in this.gameFile.level.physObjs) {
         // console.log("Creating new world physics object");
         let obj = document.createElement("DIV");
			obj.classList.add(`world-box-${el.toString()}`, "world-box");
			let origin = el.toString().split("-");
			obj.style.width = config.tileSize + "px";
			obj.style.height = config.tileSize + "px";
			// obj.style.transform = `translate(${origin[0] * config.tileSize}px, ${origin[1] * config.tileSize}px)`;
         this.Actions.tilePosition(obj, origin);
			obj.style.backgroundImage = `url("./images/${this.gameFile.physObjs[this.gameFile.level.physObjs[el]].texture}")`;
         this.gameWorld.appendChild(obj);
         // console.log("Appended");
         this.objects[el] = {
            velocity: { x: 0, y: 0 },
            position: { x: parseInt(el.split("-")[0]), y: parseInt(el.split("-")[1]) },
            gravity: -0.001,
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