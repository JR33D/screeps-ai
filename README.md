# screeps-ai
Repository for code used for the programming MMO, http://screeps.com
## Notes

### src/config.ts
config.ts is not checked in to avoid unnecessary checkins due to the count adjustments to the number of various units.
Current config.ts structure:
```javascript
export class Config {
    public static activeWorkers = {
        worker: 1,
        builder: 0,
        upgrader: 1,
        carrier: 1,
        zealot: 0,
        flagMiner: 2
    };
    public static healThreshold = 500;
};
```


### Attacking units
Put you ```TOUGH``` parts first. Under attack, the first parts to take hits are those specified first. 
Full damage to a part leads to complete disabling of it – the creep can no longer perform this function.

### Random facts
* Cannons can heal/reinforce structures
* 