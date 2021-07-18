import { level } from "./_level.js";
export const game = {
   compiled: false,
   title: "My First Game",
   tiles: [
      {
         name: "Grass",
         texture: "grass.png",
         hitbox: true,
      },
      {
         name: "Stone",
         texture: "stone.png",
         hitbox: true,
      },
      {
         name: "Water",
         texture: "water.gif",
         hitbox: false,
      },
      {
         name: "Water Full",
         texture: "water-full.png",
         hitbox: false,
      },
   ],
   physObjs: [
      {
         name: "Block",
         texture: "phys-block.png",
         interactible: false,
      },
   ],
   dynamObjs: [
      {
         name: "Visible Trigger",
         texture: "visible-trigger.png",
         type: "trigger",
         enabled: true,
      },
   ],
   
      /**
       * Track Object
       * Invisible Trigger
       * Button
       */
   level: {},
   hitboxes: {},
   scripts: {},
}

/**
 * Level values: 
 * o: origin
 * d: dimensions
 * t: texture
 */