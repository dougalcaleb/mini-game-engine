import { game } from "../../game/game.js";
import { Editor } from "./editor.js";
import { Splash } from "./splash.js";
import { Physics } from "./physics.js";
import { Actions } from "./actions.js";
import { config } from "./_config.js";
import { Runtime } from "./runtime.js";

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

      this.gameFileRef = null;

      this.Splash = new Splash();
      this.Actions = new Actions();
	}

	/** Initializes the game engine */
	async init() {
      this.Splash.add("Initializing GameEngine...");

      let gameFile = await this.savefile();
      if (gameFile == "ABORTED") {
         this.init();
      } else {
         if (gameFile == undefined) {
            gameFile = {};
            Object.assign(gameFile, game);
         }
         this.Splash.add("Verifying savefile...");
         if (!this.verifySavefile(gameFile)) return;
		   this.Splash.add("Savefile verified");
         document.title = `${gameFile.title} | MGE`;
         if (gameFile.compiled) {
            this.createPhysicsEngine(gameFile);
            this.createRuntime();
            this.loadGame();
         } else {
            this.createPhysicsEngine(gameFile);
            this.createRuntime();
            this.loadEditor(gameFile);
         }
         
         this.complete();
      }
   }

   verifySavefile(file) {
      // Ensure that all necessary data exists in the savefile
		if (
			typeof file.compiled == "boolean" &&
			typeof file.title == "string" &&
			typeof file.tiles == "object" &&
			typeof file.level == "object" &&
			typeof file.hitboxes == "object" &&
         typeof file.scripts == "object" &&
         typeof file.physObjs == "object" &&
         typeof file.dynamObjs == "object"
		) {
         return true;
		} else {
			this.Actions.actionPopup("SAVEFILE ERROR", "critical", `The savefile is outdated, corrupt, or an incorrect filetype.`, [
				{
					text: "OK",
					style: "primary",
					action: () => {
						this.Actions.destroyPopup();
					},
				},
         ]);
         return false;
		}
	}

   async savefile() {
      return new Promise((resolve, reject) => {
         this.promptForSaveFile().then(
            (gameFile) => {
               // SAVEFILE GIVEN
               if (gameFile == "ABORTED") {
                  resolve("ABORTED");
               } else {                  
                  resolve(gameFile);
                  this.Splash.add("Loading savefile...");
                  this.Splash.run();
               }
            }, (msg) => {
               // NEW PROJECT
               if (msg == "SAVE_CANCELED") {
                  resolve("ABORTED");
               } else {
                  resolve();
                  this.Splash.add("Starting new project");
                  this.Splash.run();
               }
         });
      });
   }
   
   complete() {
      this.Splash.add("GameEngine Ready");
      this.Splash.add("Ready");
   }

	/** Loads the game and editor */
   loadEditor(gameFile) {
      this.Splash.add("Preparing Editor...");
		this.editor = new Editor(this.Splash, this.Physics, this.Runtime, {gameFileRef: this.gameFileRef, gameFile: gameFile});
		this.editor.init();
   }
   
   createPhysicsEngine(gameFile) {
      this.Splash.add("Preparing Physics...");
      this.Physics = new Physics(this.Splash, gameFile);
      this.Physics.init();
   }

   createRuntime() {
      this.Splash.add("Preparing Physics...");
      this.Runtime = new Runtime(this.Physics, this.Splash);
      this.Runtime.init();
   }

	/** Loads a compiled game */
   loadGame(game) { }
   
   //? ======================================================================================================
   //? Load/Save
   //? ======================================================================================================

   async promptForSaveFile() {
      return new Promise((resolve, reject) => {
         let ABORT = new AbortController();
         // Load savefile
         document.querySelector(".prompt-load-savefile").addEventListener("click", async () => {
            let retrievedFile = await this.loadSavefile();
            ABORT.abort();
            resolve(retrievedFile);
         }, {signal: ABORT.signal});
         // New project
         document.querySelector(".prompt-new-project").addEventListener("click", async () => {
            let msg = await this.saveNewProject();
            ABORT.abort();
            reject(msg);
         }, {signal: ABORT.signal});
      });
   }

   async saveNewProject() {
      try {
         this.gameFileRef = await window.showSaveFilePicker({
            suggestedName: `${game.title}.${config.fileExtension}`,
            types: [{accept: {"text/plain": [`.${config.fileExtension}`]}, description: "Game Engine Savefile"}]
         });
         // const file = await this.gameFileRef.getFile();
         await this.saveToLoadedSavefile(this.gameFileRef, game);
      } catch (e) {
         console.warn(e);
         return "SAVE_CANCELED";
      }
   }

   async loadSavefile() {
      try {
         let abort = false;
         this.gameFileRef = await window.showOpenFilePicker();
         this.gameFileRef = this.gameFileRef[0];
         if (this.gameFileRef.name.split(".").pop() != config.fileExtension) {
            await this.Actions.actionPopup("INCORRECT FILE TYPE", "warn", `This file is not a .${config.fileExtension} savefile. Are you sure you want to use this file?`, [
               {
                  text: "Continue",
                  style: "primary",
                  action: () => {
                     this.Actions.destroyPopup();
                  }
               },
               {
                  text: "Cancel",
                  style: "critical",
                  action: () => {
                     abort = true;
                     this.Actions.destroyPopup();
                  }
               }
            ]);
         }
         let file = await this.gameFileRef.getFile();
         let gameFileStringified = await file.text();
         if (abort) {
            return "ABORTED";
         }
         return JSON.parse(gameFileStringified);
      } catch (e) {
         console.warn(e);
         return "ABORTED";
      }
   }

   async saveToLoadedSavefile(ref, contents = this.gameFile) {
      if (typeof ref !== null) {
         if ((await this.gameFileRef.queryPermission()) === "granted") {
            const writable = await this.gameFileRef.createWritable();
            await writable.write(JSON.stringify(contents));
            await writable.close();
         }
      }
   }
}

const Engine = new GameEngine();
Engine.init();