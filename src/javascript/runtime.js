import { config } from "./_config.js";

export class Runtime {
   constructor(physics, splash) {
      this.game = null;
      this.state = "stop"; // "play", "pause", "stop"
      this.cleanupComplete = false;
      
      this.Physics = physics;
      this.Splash = splash;

      this.step = null;

      this.physObjs = {};
   }

   init() {
      this.Splash.add("Runtime ready");
   }

   //? ======================================================================================================
	//? Public methods
	//? ======================================================================================================
   
   Run(game) {
      this.cleanupComplete = false;
      if (this.state == "pause") {
         this.state = "play";
         this.step = this._step.bind(this);
         window.requestAnimationFrame(() => {
            this.step();
         });
      } else if (this.state == "stop") {
         this.game = game;
         this.state = "play";
         this.physObjs = this.Physics.prepareObjects();
         this.step = this._step.bind(this);
         window.requestAnimationFrame(() => {
            this.step();
         });
      }
   }

   Stop() {
      this.state = "stop";
      this.game = null;
      setTimeout(() => {
         if (!this.cleanupComplete) {
            this._cleanup();
         }
      }, 0);
   }

   Pause() {
      this.state = "pause";
   }

   //? ======================================================================================================
	//? Runtime
	//? ======================================================================================================

   _cleanup() {
      this.cleanupComplete = true;
      for (const obj in this.physObjs) {
         this.physObjs[obj].worldElement.parentElement.removeChild(this.physObjs[obj].worldElement);
      }
   }
   
   _step() {

      this._physicsStep();

      if (this.state == "play") {
         window.requestAnimationFrame(this.step);
      } else if (this.state == "stop") {
         this._cleanup();
      }
   }

   _physicsStep() {
      for (const obj in this.physObjs) {
         this.physObjs[obj].velocity.y += this.physObjs[obj].gravity;

         let collisions = this.Physics.CheckCollisions(this.physObjs[obj]);
         // console.log(collisions);

         if (Math.sign(collisions.y) == -1 && this.physObjs.velocity.y < 0 && collisions.y != null) {
            this.physObjs[obj].position.y += collisions.y;
            this.physObjs[obj].velocity.y = 0;
         } else {
            this.physObjs[obj].position.x += this.physObjs[obj].velocity.x;
            this.physObjs[obj].position.y += this.physObjs[obj].velocity.y;
         }

         console.log(this.physObjs[obj].velocity.y + " | "+this.physObjs[obj].position.y);

         this.physObjs[obj].worldElement.style.transform = `translate(${this.physObjs[obj].position.x * config.tileSize}px, ${(config.worldHeight - this.physObjs[obj].position.y) * config.tileSize}px)`;
      }
   }
}