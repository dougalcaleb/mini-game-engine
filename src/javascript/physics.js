export class Physics {
   constructor(splash) {
      this.Splash = splash;
   }

   init() {
      this.Splash.add("Initializing Physics...");
      this.complete();
   }
   
   complete() {
      this.Splash.add("Physics Ready");
   }
}