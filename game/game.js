/**
 * @typedef {Object} game
 * @property {boolean} compiled - Indicates whether the savefile is a compiled game
 * @property {string} title - The title of the game
 * @property {Array<Object>} tiles - Objects defining basic world tiles including 'name', 'texture', and 'hitbox' fields
 * @property {Array<Object>} physObjs - Objects defining physics-enabled world objects including 'name', 'texture', and 'interactible' fields
 * @property {Array<Object>} dynamObjs - Objects defining dynamic world objects including 'name', 'texture', 'type', and 'enabled' fields
 * @property {Object} level - Represents the world objects by coordinate-pair keys and numerical values that indicate the position of the tile in the respective object type array
 * @property {Object} hitboxes - Represents the world's hitboxes by coordinate-pair keys. Only existing hitboxes appear in this datastructure
 * @property {Object} scripts - Contains scripts
 */
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
   level: {
      tiles: {},
      physObjs: {},
      dynamObjs: {}
   },
   hitboxes: {},
   scripts: {},
}

/**
 * Track Object
 * Invisible Trigger
 * Button
 */

/**
 * Level values: 
 * o: origin
 * d: dimensions
 * t: texture
 */