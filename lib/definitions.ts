export type Nullable<T> = T | null | undefined;

export type Ship = {
    id: string,
    name: string,
    size: number,
    qfuel: number,
    default_drive: string
};

export type Drive = {
    id: string,
    name: string,
    fuel_use: number,
    speed: number,
    stage1: number,
    stage2: number,
    size: number
};

export enum raceStatus {
    stopped,
    running,
    paused,
}

/*export enum jumpPhase {
    accel,
    cruise,
    decel,
    complete,
}*/