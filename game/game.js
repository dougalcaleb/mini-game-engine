import { level } from "./_level.js";
export const game = {
   compiled: false,
   imprtedFromSaveFile: false,
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
         hitbox: true,
      },
   ],
   level: {},
   scripts: {},
}