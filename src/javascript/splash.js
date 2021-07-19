export class Splash {
   constructor() {
      this.speed = 20;
      this.waitAfter = 100;
      this.waitBefore = 500;
      this.queue = [];
      this.readies = ["Editor", "GameEngine", "Physics", "Runtime", "Ready"]
      this.int = null;
      this.pageIsLoaded = false;

      window.onload = () => {
			this.pageIsLoaded = true;
		};
   }
   
   add(text) {
      this.queue.push(text);
   }

   run() {
      document.querySelector(".savefile-prompt").style.animation = "0.3s savefilePromptOut forwards";
      setTimeout(() => {
         this.int = setInterval(() => {
            if (this.queue.length > 0) {
               let newMsg = document.createElement("P");
               newMsg.innerText = this.queue[0];
               document.querySelector(".splash-output").insertBefore(newMsg, document.querySelector(".splash-output").children[0]);
               if (document.querySelector(".splash-output").children.length > 5) {
                  let toRemove = document.querySelector(".splash-output").children[5];
                  toRemove.parentElement.removeChild(toRemove);
               }
      
               if (this.readies.includes(this.queue[0].split(" ")[0])) {
                  this.readies.splice(this.readies.indexOf(this.queue[0].split(" ")[0]), 1);
               }
               this.queue.shift();
      
               if (this.readies.length == 0 && this.pageIsLoaded) {
                  clearInterval(this.int);
                  setTimeout(() => {
                     document.querySelector(".splash").style.animation = "0.15s hideSplash linear forwards";
                  }, this.waitAfter);
               }
            }
         }, this.speed);
      }, this.waitBefore);
   }
}