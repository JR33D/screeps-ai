var config = require('config');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWarrior = require('role.warrior');
var roleCarrier = require('role.carrier');

var roomManager = {
    buildAllRoads: function (spawn) {
        var sourceTargets = spawn.room.find(FIND_SOURCES);
        var mineralTargets = spawn.room.find(FIND_MINERALS);
        var structureTargets = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_CONTROLLER ||
                    structure.structureType == STRUCTURE_TOWER);
            }
        });
        var targets = _.union(sourceTargets, mineralTargets, structureTargets)
        for (var i = 0; i < targets.length; i++) {
            var path = spawn.room.findPath(spawn.pos, targets[i].pos, { ignoreCreeps: true });
            for (var j = 0; j < path.length - 1; j++) {
                var tiles = spawn.room.lookAt(path[j].x, path[j].y);
                var valid = true;
                for (var k = 0; k < tiles.length; k++) {
                    if (tiles[k].type === 'constructionSite') {
                        valid = false;
                        k = tiles.length + 1;
                    }
                }
                if (valid) {
                    spawn.room.createConstructionSite(path[j].x, path[j].y, STRUCTURE_ROAD);
                }
            }
        }
    },
    checkPopulation: function (spawn, availableEnergy) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior');
        var archers = _.filter(Game.creeps, (creep) => creep.memory.role == 'archer');
        console.log('Harvesters: ' + harvesters.length + ' | Builders: ' + builders.length
            + '\nMiners: ' + miners.length + ' | Carriers: ' + carriers.length
            + '\nUpgraders: ' + upgraders.length + ' | '
            + '\nWarriors: ' + warriors.length + ' | Archers: ' + archers.length);

        if (!spawn.spawning && harvesters.length < config.MAX_HARVESTERS) {
            roleHarvester.build(spawn, availableEnergy);
        }
        if (!spawn.spawning && miners.length < config.MAX_MINERS) {
            roleMiner.build(spawn, availableEnergy);
        }
        if (!spawn.spawning && carriers.length < config.MAX_CARRIERS) {
            roleCarrier.build(spawn, availableEnergy);
        }
        if (!spawn.spawning && (builders.length < config.MAX_BUILDERS && harvesters.length >= config.MAX_HARVESTERS)) {
            roleBuilder.build(spawn, availableEnergy);
        }
        if (!spawn.spawning && (upgraders.length < config.MAX_UPGRADERS && builders.length >= config.MAX_BUILDERS && harvesters.length >= config.MAX_HARVESTERS)) {
            roleUpgrader.build(spawn, availableEnergy);
        }
        if (!spawn.spawning && warriors.length < config.MAX_WARRIORS) {
            roleWarrior.build(spawn, availableEnergy);
        }

        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                'Spawn: ' + spawningCreep.memory.role,
                spawn.pos.x - 2, spawn.pos.y - 2,
                { align: 'left', opacity: 0.8 }
            );
        }
    }
};

module.exports = roomManager;
