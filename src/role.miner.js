var roleMiner = {
    parts: {
        basic: [MOVE, WORK, WORK], // 250
        interm: [MOVE, WORK, WORK, WORK, WORK, MOVE], // 500
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if (availableEnergy >= 400) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 250) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var mineFlags = _.filter(Game.flags, (flag) => flag.name.startsWith('Mine'));
            _.forEach(mineFlags, (flag) => {
                var creepBuilt;
                var source = flag.pos.findClosestByRange(FIND_SOURCES);
                var lookCreep = flag.room.lookForAt(LOOK_CREEPS, flag);
                var lookContainer = flag.room.lookForAt(LOOK_STRUCTURES, flag);
                var lookConstruction = flag.room.lookForAt(LOOK_CONSTRUCTION_SITES, flag);
                if (lookContainer.length == 0 && lookConstruction.length == 0) {
                    flag.room.createConstructionSite(flag.pos.x, flag.pos.y, STRUCTURE_CONTAINER);
                }
                if (source && lookCreep.length == 0 && (lookContainer.length > 0 && lookContainer[0].structureType == STRUCTURE_CONTAINER)) {
                    var newName = spawn.createCreep(bodyParts, undefined, { role: 'miner', source: source.id, container: lookContainer[0].id });
                    console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
                }
            });
        }
    },
    run: function (creep) {
        var source = Game.getObjectById(creep.memory.source);
        var container = Game.getObjectById(creep.memory.container);
        if (container.store[RESOURCE_ENERGY] < container.storeCapacity) {
            if (creep.pos.x != container.pos.x || creep.pos.y != container.pos.y) {
                creep.moveTo(container.pos.x, container.pos.y);
            } else {
                creep.harvest(source);
            }
        }
    }
};

module.exports = roleMiner;
