import {CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME, GRID_WIDTH, GRID_HEIGHT, CELL_STATUS} from '../Model/ConstValue';

import AudioUtils from "../Utils/AudioUtils";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        aniPre: {
            default: [],
            type: [cc.Prefab]
        },
        effectLayer: {
            default: null,
            type: cc.Node
        },
        audioUtils:{
            type: AudioUtils,
            default: null
        },
        itemsScrollview:cc.ScrollView,
        scoreLabel:cc.Label,
        stepsLabel:cc.Label
    },


    // use this for initialization
    onLoad: function () {
        this.setListener();
        this.lastTouchPos = cc.Vec2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false; // 是否在播放中
        this.itemsScrollview = this.itemsScrollview.getComponent("itemsScrollview");
        this.itemsScrollview.setGridView(this);
        this.stepsLabel.string = window.INIT_GAME_SAVE_DATA.steps;

        this.node.getChildByName("bg").zIndex = -2;
        this.effectLayer = this.effectLayer.getComponent("EffectLayer");
        window.gridView = this;
    },
    setController: function(controller){
        this.gameModel = controller;
    },
    setGameModel(gameModel){
        this.gameModel = gameModel;
    },

    initWithCellModels: function(cellsModels){
        this.cellViews = [];

        for(var i = 1;i<=GRID_WIDTH;i++){
            this.cellViews[i] = [];
            for(var j = 1;j<=GRID_HEIGHT;j++){
                var type = cellsModels[i][j].type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                aniView.type = type;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(cellsModels[i][j]);
                this.cellViews[i][j] = aniView;
            }
        }

        this.tips();
    },
    setListener: function(){
        this.node.on(cc.Node.EventType.TOUCH_START, function(eventTouch){
            if(this.isInPlayAni || this.itemsScrollview.isMagic){//播放动画中，不允许点击
                return true;
            }

            this.gameModel.setCellsCopy();
            // this.cellViewsCopy = cc.instantiate(this.cellViews);//JSON.parse(JSON.stringify(this.cellViews));

            this.tips();

            var touchPos = eventTouch.getLocation();
            var cellPos = this.convertTouchPosToCell(touchPos);
            if(cellPos){
                if (this.itemsScrollview.isChange) {
                    this.isCanMove = false;
                    this.changeSelectCell(cellPos);
                }
                else {
                    var changeModels = this.selectCell(cellPos);
                    this.isCanMove = changeModels.length < 3;
                }
            }
            else{
                this.isCanMove = false;
            }

           return true;
        }, this);
        // 滑动操作逻辑
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(eventTouch){
            if(this.isInPlayAni){//播放动画中，不允许点击
                return true;
            }

            if (this.itemsScrollview.isMagic) {
                this.stopTipsActions();

                var startTouchPos = eventTouch.getStartLocation ();
                var startCellPos = this.convertTouchPosToCell(startTouchPos);
                var touchPos = eventTouch.getLocation();
                var cellPos = this.convertTouchPosToCell(touchPos);
                if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
                    let cellView = this.gameModel.getCells()[startCellPos.y][startCellPos.x];
                    if (cellView.getStatus() == CELL_STATUS.COMMON) {
                        this.itemsScrollview.isMagic =  false;
                        this.itemsScrollview.setMagic(this.itemsScrollview.getMagic()-1);
                        
                        let status = startCellPos.x == cellPos.x ? CELL_STATUS.COLUMN : CELL_STATUS.LINE;
                        cellView.setStatus(status);
                        this.cellViews[startCellPos.y][startCellPos.x].getComponent(cc.Animation).play(status);

                        this.disableTouch(0.2);
                    }
                }
            }
            else if(this.isCanMove) {
                this.stopTipsActions();

                var startTouchPos = eventTouch.getStartLocation ();
                var startCellPos = this.convertTouchPosToCell(startTouchPos);
                var touchPos = eventTouch.getLocation();
                var cellPos = this.convertTouchPosToCell(touchPos);
                if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
                    this.isCanMove = false;
                    if (this.itemsScrollview.isForce) {
                        this.forceSelectCell(cellPos);
                    }
                    else {
                        this.selectCell(cellPos);
                    }
                }
           }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(eventTouch){
          // console.log("1111");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(eventTouch){
          // console.log("1111");
        }, this);
    },
    // 根据点击的像素位置，转换成网格中的位置
    convertTouchPosToCell: function(pos){
        pos = this.node.convertToNodeSpace(pos);
        if(pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT){
            return false;
        }
        var x = Math.floor(pos.x / CELL_WIDTH) + 1;
        var y = Math.floor(pos.y / CELL_HEIGHT) + 1;
        return cc.v2(x, y);
    },
    // 移动格子
    updateView: function(changeModels){
        let newCellViewInfo = [];
        for(var i in changeModels){
            var model = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view = null;
            // 如果原来的cell不存在，则新建
            if(!viewInfo){
                var type = model.type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                aniView.type = type;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
                view = aniView;
            }
            // 如果已经存在
            else{
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            var cellScript = view.getComponent("CellView");
            cellScript.updateView();// 执行移动动作
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            } 
        }
        // 重新标记this.cellviews的信息
        newCellViewInfo.forEach(function(ele){
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        },this);
    },
    // 显示选中的格子背景
    updateSelect: function(pos){
         for(var i = 1;i <=GRID_WIDTH ;i++){
            for(var j = 1 ;j <=GRID_HEIGHT ;j ++){
                if(this.cellViews[i][j]){
                    var cellScript = this.cellViews[i][j].getComponent("CellView");
                    if(pos.x == j && pos.y ==i){
                        cellScript.setSelect(true);
                    }
                    else{
                        cellScript.setSelect(false);
                    }

                }
            }
        }
        
    },
    /**
     * 根据cell的model返回对应的view
     */
    findViewByModel: function(model){
        for(var i = 1;i <=GRID_WIDTH ;i++){
            for(var j = 1 ;j <=GRID_HEIGHT ;j ++){
                if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){
                    return {view:this.cellViews[i][j],x:j, y:i};
                }
            }
        }
        return null;
    },
    getPlayAniTime: function(changeModels){
        if(!changeModels){
            return 0;
        }
        var maxTime = 0;
        changeModels.forEach(function(ele){
            ele.cmd.forEach(function(cmd){
                if(maxTime < cmd.playTime + cmd.keepTime){
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            },this)
        },this);
        return maxTime;
    },
    // 获得爆炸次数， 同一个时间算一个
    getStep: function(effectsQueue){
        if(!effectsQueue){
            return 0;
        }
        return effectsQueue.reduce(function(maxValue, efffectCmd){
            return Math.max(maxValue, efffectCmd.step || 0);
        }, 0);
    },
    tips() {
        this.stopTipsActions();

        this.node.runAction(cc.sequence(cc.delayTime(5),cc.callFunc(function(){
            var result = this.gameModel.tips();
            this.updateView(result[0]);
            this.gameModel.cleanCmd();
        }, this))).setTag(ANITIME.TIPS_ACTION_TAG);
    },
    stopTipsActions: function(){
        this.node.stopActionByTag(ANITIME.TIPS_ACTION_TAG);
        for(var i = 1;i <=GRID_WIDTH ;i++){
            for(var j = 1 ;j <=GRID_HEIGHT ;j ++){
                this.cellViews[i][j].stopActionByTag(ANITIME.TIPS_ACTION_TAG); 
            }
        }
    },
    //一段时间内禁止操作
    disableTouch: function(time, step){
        if(time <= 0){
            return ;
        }
        this.isInPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
            this.isInPlayAni = false;
            if (step) {
                this.audioUtils.playContinuousMatch(step);
            }

            this.tips();

            this.gameModel.cleanCmd();
        }, this)));
    },
    // 正常击中格子后的操作
    selectCell: function(cellPos) {
        var result = [[], []];
        if (this.itemsScrollview.isHammer) {
            result = this.gameModel.hammerSelectCell(cellPos);  
        }
        else if (this.itemsScrollview.isLine) {
            result = this.gameModel.rocketSelectCell(cellPos, CELL_STATUS.LINE);
        }
        else if (this.itemsScrollview.isColumn) {
            result = this.gameModel.rocketSelectCell(cellPos, CELL_STATUS.COLUMN);
        }
        else {
            result = this.gameModel.selectCell(cellPos); // 直接先丢给model处理数据逻辑
        }
         
        var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        var effectsQueue = result[1]; //各种特效
        this.playDragonBones(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.gameModel.cleanCmd(); 
        if(changeModels.length >= 2){
            this.updateSelect(cc.v2(-1,-1));
            this.audioUtils.playSwap();
        }
        else{
            this.updateSelect(cellPos);
            this.audioUtils.playClick();
        }

        if (this.itemsScrollview.isHammer) {
            this.itemsScrollview.isHammer = false;
            this.itemsScrollview.setHammer(this.itemsScrollview.getHammer()-1);
        }
        else if (this.itemsScrollview.isLine) {
            this.itemsScrollview.isLine = false;
            this.itemsScrollview.setLine(this.itemsScrollview.getLine()-1);
        }
        else if (this.itemsScrollview.isColumn) {
            this.itemsScrollview.isColumn= false;
            this.itemsScrollview.setColumn(this.itemsScrollview.getColumn()-1);
        }
    
        return changeModels;
    },
    changeSelectCell: function(cellPos) {
        var result = this.gameModel.changeSelectCell(cellPos);
         
        var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        var effectsQueue = result[1]; //各种特效
        this.playDragonBones(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.gameModel.cleanCmd(); 
        if(changeModels.length >= 2){
            this.updateSelect(cc.v2(-1,-1));
            this.audioUtils.playSwap();
        }
        else {
            this.updateSelect(cellPos);
            this.audioUtils.playClick();
        }

        if (changeModels.length > 0) {
            this.itemsScrollview.isChange = false;
            this.itemsScrollview.setChange(this.itemsScrollview.getChange()-1);
        }

        return changeModels;
    },
    forceSelectCell: function(cellPos) {
        var result = this.gameModel.forceSelectCell(cellPos);
         
        var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        var effectsQueue = result[1]; //各种特效
        this.playDragonBones(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.gameModel.cleanCmd(); 
        if(changeModels.length >= 2){
            this.updateSelect(cc.v2(-1,-1));
            this.audioUtils.playSwap();
        }
        else {
            this.updateSelect(cellPos);
            this.audioUtils.playClick();
        }

        this.itemsScrollview.isForce = false;
        this.itemsScrollview.setForce(this.itemsScrollview.getForce()-1);

        return changeModels;
    },
    playEffect: function(effectsQueue){
        this.effectLayer.playEffects(effectsQueue);
    },
    playDragonBones: function(effectsQueue){
        this.effectLayer.playDragonBones(effectsQueue);
    },
    selectBack() {
        let result = this.gameModel.selectBack();
        var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        if (changeModels.length <= 0) {
            return false;
        }

        var effectsQueue = result[1]; //各种特效
        this.playDragonBones(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.gameModel.cleanCmd();
        this.updateSelect(cc.v2(-1,-1));

        return true;
    },
    selectRefresh() {
        let result = this.gameModel.refresh();
        var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        if (changeModels.length <= 0) {
            return false;
        }

        var effectsQueue = result[1]; //各种特效
        this.playDragonBones(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.gameModel.cleanCmd();
        this.updateSelect(cc.v2(-1,-1));

        return true;
    },
    getInPlayAni() {
        return this.isInPlayAni;
    },
    updateSteps(){
        this.addSteps += 1;
        this.stepsLabel.string = Number(this.stepsLabel.string) + this.addSteps;
        if (this.addSteps >= window.INIT_GAME_SAVE_DATA.steps) {
            this.unschedule(this.updateSteps);
            this.disableTouch(0.1);
        }
    },
    setAddSteps() {
        this.addSteps = 0;
        this.schedule(this.updateSteps, 0.2);
    },
    selectSteps() {
        if (this.stepsLabel.string < window.ITEMS_ADD_STEPS_CONDITION) {    
            this.gameModel.effectsQueue = [];
            this.gameModel.addSteps(cc.v2(486.39, 713.858), this);
            this.playEffect(this.gameModel.effectsQueue);
            this.isInPlayAni = true;
            this.updateSelect(cc.v2(-1,-1)); }
        else {
            cc.log("当前步数不低于6");
        }
    }
});
