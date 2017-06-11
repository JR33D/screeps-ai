var roleWarrior = {
    parts: {
        basic: [TOUGH, TOUGH, MOVE, ATTACK], // 150
        iterm: [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK] // 300
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if (availableEnergy >= 300) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 150) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'warrior' });
            console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
        }
    },
    run: function (creep) {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length > 0) {
            creep.say('💀💥🔥☠');
            creep.moveTo(targets[0]);
            creep.attack(targets[0]);
        }
    }
};

module.exports = roleWarrior;
