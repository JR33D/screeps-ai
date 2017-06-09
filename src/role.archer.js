var roleArcher = {
    parts: {
        basic: [Game.RANGED_ATTACK, Game.MOVE], // 200
        interm: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE] // 400
    },
    build: function (spawn) {
        var bodyParts = this.parts['interm'];
        if (spawn.canCreateCreep(bodyParts) == ERR_NOT_ENOUGH_ENERGY) {
            bodyParts = this.parts['basic'];
        }
        var newName = spawn.createCreep(bodyParts, undefined, { role: 'archer' });
        console.log('Spawning new archer: ' + newName);
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
