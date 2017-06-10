var roleHarvester = {
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

        if(bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'harvester', harvesting: false });
            console.log('Spawning new creep: ' + newName + ' ('+Game.creeps[newName].memory.role +')');
        }
    },
    run: function (creep) {
        if (!creep.memory.harvesting && (creep.carry.energy == 0 || creep.carry.energy < creep.carry.carryCapacity)) {
            creep.memory.harvesting = true;
            creep.say('🎁');
        }

        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('Storing');
        }

        if (creep.memory.harvesting) {
            var droppedSources = creep.room.find(FIND_DROPPED_RESOURCES);
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(droppedSources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedSources[0]);
            } else if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.say('🔨');
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { reusePath: 50 });
                }
            }
        }
    }
};

module.exports = roleHarvester;
