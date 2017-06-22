var config = require('config');
var repairPercentage = 0.00006;
var roleTower = {
    run: function (tower) {
        // Task priority for towers: attack, then heal, then repair
        var taskPriority = [
            (tower) => this.attackNearestEnemy(tower),
            (tower) => this.healNearestAlly(tower),
            (tower) => this.preventRampartDecay(tower),
            (tower) => this.repairNearestStructure(tower),
        ];
        for (let task of taskPriority) {
            if (task(tower) == OK) {
                break;
            }
        }
    },
    attackNearestEnemy: function (tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile != undefined) {
            return tower.attack(closestHostile);
        }
    },
    healNearestAlly: function (tower) {
        var closestDamagedAlly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax,
        });
        if (closestDamagedAlly) {
            return tower.heal(closestDamagedAlly);
        }
    },
    repairNearestStructure: function (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax &&
                s.structureType != STRUCTURE_ROAD &&
                s.structureType != STRUCTURE_WALL &&
                s.structureType != STRUCTURE_RAMPART,
        });
        if (closestDamagedStructure) {
            return tower.repair(closestDamagedStructure);
        }
    },
    preventRampartDecay: function (tower) {
        let hp = 0.25; // TODO: hardwired
        var closestDyingRampart = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < (hp * s.hitsMax) && s.structureType == STRUCTURE_RAMPART,
        });
        if (closestDyingRampart) {
            return tower.repair(closestDyingRampart);
        }
    }
};
module.exports = roleTower;
