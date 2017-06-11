var config = require('config');

var roleMiner = {
    parts: {
        basic: [CARRY, MOVE, CARRY, MOVE], // 200
        interm: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE] // 400
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if (availableEnergy >= 400) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 200) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'carrier' });
            console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
        }
    },
    run: function (creep) {
        var extractContainer;
        if (!creep.memory.container) {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
            _.forEach(containers, function (container) {
                var creepsCollecting = _.filter(Game.creeps, (creep) => creep.memory.container == container.id && creep.memory.role == 'carrier');

                if (creepsCollecting.length < config.Carriers_Per_Storage) {
                    creep.memory.container = container.id;
                    extractContainer = Game.getObjectById(container.id);
                }
            });
        } else {
            extractContainer = Game.getObjectById(creep.memory.container);
        }

        var storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (!creep.memory.full && creep.carry.energy == creep.carryCapacity) {
            creep.memory.full = true;
        } else if (creep.memory.full && creep.carry.energy == 0) {
            creep.memory.full = false;
        }

        if (extractContainer && !creep.memory.full) {
            if (creep.withdraw(extractContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(extractContainer);
            }
        } else if (storage.length > 0 && creep.memory.full) {
            if (creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage[0]);
            }
        }
    }
};

module.exports = roleMiner;
