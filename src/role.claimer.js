module.exports = {
    parts: {
        basic: [CLAIM, MOVE], // 650
    },
    build: function(spawn, availableEnergy, target) {
        var bodyParts;
        if (availableEnergy >= 650) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'claimer', target: target });
            console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
        }
        
    },
    run: function(creep) {
        // if in target room
        var roomController = Game.getObjectById('58dbc6658283ff5308a41eec');
        
        if (creep.room.name !== creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        } else { 
            if(creep.claimController(creep.room.controller) == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller)
            }
        }
    }
};