import { RoleTaskStatus } from './task.enums';
import MyCreep from '../creep';
import {Role} from '../enums/role';

export default function runPickupTask(creep: MyCreep) {
    if (creep.isFull) {
        return RoleTaskStatus.Completed;
    }

    const carriersWithEnergy = creep.memory.currentRole !== Role.Carrier
        ? creep.room.find<Creep>(FIND_MY_CREEPS, {filter: creep =>
            creep.memory.currentRole === Role.Carrier && (creep.carry.energy >= 50 || creep.carry.energy >= 15 && creep.memory.ticksSinceLastMove > 7)})
        : creep.room.find<Creep>(FIND_MY_CREEPS, {filter: creep =>
            creep.memory.currentRole === Role.Harvester && creep.carry.energy >= 25 && creep.memory.ticksSinceLastMove > 7});
    const droppedResources   = creep.room.find<Resource>(FIND_DROPPED_RESOURCES, {filter: x => x.amount > 25});

    const targets = droppedResources.length > 0 ? droppedResources : carriersWithEnergy;

    if (targets.length > 0 && creep.pickup(targets[0]) === OK) {
        if (creep.isFull) {
            return RoleTaskStatus.Completed;
        }
        return RoleTaskStatus.Ok;
    }
    if (!creep.isEmpty) {
        return RoleTaskStatus.Completed;
    }
    return RoleTaskStatus.Failed;
};
