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
    }

    init(type) {
        this.type = type;
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
            keepTime: ANITIME.WARAP_TOTAL
        });
    }
    toWrapInside(playTime, vCenter) {
        this.cmd.push({
            action: "toWrapInside",
            playTime: playTime,
            keepTime: ANITIME.WARAP_TOTAL,
            vCenter
        });
    }

    toWrapOutside(playTime, vCenter) {
        this.cmd.push({
            action: "toWrapOutside",
            playTime: playTime,
            keepTime: ANITIME.WARAP_TOTAL,
            vCenter
        });
    }
}
