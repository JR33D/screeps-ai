var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWarrior = require('role.warrior');
var roleCarrier = require('role.carrier');
var roomManager = require('room');
var tower = require('tower');
var utilities = require('utilities');
var config = require('config');

module.exports.loop = function () {
    var availableEnergy = 0;
    var spawn = Game.spawns['HQ'];
    var mainRoom = 'E98S56';
    for (var name in Game.rooms) {
        availableEnergy = + Game.rooms[name].energyAvailable;
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + '/' + Game.rooms[name].energyCapacityAvailable + ' energy');

        var towers = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER
            }
        });
        for (var tower in towers) {
            tower(tower);
        }
    }

    //console.log('Total energy available: '+availableEnergy);

    roomManager.buildAllRoads(spawn);
    roomManager.checkPopulation(spawn, availableEnergy);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.ticksToLive >= (config.Creep_Health_Percentage * config.Creep_Max_TicksToLive)) {
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            } else if (creep.memory.role == 'miner') {
                roleMiner.run(creep);
            } else if (creep.memory.role == 'carrier') {
                roleCarrier.run(creep);
            } else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            } else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            } else if (creep.memory.role == 'warrior') {
                roleWarrior.run(creep);
            } else {
                throw new Error('Unsupported role: ' + creep.memory.role);
            }
        } else {
            var recycleFlag = Game.flags['recycle'];
            if (creep.carry.energy > 0) {
                creep.drop(RESOURCE_ENERGY);
            }
            if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
                creep.say('♻️');
                creep.moveTo(recycleFlag);
            }
        }
    }

    utilities.garbageCollection();
}
