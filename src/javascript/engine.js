import {game} from "../../game/game.js";
import { Editor } from "./editor.js";
import { Splash } from "./splash.js";
import { Physics } from "./physics.js";

class GameEngine {
	constructor() {
		this.editor = null;
      this.splashspeed = 0;
      this.waitFor = 0;
		this.splashText = document.querySelector(".splash-output");
		this.splashqueue = [];
		this.splashint = null;
      this.pageIsLoaded = false;
      this.startedInt = false;

      this.Splash = new Splash();
	}

	/** Initializes the game engine */
	init() {
		// console.log("Initializing GameEngine component");
      this.Splash.add("Initializing GameEngine...");
      this.Splash.run();

      if (game.compiled) {
         this.createPhysicsEngine();
			this.loadGame();
		} else {
         this.createPhysicsEngine();
         this.loadEditor();
      }
      
      this.complete();
   }
   
   complete() {
      this.Splash.add("GameEngine Ready");
      this.Splash.add("Ready");
   }

	/** Loads the game and editor */
   loadEditor() {
      this.Splash.add("Preparing Editor...");
		this.editor = new Editor(this.Splash, this.Physics);
		this.editor.init();
   }
   
   createPhysicsEngine() {
      this.Splash.add("Preparing Physics...");
      this.Physics = new Physics(this.Splash);
      this.Physics.init();
   }

	/** Loads a compiled game */
	loadGame() {}
}

const Engine = new GameEngine();
Engine.init();