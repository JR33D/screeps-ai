var roleBuilder = {
    parts: {
        basic: [WORK, CARRY, MOVE], // 200
        interm: [WORK, WORK, CARRY, MOVE] // 300
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if(availableEnergy >= 300) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 200) {
            bodyParts = this.parts['basic'];
        }

        if(bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'builder', building: false });
            console.log('Spawning new creep: ' + newName + ' ('+Game.creeps[newName].memory.role +')');
        }
    },
    run: function (creep) {
        if (creep.memory.building && (creep.carry.energy == 0 || creep.carry.energy < creep.carry.carryCapacity)) {
            creep.memory.building = false;
            creep.say('🎁');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.say('🔨');
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { reusePath: 50 });
                }
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { reusePath: 50 });
            }
        }
    }
};

module.exports = roleBuilder;
