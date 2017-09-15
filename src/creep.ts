import Task from './tasks/index';

export default class MyCreep extends Creep {

    _currentTask: Task;

    constructor() {
        super();
    }

    get role(): string {
        return this.memory['role'];
    }

    get task(): Task {
        return this._currentTask;
    }

    public hasBodyPart(partName: string): boolean {
        return this.hasBodyParts([partName]);
    }

    public hasBodyParts(partNames: string[]): boolean {
        return partNames.every(name => this.body.some(bpd => bpd.type.toUpperCase() === name));
    }

    public isEmpty(this: Creep): boolean {
        return this.carry.energy === 0 && this.carry.power === 0 && this.carryCapacity > 0;
    }

    public isFull(): boolean {
        if (this.hasBodyPart('carry')) {
            return (((this.carry.energy) ? this.carry.energy : 0) + ((this.carry.power) ? this.carry.power : 0)) >= this.carryCapacity;
        } else {
            throw new Error('Creey does not have CARRY body part!');
        }
    }

    public run(): void {

    }
}
