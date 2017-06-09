var Utilities = {
    garbageCollection: function () {
        var counter = 0;
        for (var n in Memory.creeps) {
            var c = Game.creeps[n];
            if (!c) {
                console.log('Clearing creep memory: ' + n + ' (' + Memory.creeps[n].role + ')');
                delete Memory.creeps[n];
                counter++;
            }
        }
    },
    occasionally: function (interval, callback) {
        if (Game.time % interval === 0) {
            callback();
        }
    }
}
module.exports = Utilities;
