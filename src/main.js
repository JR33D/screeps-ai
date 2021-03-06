var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWarrior = require('role.warrior');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roomManager = require('room');
var roleTower = require('tower');
var utilities = require('utilities');
var config = require('config');

module.exports.loop = function () {
    var availableEnergy = 0;
    var spawn = Game.spawns['HQ'];
    var mainRoom = 'E98S56';
    for (var name in Game.rooms) {
        availableEnergy = + Game.rooms[name].energyAvailable;
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + '/' + Game.rooms[name].energyCapacityAvailable + ' energy');

        var towers = Game.rooms[name].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        towers.forEach(tower => roleTower.run(tower));
    }


    //roomManager.buildAllRoads(spawn);
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
            } else if (creep.memory.role == 'claimer') {
                roleClaimer.run(creep);
            } else {
                throw new Error('Unsupported role: ' + creep.memory.role);
            }
        } else {
            var recycleFlag = Game.flags['recycle'];
            if (creep.carry.energy > 0) {
                creep.drop(RESOURCE_ENERGY);
            }
            if (creep.pos.x != recycleFlag.pos.x || creep.pos.y != recycleFlag.pos.y) {
                creep.moveTo(recycleFlag.pos.x, recycleFlag.pos.y);
            } else {
                creep.say('♻️');
                spawn.recycleCreep(creep);
            }
        }
    }

    utilities.garbageCollection();
}
