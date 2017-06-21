var config = require('config');

var roleBuilder = {
    parts: {
        basic: [WORK, CARRY, MOVE], // 200
        interm: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 400
        expert: [WORK, WORK, CARRY, MOVE, WORK, WORK, CARRY, MOVE] // 600
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        // if (availableEnergy >= 600) {
        //     bodyParts = this.parts['expert'];
        // } else
        if (availableEnergy >= 400) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 200) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'builder', building: false });
            console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
        }
    },
    getBuildTargets: function (creep) {
        var defenses = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER ||
                    structure.structureType == STRUCTURE_RAMPART;
            }
        });
        var storages = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE;
            }
        });
        var roadAndWall = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_WALL ||
                    structure.structureType == STRUCTURE_ROAD;
            }
        });

        return _.union(defenses, storages, roadAndWall);
    },
    getRepairTargets: function (creep) {
        var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.hits < structure.hitsMax;
            }
        });
        var storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureTargets == STRUCTURE_SPAWN ||
                    structure.structureTargets == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.hits < structure.hitsMax;
            }
        });
        var road = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax &&
                s.structureType == STRUCTURE_ROAD
        });
        // .room.find(FIND_STRUCTURES, {
        //     filter: (s) => s.hits < s.hitsMax &&
        //         (s.structureType == STRUCTURE_ROAD ||
        //         s.structureType == STRUCTURE_WALL)
        // });
        return _.union(towers, storages, [road]);
    },
    run: function (creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var buildTargets = this.getBuildTargets(creep);
            var repairTargets = this.getRepairTargets(creep);
            if (repairTargets.length > 0) {
                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0]);
                }
            } else if (buildTargets.length > 0) {
                creep.say('🚧');
                if (creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0]);
                }
            } else {
                creep.say('🔨');
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        } else {
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE &&
                        creep.room.storage.store[RESOURCE_ENERGY] > 1000);
                }
            });
            creep.say('🎁');
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
        }
    }
};

module.exports = roleBuilder;
