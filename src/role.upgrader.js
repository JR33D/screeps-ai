var roleUpgrader = {
    parts: {
        basic: [WORK, CARRY, MOVE], // 200
        interm: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] // 400
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if (availableEnergy >= 400) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 200) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'upgrader', upgrading: false });
            console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
        }
    },
    run: function (creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🎁');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('🔨');
        }
        if (!creep.memory.upgrading) {
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy > 0;
                }
            });
            if (sources.length > 0) {
                if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                var droppedSources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                var sources = creep.room.find(FIND_SOURCES);
                if (droppedSources && creep.pickup(droppedSources) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedSources);
                } else if (sources.length > 0 && creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;
