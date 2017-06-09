var roleUpgrader = {
    parts: {
        basic: [WORK, CARRY, MOVE], // 200
        interm: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] // 400
    },
    build: function (spawn) {
        var bodyParts = this.parts['interm'];
        if (spawn.canCreateCreep(bodyParts) == ERR_NOT_ENOUGH_ENERGY) {
            bodyParts = this.parts['basic'];
        }
        var newName = spawn.createCreep(bodyParts, undefined, { role: 'upgrader', upgrading: false });
        console.log('Spawning new upgrading: ' + newName);
    },
    run: function (creep) {
        if (creep.memory.upgrading && (creep.carry.energy == 0 || creep.carry.energy < creep.carry.carryCapacity)) {
            creep.memory.upgrading = false;
            creep.say('🎁');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('🔨');
        }
        if (!creep.memory.upgrading) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { reusePath: 50 });
            }
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { reusePath: 50 });
            }
        }
    }
};

module.exports = roleUpgrader;
