var _ = require('lodash');

export default class GameManager {

    constructor() {
        // Load any specific tasks for this tick
    }

    public static initializeMemory() {
        if (Memory.isInitialized) {
            return Memory.data;
        }
        Memory.isInitialized = true;
        return Memory.data = {
            totalCreepsAlive: 0,
        };
    }

    public static cleanup() {
        for (const creepName of Object.keys(Memory.creeps).filter(name => !Game.creeps[name])) {
            delete Memory.creeps[creepName];
        }
    }

    public static loop() {

        console.log(`======= ${Game.time} =======`);

        const memory = GameManager.initializeMemory();
        memory.totalCreepsAlive = 0;

        GameManager.cleanup();

        const rooms = _.values(Game.rooms);
        for (const room of rooms) {
            console.log(room.name);

            // memory.totalCreepsAlive += room.creeps.length;

            // room.processSpawns();
            // room.processCreeps();

        }
    }
}
