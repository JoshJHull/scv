type Drive = {
    speed: number,
    fuelUse: number,
    stage1Accel: number,
    stage2Accel: number
};

const sparkfire: Drive = {
    speed: 0.171,
    fuelUse: 0.016,
    stage1Accel: 0.003450,
    stage2Accel: 0.017200
};

export const driveList: Map<string, Drive> = new Map([
    ['sparkfire', sparkfire],
])
