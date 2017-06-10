var roleMiner = {
    parts: {
        basic: [MOVE, WORK, WORK], // 250
        interm: [MOVE, WORK, WORK, WORK, MOVE] // 400
    },
    build: function (spawn, availableEnergy) {
        var bodyParts;
        if (availableEnergy >= 400) {
            bodyParts = this.parts['interm'];
        } else if (availableEnergy >= 250) {
            bodyParts = this.parts['basic'];
        }

        if (bodyParts) {
            var newName = spawn.createCreep(bodyParts, undefined, { role: 'miner' });
            console.log('Spawning new creep: ' + newName + ' (' + Game.creeps[newName].memory.role + ')');
        }
    },
    run: function (creep) {
        ;
        var source = Game.getObjectById(creep.memory.harvestTarget);

        if (source == null) {
            var source = this.openMineSpace(creep);

            if (!source)
                return;

            this.setSourceToMine(source);
        }

        if (creep.pos.inRangeTo(source, 5))
            creep.memory.isNearSource = true;
        else
            creep.memory.isNearSource = false;


        Memory.sources[source.id].miner = creep.id;

        creep.moveTo(source);
        creep.harvest(source);
    },
    openMineSpace: function (creep) {
        let room = creep.room;
        let mineableSources = [];
        for (let source of room.find(FIND_SOURCES)) {

            if (Memory.sources[source.id] == undefined) {
                Memory.sources[source.id] = { id: source.id };
            }

            let creepCount = 0;
            for (let creep of room.find(FIND_MY_CREEPS)) {
                if (creep.memory.harvestTarget === source.id) {
                    creepCount++;
                }
            }
            if (creepCount < 2) {
                mineableSources.push(source);
            }
        }
        if (mineableSources.length > 0) {
            creep.memory.harvestTarget = creep.pos.findClosestByPath(mineableSources).id;
        }
    }
};

module.exports = roleMiner;
