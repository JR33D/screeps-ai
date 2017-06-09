var roleWarrior = {
    parts: {
        basic: [TOUGH, TOUGH, MOVE, ATTACK], // 150
        iterm: [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK] // 300
    },
    build: function (spawn) {
        var bodyParts = this.parts['interm'];
        if (spawn.canCreateCreep(bodyParts) == ERR_NOT_ENOUGH_ENERGY) {
            bodyParts = this.parts['basic'];
        }
        var newName = spawn.createCreep(bodyParts, undefined, { role: 'warrior' });
        console.log('Spawning new warrior: ' + newName);
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
