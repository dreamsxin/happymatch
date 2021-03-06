import { CELL_TYPE, ANITIME, CELL_STATUS, GRID_HEIGHT } from "./ConstValue";
export default class CellModel {
    constructor() {
        this.type = null;
        this.status = CELL_STATUS.COMMON;
        this.x = 1;
        this.y = 1;
        this.startX = 1;
        this.startY = 1;
        this.cmd = [];
        this.isDeath = false;
        this.objecCount = Math.floor(Math.random() * 1000);
        this.code = 0;
    }

    init(type) {
        this.type = type;
        if (type == g_obstacle.stone) {
            this.setStatus(CELL_STATUS.STATIC);
        }
        else if (type == g_obstacle.box) {
            this.setStatus(CELL_STATUS.DYNAMIC);
        }
        else if (type == g_obstacle.ice) {
            this.setStatus(CELL_STATUS.ICE);
            this.count = 2;
        }
    }

    isEmpty() {
        return this.type == CELL_TYPE.EMPTY;
    }

    setEmpty() {
        this.type = CELL_TYPE.EMPTY;
    }
    setXY(x, y) {
        this.x = x;
        this.y = y;
    }

    setStartXY(x, y) {
        this.startX = x;
        this.startY = y;
    }

    setStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }

    setCode(code) {
        this.code = code;
    }
    getCode() {
        return this.code;
    }

    moveToAndBack(pos) {
        var srcPos = cc.v2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        });
    }

    moveTo(pos, playTime) {
        var srcPos = cc.v2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y;
    }

    toDie(playTime) {
        this.cmd.push({
            action: "toDie",
            playTime: playTime,
            keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }
    toDrop(playTime) {
        this.cmd.push({
            action: "toDrop",
            playTime: playTime,
            keepTime: ANITIME.DROP
        });
        this.isDeath = true;
    }

    toShake(playTime) {
        this.cmd.push({
            action: "toShake",
            playTime: playTime,
            keepTime: ANITIME.DIE_SHAKE
        });
    }

    toTipsLeft(playTime) {
        this.cmd.push({
            action: "toTipsLeft",
            playTime: playTime,
            keepTime: ANITIME.TIPS
        });
    }
    toTipsRight(playTime) {
        this.cmd.push({
            action: "toTipsRight",
            playTime: playTime,
            keepTime: ANITIME.TIPS
        });
    }
    toTipsUp(playTime) {
        this.cmd.push({
            action: "toTipsUp",
            playTime: playTime,
            keepTime: ANITIME.TIPS
        });
    }
    toTipsDown(playTime) {
        this.cmd.push({
            action: "toTipsDown",
            playTime: playTime,
            keepTime: ANITIME.TIPS
        });
    }

    setVisible(playTime, isVisible) {
        this.cmd.push({
            action: "setVisible",
            playTime: playTime,
            keepTime: 0,
            isVisible: isVisible
        });
    }

    moveToAndDie(pos) {

    }

    isBird() {
        return this.type == CELL_TYPE.G;
    }

    toWrapCenter(playTime){
        this.cmd.push({
            action: "toWrapCenter",
            playTime: playTime,
            keepTime: ANITIME.WRAP_TOTAL
        });
        this.isDeath = true;
    }
    toWrapInside(playTime, vCenter) {
        this.cmd.push({
            action: "toWrapInside",
            playTime: playTime,
            keepTime: ANITIME.WRAP_TOTAL,
            vCenter
        });
        this.isDeath = true;
    }

    toWrapOutside(playTime, vCenter) {
        this.cmd.push({
            action: "toWrapOutside",
            playTime: playTime,
            keepTime: ANITIME.WRAP_TOTAL,
            vCenter
        });
        this.isDeath = true;
    }

    toAttract(playTime, vCenter) {
        this.cmd.push({
            action: "toAttract",
            playTime: playTime,
            keepTime: ANITIME.BOMB_BIRD_DELAY,
            vCenter
        });
        this.isDeath = true;
    }

    toIceCrack(playTime) {
        this.cmd.push({
            action: "toIceCrack",
            playTime: playTime,
            keepTime: ANITIME.ICE_CRACK
        });
    }
}
