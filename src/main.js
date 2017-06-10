var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWarrior = require('role.warrior');
var roomManager = require('room');
var tower = require('tower');
var utilities = require('utilities');

var levelThreeReached = false;
module.exports.loop = function () {
    var availableEnergy = 0;
    var spawn = Game.spawns['HQ'];
    var mainRoom = 'E98S56';
    for (var name in Game.rooms) {
        availableEnergy =+ Game.rooms[name].energyAvailable;
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');

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

    //roomManager.buildAllRoads(spawn);
    roomManager.checkPopulation(spawn, availableEnergy);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        // } else if (creep.memory.role == 'miner') {
        //     roleMiner.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'warrior') {
            roleWarrior.run(creep);
        } else {
            throw new Error('Unsupported role: ' + creep.memory.role);
        }
    }

    utilities.garbageCollection();
}
