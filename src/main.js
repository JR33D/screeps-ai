var roleHarvester = require('role.harvester');
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
    var mainRoom = 'E44N91';
    for (var name in Game.rooms) {
        availableEnergy = + Game.rooms[name].energyAvailable;
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
    if (!levelThreeReached && Game.rooms[mainRoom].controller.level == 3) {
        // Create Tower
        Game.rooms[mainRoom].createConstructionSite(25, 26, STRUCTURE_TOWER);
        // Create expansions
        Game.rooms[mainRoom].createConstructionSite(19, 25, STRUCTURE_EXTENSION);
        Game.rooms[mainRoom].createConstructionSite(20, 25, STRUCTURE_EXTENSION);
        Game.rooms[mainRoom].createConstructionSite(21, 25, STRUCTURE_EXTENSION);
        Game.rooms[mainRoom].createConstructionSite(22, 25, STRUCTURE_EXTENSION);
        Game.rooms[mainRoom].createConstructionSite(23, 25, STRUCTURE_EXTENSION);

        levelThreeReached = true;
    }

    //console.log('Total energy available: '+availableEnergy);

    roomManager.checkPopulation(spawn, availableEnergy);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'warrior') {
            roleWarrior.run(creep);
        }
    }

    utilities.garbageCollection();
}
