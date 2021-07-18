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

   prepareObjects() {
      for (let a = 0; a < this.gameFile.physObjs.length; a++) {
         console.log(this.gameFile.physObjs[a].name);
      }
   }
   
   complete() {
      this.Splash.add("Physics Ready");
   }
}