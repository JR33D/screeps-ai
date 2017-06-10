var roleArcher = {
    parts: {
        basic: [Game.RANGED_ATTACK, Game.MOVE], // 200
        interm: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE] // 400
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if(availableEnergy >= 400) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 200) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'archer' });
            console.log('Spawning new creep: ' + newName + ' ('+Game.creeps[newName].memory.role +')');
        }
    },
    run: function (creep) {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length > 0) {
            creep.say('💀💥🔥☠');
            creep.moveTo(targets[0]);
            if (targets.length < 2) {
                creep.rangedAttack(targets[0]);
            } else {
                creep.rangedMassAttack();
            }
        }
    }
};

module.exports = roleArcher;
