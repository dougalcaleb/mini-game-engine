export class Physics {
   constructor(splash, gameFile) {
      this.Splash = splash;
      this.gameFile = gameFile;
   }

   init() {
      this.Splash.add("Initializing Physics...");
      this.prepareObjects();
      this.Splash.add("Physics component 1 complete");
      this.complete();
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
      for (let a = 0; a < this.gameFile.physObjs.length; a++) {
         console.log(this.gameFile.physObjs[a].name);
      }
   }
   
   complete() {
      this.Splash.add("Physics Ready");
   }
}