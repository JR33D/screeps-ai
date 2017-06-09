var config = require('config')

var roomManager = {
    buildAllRoads: function (spawn) {
        var targets = spawn.room.find(FIND_SOURCES_ACTIVE);
        for (var i = 0; i < targets.length; i++) {
            var path = spawn.room.findPath(spawn.pos, targets[i].pos, { maxOps: 1000, ignoreDestructibleStructures: true, ignoreCreeps: true });
            for (var j = 0; j < path.length - 1; j++) {
                var tiles = spawn.room.lookAt(path[j].x, path[j].y);
                var valid = true;
                for (var k = 0; k < tiles.length; k++) {
                    if (tiles[k].type === 'constructionSite') {
                        valid = false;
                        k = tiles.length + 1;
                    }
                }
            }
            if (valid) {
                spawn.room.createConstructionSite(path[j].x, path[j].y, STRUCTURE_ROAD);
            }
        }
    },
    checkPopulation: function (spawn, availableEnergy) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior');
        console.log('Harvesters: ' + harvesters.length + '\nBuilders: ' + builders.length + '\nUpgraders: ' + upgraders.length + '\nWarriors: ' + warriors.length);

        if (!spawn.spawning && harvesters.length < config.MAX_HARVESTERS) {

        }

        if (!spawn.spawning && (builders.length < config.MAX_BUILDERS && harvesters.length == config.MAX_HARVESTERS)) {

        }

        if (!spawn.spawning && (upgraders.length < config.MAX_UPGRADERS && builders.length == config.MAX_BUILDERS && harvesters.length == config.MAX_HARVESTERS)) {

        }

        if (!spawn.spawning && warriors.length < config.MAX_WARRIORS) {

        }

        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                'Spawn: ' + spawningCreep.memory.role,
                spawn.pos.x + 1, spawn.pos.y + 1,
                { align: 'left', opacity: 0.8 }
            );
        }
    }
};

module.exports = roomManager;
