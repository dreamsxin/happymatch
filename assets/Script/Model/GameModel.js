import CellModel from "./CellModel";
import { CELL_TYPE, CELL_BASENUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, ANITIME, CELL_HEIGHT } from "./ConstValue";

const MATH_FLOOR = Math.floor;
const MATH_RONDOM = Math.random;

export default class GameModel {
    constructor() {
        this.cells = null;
        this.cellBgs = null;
        this.lastPos = cc.v2(-1, -1);
        this.cellTypeNum = 5;
        this.cellCreateType = []; // 升成种类只在这个数组里面查找
    }

    init(cellTypeNum) {
        this.cells = [];
        this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
        for (var i = 1; i <= GRID_WIDTH; i++) {
            this.cells[i] = [];
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                this.cells[i][j] = new CellModel();
            }
        }

        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                let flag = true;
                while (flag) {
                    flag = false;
                    this.cells[i][j].init(this.getRandomAllType());
                    let result = this.checkPoint(j, i)[0];
                    if (result.length > 2) {
                        flag = true;
                    }
                    this.cells[i][j].setXY(j, i);
                    this.cells[i][j].setStartXY(j, i);
                }
            }
        }

        this.setCellsCopy();
    }

    initWithData(data) {
        // to do
    }

    checkPoint(x, y) {
        let checkWithDirection = function (x, y, direction) {
            let queue = [];
            let vis = [];
            vis[x + y * GRID_WIDTH] = true;
            queue.push(cc.v2(x, y));
            let front = 0;
            while (front < queue.length) {
                //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
                let point = queue[front];
                let cellModel = this.cells[point.y][point.x];
                front++;
                if (!cellModel 
                || cellModel.status == CELL_STATUS.STATIC
                || cellModel.status == CELL_STATUS.DYNAMIC
                || cellModel.status == CELL_STATUS.ICE) {
                    continue;
                }
                for (let i = 0; i < direction.length; i++) {
                    let tmpX = point.x + direction[i].x;
                    let tmpY = point.y + direction[i].y;
                    if (tmpX < 1 || tmpX > GRID_HEIGHT
                        || tmpY < 1 || tmpY > GRID_WIDTH
                        || vis[tmpX + tmpY * 9]
                        || !this.cells[tmpY][tmpX]) {
                        continue;
                    }
                    if (cellModel.type == this.cells[tmpY][tmpX].type) {
                        vis[tmpX + tmpY * 9] = true;
                        queue.push(cc.v2(tmpX, tmpY));
                    }
                }
            }
            return queue;
        }
        let rowResult = checkWithDirection.call(this, x, y, [cc.v2(1, 0), cc.v2(-1, 0)]);
        let colResult = checkWithDirection.call(this, x, y, [cc.v2(0, -1), cc.v2(0, 1)]);
        let result = [];
        let newCellStatus = "";
        
        //当两只魔力鸟同时交换的时候，就会达到清屏的技能，整个屏幕上的动物都会消失
        //魔力鸟+1=神奇鸟
        //两个魔力鸟交换，会清屏。
        //两个神奇鸟交换，会清屏两次。
        //一个神奇鸟和一个魔力鸟交换，魔力鸟会清屏，神奇鸟会随机清除屏幕上的两种小动物

        if (rowResult.length >= 5 || colResult.length >= 5) {
            //任意五个'同行'且相同的动物可以合成一个'魔力鸟'特效
            newCellStatus = CELL_STATUS.BIRD;
        }
        else if (rowResult.length >= 3 && colResult.length >= 3) {
            //五个相同的'不同行'动物可以合成一个'爆炸特效'
            newCellStatus = CELL_STATUS.WRAP;
        }
        else if (rowResult.length >= 4) {
            //四个相同的动物一行或一列可以合成一个直线特效
            newCellStatus = CELL_STATUS.LINE;
        }
        else if (colResult.length >= 4) {
            //四个相同的动物一行或一列可以合成一个直线特效
            newCellStatus = CELL_STATUS.COLUMN;
        }
        if (rowResult.length >= 3) {
            result = rowResult;
        }
        if (colResult.length >= 3) {
            let tmp = result.concat();
            colResult.forEach(function (newEle) {
                let flag = false;
                tmp.forEach(function (oldEle) {
                    if (newEle.x == oldEle.x && newEle.y == oldEle.y) {
                        flag = true;
                    }
                }, this);
                if (!flag) {
                    result.push(newEle);
                }
            }, this);
        }
        return [result, newCellStatus, this.cells[y][x].type];
    }

    printInfo() {
        for (var i = 1; i <= 9; i++) {
            var printStr = "";
            for (var j = 1; j <= 9; j++) {
                printStr += this.cells[i][j].type + " ";
            }
            cc.log(printStr);
        }
    }

    getCells() {
        return this.cells;
    }

    setCellsCopy() {
        this.cellsCopy = JSON.parse(JSON.stringify(this.cells));
    }

    // controller调用的主要入口
    // 点击某个格子
    selectCell(pos) {
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        var lastPos = this.lastPos;
        var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
        if (delta != 1) { //非相邻格子， 直接返回
            this.lastPos = pos;
            return [[], []];
        }
        let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子
        let lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格子
        this.exchangeCell(lastPos, pos);
        var result1 = this.checkPoint(pos.x, pos.y)[0];
        var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(curClickCell);
        this.pushToChangeModels(lastClickCell);
        let isCanBomb = (curClickCell.status != CELL_STATUS.COMMON && // 判断两个是否是特殊的动物
            lastClickCell.status != CELL_STATUS.COMMON) ||
            curClickCell.status == CELL_STATUS.BIRD ||
            lastClickCell.status == CELL_STATUS.BIRD;
        if (result1.length < 3 && result2.length < 3 && !isCanBomb) {//不会发生消除的情况
            this.exchangeCell(lastPos, pos);
            curClickCell.moveToAndBack(lastPos);
            lastClickCell.moveToAndBack(pos);
            this.lastPos = cc.v2(-1, -1);
            return [this.changeModels];
        }
        else {
            this.lastPos = cc.v2(-1, -1);
            curClickCell.moveTo(lastPos, this.curTime);
            lastClickCell.moveTo(pos, this.curTime);
            var checkPoint = [pos, lastPos];
            this.curTime += ANITIME.TOUCH_MOVE;
            this.processCrush(checkPoint);
            return [this.changeModels, this.effectsQueue];
        }
    }

    forceSelectCell(pos) {
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        var lastPos = this.lastPos;
        var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
        if (delta != 1) { //非相邻格子， 直接返回
            this.lastPos = pos;
            return [[], []];
        }
        let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子
        let lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格子
        this.exchangeCell(lastPos, pos);
        
        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(curClickCell);
        this.pushToChangeModels(lastClickCell);

        this.lastPos = cc.v2(-1, -1);
        curClickCell.moveTo(lastPos, this.curTime);
        lastClickCell.moveTo(pos, this.curTime);
        var checkPoint = [pos, lastPos];
        this.curTime += ANITIME.TOUCH_MOVE;
        this.processCrush(checkPoint);
        return [this.changeModels, this.effectsQueue];
    }
    
    changeSelectCell(pos) {
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        var lastPos = this.lastPos;
        if (!lastPos || lastPos.equals(pos) || lastPos.equals(cc.v2(-1, -1))) {
            this.lastPos = pos;
            return [[], []];
        }
        let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子
        let lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格子
        this.exchangeCell(lastPos, pos);
        
        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(curClickCell);
        this.pushToChangeModels(lastClickCell);

        this.lastPos = cc.v2(-1, -1);
        curClickCell.moveTo(lastPos, this.curTime);
        lastClickCell.moveTo(pos, this.curTime);
        var checkPoint = [pos, lastPos];
        this.curTime += ANITIME.TOUCH_MOVE;
        this.processCrush(checkPoint);
        return [this.changeModels, this.effectsQueue];
    }
    
    rocketSelectCell(pos, status) {        
        this.cells[pos.y][pos.x].status = status;

        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效

        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(this.cells[pos.y][pos.x]);

        let bombModels = [this.cells[pos.y][pos.x]]; //当前点击的格子;
        this.crushCell(pos.x, pos.y, false, 0);
        this.processBomb(bombModels, bombModels.length);
        this.curTime += ANITIME.DIE;
        this.processCrush(this.down());
    
        return [this.changeModels, this.effectsQueue];
    }

    hammerSelectCell(pos) {
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效

        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(this.cells[pos.y][pos.x]);
        
        let bombModels = [this.cells[pos.y][pos.x]]; //当前点击的格子;
        this.crushCell(pos.x, pos.y, false, 0);
        // this.processBomb(bombModels, bombModels.length);
        this.curTime += ANITIME.DIE;
        this.processCrush(this.down());
    
        return [this.changeModels, this.effectsQueue];
    }
    // 消除
    processCrush(checkPoint) {
        let cycleCount = 0;
        while (checkPoint.length > 0) {
            let bombModels = [];
            if (cycleCount == 0 && checkPoint.length == 2) { //特殊消除
                let pos1 = checkPoint[0];
                let pos2 = checkPoint[1];
                let model1 = this.cells[pos1.y][pos1.x];
                let model2 = this.cells[pos2.y][pos2.x];
                if (model1.status == CELL_STATUS.BIRD || model2.status == CELL_STATUS.BIRD) {
                    if (model1.status == CELL_STATUS.BIRD) {
                        model1.type = model2.type;
                        bombModels.push(model1);
                    }
                    else {
                        model2.type = model1.type;
                        bombModels.push(model2);
                    }
                }
            }
            for (var i in checkPoint) {
                var pos = checkPoint[i];
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }
                var [result, newCellStatus, newCellType] = this.checkPoint(pos.x, pos.y);

                if (result.length < 3) {
                    continue;
                }
                for (var j in result) {
                    var model = this.cells[result[j].y][result[j].x];
                    this.crushCell(result[j].x, result[j].y, false, cycleCount);
                    if (model.status != CELL_STATUS.COMMON) {
                        bombModels.push(model);
                    }
                }
                this.createNewCell(pos, newCellStatus, newCellType);
            }

            this.processBomb(bombModels, cycleCount);

            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            
            let isBox = false;
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[1][j] && this.cells[1][j].status == CELL_STATUS.DYNAMIC) {
                    this.crushBoxDrop(j, 1);
                    isBox = true;
                    checkPoint.push(cc.v2(1, j));
                }
            }
            if (isBox) {
                this.curTime += ANITIME.DROP;
            }

            cycleCount++;
        }
    }

    //生成新cell
    createCell(pos, status, type) {
        if (status == CELL_STATUS.BIRD) {
            type = CELL_TYPE.BIRD;
        }
        let model = new CellModel();
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
        return model;
    }

    createNewCell(pos, status, type) {
        if (status == "") {
            return;
        }
        if (status == CELL_STATUS.BIRD) {
            type = CELL_TYPE.BIRD;
        }
        let model = new CellModel();
        this.cells[pos.y][pos.x] = model;
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
    }
    // 下落
    down() {
        let newCheckPoint = [];
        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j] == null) {
                    var curRow = i;
                    for (var k = curRow; k <= GRID_HEIGHT; k++) {
                        if (!this.isCell(cc.v2(j, k))) {
                            break;
                        }

                        if (this.cells[k][j]) {
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(cc.v2(j, curRow), this.curTime);
                            curRow++;
                        }
                    }
                    var count = 1;
                    for (var k = curRow; k <= GRID_HEIGHT; k++) {
                        if (!this.isCell(cc.v2(j, k))) {
                            break;
                        }
                        this.cells[k][j] = new CellModel();
                        this.cells[k][j].init(this.getRandomCellType());
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].moveTo(cc.v2(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                    }
                }
            }
        }
        this.curTime += ANITIME.TOUCH_MOVE + 0.3
        return newCheckPoint;
    }

    pushToChangeModels(model) {
        if (this.changeModels.indexOf(model) != -1) {
            return;
        }
        this.changeModels.push(model);
    }

    cleanCmd() {
        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].cmd = [];
                }
            }
        }
    }

    exchangeCell(pos1, pos2) {
        var tmpModel = this.cells[pos1.y][pos1.x];
        this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
        this.cells[pos1.y][pos1.x].x = pos1.x;
        this.cells[pos1.y][pos1.x].y = pos1.y;
        this.cells[pos2.y][pos2.x] = tmpModel;
        this.cells[pos2.y][pos2.x].x = pos2.x;
        this.cells[pos2.y][pos2.x].y = pos2.y;
    }
    // 设置种类
    // Todo 改成乱序算法
    setCellTypeNum(num) {
        cc.log("num = ", num);
        this.cellTypeNum = num;
        this.cellCreateType = [];
        for (let i = 1; i <= CELL_BASENUM; i++) {
            this.cellCreateType.push(i);
        }

        for (let i = 0; i < this.cellCreateType.length; i++) {
            let index = MATH_FLOOR(MATH_RONDOM() * this.cellCreateType.length);
            let value = this.cellCreateType[i];
            this.cellCreateType[i] = this.cellCreateType[index];
            this.cellCreateType[index] = value;
        }

        let obstalce = [];
        for (let key in g_obstacle) {
            obstalce.push(g_obstacle[key]);
        }
        for (let i = 0; i < obstalce.length; i++) {
            let index = MATH_FLOOR(MATH_RONDOM() * obstalce.length);
            let value = obstalce[i];
            obstalce[i] = obstalce[index];
            obstalce[index] = value;
        }

        this.allCreateType = [];
        for (let i of this.cellCreateType) {
            this.allCreateType.push(i);
        }
        for (let i of obstalce) {
            this.allCreateType.push(i);
        }
        for (let i = 0; i < this.allCreateType.length; i++) {
            let index = MATH_FLOOR(MATH_RONDOM() * this.allCreateType.length);
            let value = this.allCreateType[i];
            this.allCreateType[i] = this.allCreateType[index];
            this.allCreateType[index] = value;
        }
    }
    // 随要生成一个类型
    getRandomCellType() {
        var index = MATH_FLOOR(MATH_RONDOM() * this.cellTypeNum);
        // let index = MATH_FLOOR(MATH_RONDOM() * this.cellCreateType.length);
        return this.cellCreateType[index];
    }
    getRandomAllType() {
        var index = MATH_FLOOR(MATH_RONDOM() * this.allCreateType.length);
        return this.allCreateType[index];
    }
    // TODO bombModels去重
    processBomb(bombModels, cycleCount) {
        while (bombModels.length > 0) {
            let newBombModel = [];
            let bombTime = ANITIME.BOMB_DELAY;
            bombModels.forEach(function (model) {
                if (model.status == CELL_STATUS.LINE) {
                    for (let i = 1; i <= GRID_WIDTH; i++) {
                        if (this.cells[model.y][i]) {
                            if (this.cells[model.y][i].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[model.y][i]);
                            }
                            this.crushCell(i, model.y, false, cycleCount);
                        }
                    }
                    this.addRowBomb(this.curTime, cc.v2(model.x, model.y));
                }
                else if (model.status == CELL_STATUS.COLUMN) {
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        if (this.cells[i][model.x]) {
                            if (this.cells[i][model.x].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[i][model.x]);
                            }
                            this.crushCell(model.x, i, false, cycleCount);
                        }
                    }
                    this.addColBomb(this.curTime, cc.v2(model.x, model.y));
                }
                else if (model.status == CELL_STATUS.WRAP) {
                    let isCrush = false;
                    let x = model.x;
                    let y = model.y;
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            if (this.cells[i][j] && delta <= 2) {
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushWrapCell(j, i, cc.v2(x, y), delta);
                                isCrush = true;
                            }
                        }
                    }
                    
                    if (isCrush) {
                        if (bombTime < ANITIME.WRAP_TOTAL) {
                            bombTime = ANITIME.WRAP_TOTAL;
                        }
                        this.addWrapBomb(this.curTime, cc.v2(x, y));
                    }
                }
                else if (model.status == CELL_STATUS.BIRD) {
                    let crushType = model.type
                    if (crushType == CELL_TYPE.BIRD) {
                        crushType = this.getRandomCellType();
                    }
                    let isCrush = false;
                    let vCenter = cc.v2(model.x, model.y);
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            if (this.cells[i][j] && this.cells[i][j].type == crushType) {
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushBirdCell(j, i, vCenter);
                                isCrush = true;
                            }
                        }
                    }
                    //this.crushCell(model.x, model.y);
                    if (isCrush) {
                        if (bombTime < ANITIME.BOMB_BIRD_DELAY) {
                            bombTime = ANITIME.BOMB_BIRD_DELAY;
                        }
                        this.addBirdBomb(this.curTime, vCenter);
                    }
                }
            }, this);
            if (bombModels.length > 0) {
                this.curTime += bombTime;
            }
            bombModels = newBombModel;
        }
    }

    /**
     * 
     * @param {开始播放的时间} playTime 
     * @param {*cell位置} pos 
     * @param {*第几次消除，用于播放音效} step 
     */
    addCrushEffect(playTime, pos, step) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "crush",
            step
        });
        this.effectsQueue.push({
            playTime,
            pos,
            action: "crushBottom",
            parent:window.gridView.node
        });
    }

    addRowBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "rowBomb"
        });
    }

    addColBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "colBomb"
        });
    }

    addWrapBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "wrapBomb"            
        });
    }

    addBirdBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "birdBomb"
        });
    }

    addSteps(pos, self) {
        this.effectsQueue.push({
            action: "addSteps",
            pos,
            gridView:self
        });
    }
    // cell消除逻辑
    crushCell(x, y, needShake, step) {
        let model = this.cells[y][x];
        this.pushToChangeModels(model);
        if (needShake) {
            model.toShake(this.curTime)
        }

        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this.curTime + shakeTime);
        this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), step);
        this.cells[y][x] = null;
    }

    crushWrapCell(x, y, vCenter, delta) {
        let model = this.cells[y][x];
        this.pushToChangeModels(model);
        if (delta == 0) {
            model.toWrapCenter(this.curTime);
        }
        else if (delta == 1) {
            model.toWrapInside(this.curTime, vCenter);
        }
        else {
            model.toWrapOutside(this.curTime, vCenter);
        }
        this.cells[y][x] = null;
    }

    crushBirdCell(x, y, vCenter) {
        let model = this.cells[y][x];
        this.pushToChangeModels(model);
        model.toShake(this.curTime);

        model.toAttract(this.curTime + ANITIME.DIE_SHAKE, vCenter);
        this.cells[y][x] = null;
    }

    crushBoxDrop(x, y) {
        let model = this.cells[y][x];
        this.pushToChangeModels(model);
        model.toDrop(this.curTime);
        this.cells[y][x] = null;
    }

    selectBack() {
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        for(var i = 1;i<=GRID_WIDTH;i++){
            for(var j = 1;j<=GRID_HEIGHT;j++){
                let model = this.cells[i][j];
                let copy = this.cellsCopy[i][j];
                let isModel = model.type == copy.type && model.status == copy.status;
                if (!isModel) {
                    this.curTime = ANITIME.DIE;
                    this.crushCell(j, i, false, 0);

                    this.curTime += ANITIME.SHOW;
                    // this.cells[i][j] = this.createCell(cc.v2(j, i), copy.status, copy.type);//原地出现
                    this.cells[i][j] = this.createCell(cc.v2(model.startX, model.startY), copy.status, copy.type);//从上面掉下来

                    this.curTime += ANITIME.TOUCH_MOVE;
                    this.cells[i][j].moveTo(cc.v2(copy.x, copy.y), this.curTime);
                }
            }
        }

        return [this.changeModels, this.effectsQueue];
    }

    // refreshSort(i, x, start) {
    //     let curClickCell = null;
    //     let lastClickCell = null;
    //     let lastPos = null;
    //     let pos = null;
    //     for(let j = start; j <= GRID_HEIGHT; j++) {
    //         lastPos = cc.v2(i, j);

    //         while (true) {
    //             let y = MATH_FLOOR(MATH_RONDOM() * (GRID_HEIGHT - j))+1;
    //             pos = cc.v2(x, y);
    //             this.exchangeCell(lastPos, pos);
    //             if (((this.checkPoint(i, j)[0]).length > 2 || (this.checkPoint(x, y)[0]).length > 2)) {
    //                 this.exchangeCell(lastPos, pos);
    //                 continue;
    //             }
    //             curClickCell = this.cells[pos.y][pos.x];
    //             lastClickCell = this.cells[lastPos.y][lastPos.x];
    //             break;
    //         }

    //         this.pushToChangeModels(curClickCell);
    //         this.pushToChangeModels(lastClickCell);

    //         curClickCell.moveTo(lastPos, this.curTime);
    //         lastClickCell.moveTo(pos, this.curTime);
    //     }
    // }
    refreshSort(i, x, start) {
        for(let j = start; j <= GRID_HEIGHT; j++) {
            let y = MATH_FLOOR(MATH_RONDOM() * (GRID_HEIGHT - j))+1;

            let lastPos = cc.v2(i, j);
            let pos = cc.v2(x, y);
            if (!this.isCell(lastPos) || !this.isCell(pos)) {
                // --j;
                continue;
            }

            let curClickCell = this.cells[pos.y][pos.x];
            let lastClickCell = this.cells[lastPos.y][lastPos.x];

            this.exchangeCell(lastPos, pos);
            if ((this.checkPoint(i, j)[0]).length > 0 || (this.checkPoint(x, y)[0]).length > 0) {
                this.exchangeCell(lastPos, pos);
                // return this.refreshSort(i, x, j);
            }
            else {
                this.pushToChangeModels(curClickCell);
                this.pushToChangeModels(lastClickCell);

                curClickCell.moveTo(lastPos, this.curTime);
                lastClickCell.moveTo(pos, this.curTime);
            }
        }
    }

    refresh() {
        this.changeModels = [];
        this.effectsQueue = [];
        this.curTime = ANITIME.TOUCH_MOVE;

        for(let i = 1; i <= GRID_WIDTH; i++) {
            let x = MATH_FLOOR(MATH_RONDOM() * (GRID_WIDTH - i))+1;
            this.refreshSort(i, x, 1);
        }

        return [this.changeModels, this.effectsQueue];
    }
    
    tips() {
        this.changeModels = [];
        this.effectsQueue = [];
        this.curTime = ANITIME.TIPS;

        for (let i = 1; i <= GRID_WIDTH; i++) {
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                let views = this.cells[i][j];
                let second = j+1;
                let third = j+2;
                if (this.cells[i][second] != null && this.cells[i][third] != null) {
                    let direction = [];
                    if (this.cells[i][second].type == views.type) {
                        direction = [cc.v2(0, 1), cc.v2(0, -1), cc.v2(1, 0)];
                    }
                    else if (this.cells[i][third].type == views.type) {
                        direction = [cc.v2(0, 1), cc.v2(0, -1)];
                    }
                
                    let pos = cc.v2(i, third);
                    for (const dir of direction) {
                        let lastPos = cc.v2(dir.x+pos.x, dir.y+pos.y);
                        if (lastPos.x < 1 || lastPos.x > GRID_HEIGHT
                        || lastPos.y < 1 || lastPos.y > GRID_WIDTH
                        || !this.cells[lastPos.y][lastPos.x]) {
                            continue;
                        }

                        this.exchangeCell(lastPos, pos);
                        let [result, newCellStatus, newCellType] = this.checkPoint(pos.x, pos.y);
                        this.exchangeCell(lastPos, pos); 
                        if (result.length < 3) {
                            continue;
                        }
                        for (var k in result) {
                            if (pos.x == result[k].x && pos.y == result[k].y) {
                                continue;
                            }
                            
                            if (dir.x == 0) {
                                if (dir.y > 0) {
                                    this.cells[result[k].y][result[k].x].toTipsUp(ANITIME.TIPS);
                                }
                                else if (dir.y < 0) {
                                    this.cells[result[k].y][result[k].x].toTipsDown(ANITIME.TIPS);
                                }
                            }
                            else {
                                if (lastPos.x > pos.x) {
                                    this.cells[result[k].y][result[k].x].toTipsRight(ANITIME.TIPS);
                                }
                                else {
                                    this.cells[result[k].y][result[k].x].toTipsLeft(ANITIME.TIPS);
                                }
                            }                            
                            this.pushToChangeModels(this.cells[result[k].y][result[k].x]);
                        }
                        
                        if (result.length >= 3) {
                            if (dir.x == 0) {
                                if (dir.y > 0) {
                                    this.cells[lastPos.y][lastPos.x].toTipsDown(ANITIME.TIPS);
                                }
                                else if (dir.y < 0) {
                                    this.cells[lastPos.y][lastPos.x].toTipsUp(ANITIME.TIPS);
                                }
                            }
                            else {
                                if (lastPos.x > pos.x) {
                                    this.cells[lastPos.y][lastPos.x].toTipsLeft(ANITIME.TIPS);
                                }
                                else {
                                    this.cells[lastPos.y][lastPos.x].toTipsRight(ANITIME.TIPS);
                                }
                            }
                            this.pushToChangeModels(this.cells[lastPos.y][lastPos.x]);
                            return [this.changeModels, this.effectsQueue];
                        }
                    }
                }

                second = i+1;
                third = i+2;
                if (this.cells[second] != null && this.cells[third] != null) {
                    let direction = [];
                    if (this.cells[second][j].type == views.type) {
                        direction = [cc.v2(-1, 0), cc.v2(1, 0), cc.v2(0, 1)];
                    }
                    else if (this.cells[third][j].type == views.type) {
                        direction = [cc.v2(-1, 0), cc.v2(1, 0)];
                    }
                
                    let pos = cc.v2(third, j);
                    for (const dir of direction) {
                        let lastPos = cc.v2(dir.x+pos.x, dir.y+pos.y);
                        if (lastPos.x < 1 || lastPos.x > GRID_HEIGHT
                        || lastPos.y < 1 || lastPos.y > GRID_WIDTH
                        || !this.cells[lastPos.y][lastPos.x]) {
                            continue;
                        }

                        this.exchangeCell(lastPos, pos);
                        var [result, newCellStatus, newCellType] = this.checkPoint(pos.x, pos.y);
                        this.exchangeCell(lastPos, pos); 
                        if (result.length < 3) {
                            continue;
                        }

                        for (var k in result) {
                            if (pos.x == result[k].x && pos.y == result[k].y) {
                                continue;
                            }
                            
                            if (dir.y == 0) {
                                if (dir.x > 0) {
                                    this.cells[result[k].y][result[k].x].toTipsRight(ANITIME.TIPS);
                                }
                                else if (dir.x < 0) {
                                    this.cells[result[k].y][result[k].x].toTipsLeft(ANITIME.TIPS);
                                }
                            }
                            else {
                                if (lastPos.y > pos.y) {
                                    this.cells[result[k].y][result[k].x].toTipsUp(ANITIME.TIPS);
                                }
                                else {
                                    this.cells[result[k].y][result[k].x].toTipsDown(ANITIME.TIPS);
                                }
                            }                            
                            this.pushToChangeModels(this.cells[result[k].y][result[k].x]);
                        }
                        
                        if (result.length >= 3) {
                            if (dir.y == 0) {
                                if (dir.x > 0) {
                                    this.cells[lastPos.y][lastPos.x].toTipsLeft(ANITIME.TIPS);
                                }
                                else if (dir.x < 0) {
                                    this.cells[lastPos.y][lastPos.x].toTipsRight(ANITIME.TIPS);
                                }
                            }
                            else {
                                if (lastPos.y > pos.y) {
                                    this.cells[lastPos.y][lastPos.x].toTipsDown(ANITIME.TIPS);
                                }
                                else {
                                    this.cells[lastPos.y][lastPos.x].toTipsUp(ANITIME.TIPS);
                                }
                            }
                            this.pushToChangeModels(this.cells[lastPos.y][lastPos.x]);
                            return [this.changeModels, this.effectsQueue];
                        }
                    }
                }
            }
        }
        
        return [this.changeModels, this.effectsQueue];
    }

    isCell(pos) {
        cc.log("555555555555555", pos.y, pos.x);
        if (!this.cells[pos.y]) {
            return true;
        }

        let cell = this.cells[pos.y][pos.x];
        if (!cell) {
            return true;
        }

        let isNoCell = (cell.status == CELL_STATUS.STATIC || cell.status == CELL_STATUS.ICE);
        return !isNoCell;
    }
}

