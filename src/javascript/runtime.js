import { config } from "./_config.js";

export class Runtime {
   constructor(physics, splash) {
      this.game = null;
      this.state = "stop"; // "play", "pause", "stop"
      this.cleanupComplete = false;
      
      this.Physics = physics;
      this.Splash = splash;

      this.step = null;

      this.currentFrame = null;

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
         this.Physics.GameStart(game);
         this.physObjs = this.Physics.PrepareObjects();
         this.step = this._step.bind(this);
         window.requestAnimationFrame(() => {
            this.step();
         });
      }
   }

   Stop() {
      this.state = "stop";
      this.game = {};
      window.cancelAnimationFrame(this.currentFrame);
      this.Physics.GameStop();
      this._cleanup();
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
         delete this.physObjs[obj];
      }
   }
   
   _step() {
      if (this.state == "play") {
         this._physicsStep();
         this.currentFrame = window.requestAnimationFrame(this.step);
      } else if (this.state == "stop") {
         this._cleanup();
      }
   }

   // probably needs cleanup

   _physicsStep() {
      for (const obj in this.physObjs) {
         this.physObjs[obj].velocity.y += this.physObjs[obj].gravity;

         let collisions = this.Physics.CheckCollisions(this.physObjs[obj]);

         if (collisions && collisions.y != null) {
            this.physObjs[obj].position.y -= collisions.y;
            this.physObjs[obj].velocity.y = 0;
            let pos = this.physObjs[obj].position.x + "-" + this.physObjs[obj].position.y;
            this.Physics.AddHitboxes([pos]);
         } else {
            this.physObjs[obj].position.x += this.physObjs[obj].velocity.x;
            this.physObjs[obj].position.y += this.physObjs[obj].velocity.y;
         }

         this.physObjs[obj].worldElement.style.transform =
            `translate(${(this.physObjs[obj].position.x * config.tileSize)}px, ${((config.worldHeight - this.physObjs[obj].position.y - 1) * config.tileSize)}px)`;
      }
   }
}