import {CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME} from '../Model/ConstValue';

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
        defaultFrame:{
            default: null,
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
        //this.model = null;
        this.isSelect = false;
    },
    initWithModel: function(model){
        this.model = model;
        var x = model.startX;
        var y = model.startY;
        this.node.x = CELL_WIDTH * (x - 0.5);
        this.node.y = CELL_HEIGHT * (y - 0.5);
        var animation  = this.node.getComponent(cc.Animation);
        if (animation) {
            if (model.status == CELL_STATUS.COMMON){
                animation.stop();
            } 
            else{
                animation.play(model.status);
            }
        }
    },
    // 执行移动动作
    updateView: function(){
        var cmd = this.model.cmd;
        if(cmd.length <= 0){
            return ;
        }

        this.node.stopActionByTag(ANITIME.TIPS_ACTION_TAG);
    
        var actionArray = [];
        var curTime = 0;
        for(var i in cmd){
            if( cmd[i].playTime > curTime){
                var delay = cc.delayTime(cmd[i].playTime - curTime);
                actionArray.push(delay);
            }
            if(cmd[i].action == "moveTo"){
                var x = (cmd[i].pos.x - 0.5) * CELL_WIDTH;
                var y = (cmd[i].pos.y - 0.5) * CELL_HEIGHT;
                var move = cc.moveTo(ANITIME.TOUCH_MOVE, cc.v2(x,y));
                actionArray.push(move);
            }
            else if(cmd[i].action == "toDie"){
                // if(this.status == CELL_STATUS.BIRD){
                //     let animation = this.node.getComponent(cc.Animation);
                //     animation.play("effect");
                //     actionArray.push(cc.delayTime(ANITIME.BOMB_BIRD_DELAY));
                // }
                var callFunc = cc.callFunc(function(){
                    this.node.destroy();
                },this);
                actionArray.push(callFunc);
            }
            else if(cmd[i].action == "setVisible"){
                let isVisible = cmd[i].isVisible;
                actionArray.push(cc.callFunc(function(){
                    if(isVisible){
                        this.node.opacity = 255;
                    }
                    else{
                        this.node.opacity = 0;
                    }
                },this));
            }
            else if(cmd[i].action == "toShake"){
                let rotateRight = cc.rotateBy(0.06,30);
                let rotateLeft = cc.rotateBy(0.12, -60);
                actionArray.push(cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2));
            }
            else if (cmd[i].action == "toTipsLeft") {
                this.toTipsLeft(cmd[i].playTime);
            }
            else if (cmd[i].action == "toTipsRight") {
                this.toTipsRight(cmd[i].playTime);
            }
            else if (cmd[i].action == "toTipsUp") {
                this.toTipsUp(cmd[i].playTime);
            }
            else if (cmd[i].action == "toTipsDown") {
                this.toTipsDown(cmd[i].playTime);
            }
            else if (cmd[i].action == "toWrapCenter") {
                let sequence = cc.sequence(cc.scaleTo(ANITIME.WARAP_TOTAL, 0), cc.callFunc(function(){
                    this.node.destroy();
                },this));
                actionArray.push(sequence);
            }
            else if (cmd[i].action == "toWrapInside") {
                // 距离中心的一格的图标：0.1s开始远离中心图标，在0.3s位移20像素，然后0.4s开始缩小，0.7s缩小到0
                let vCenter = cc.v2((cmd[i].vCenter.x - 0.5) * CELL_WIDTH, (cmd[i].vCenter.y - 0.5) * CELL_HEIGHT);
                let vDir = cc.v2(this.node.x-vCenter.x, this.node.y-vCenter.y);
                vDir = vDir.normalize().mul(20);
                // vDir = vDir.add(cc.v2(this.node.x, this.node.y));
                let sequence = cc.sequence(cc.delayTime(0.1), cc.moveBy(0.3, vDir), cc.delayTime(0.1)
                , cc.scaleTo(0.3, 0), cc.callFunc(function(){
                        this.node.destroy();
                },this));
                actionArray.push(sequence);
            }
            else if (cmd[i].action == "toWrapOutside") {
                //距离中心的二格的图标：0.2s开始远离中心图标，在0.4s位移60像素，然后0.4s开始缩小，0.7s缩小到0
                let vCenter = cc.v2((cmd[i].vCenter.x - 0.5) * CELL_WIDTH, (cmd[i].vCenter.y - 0.5) * CELL_HEIGHT);
                let vDir = cc.v2(this.node.x-vCenter.x, this.node.y-vCenter.y);
                vDir = vDir.normalize().mul(60);
                // vDir = vDir.add(cc.v2(this.node.x, this.node.y));
                let sequence = cc.sequence(cc.delayTime(0.2), cc.moveBy(0.4, vDir), cc.delayTime(0.1)
                , cc.scaleTo(0.3, 0), cc.callFunc(function(){
                        this.node.destroy();
                },this));
                actionArray.push(sequence);
            }
            else if (cmd[i].action == "toAttract") {
                let startTime = 0.4;
                let sequence = cc.sequence(cc.delayTime(startTime), cc.callFunc(function(){
                    this.vCenter = cc.v2((cmd[i].vCenter.x - 0.5) * CELL_WIDTH, (cmd[i].vCenter.y - 0.5) * CELL_HEIGHT);
                    this.vDir = cc.v2(this.node.x-cmd[i].vCenter.x, this.node.y-cmd[i].vCenter.y);
                    this.attractRadius = this.vDir.mag();
                    this.attractRotate = 0;
                    //总时间减去 动画前后空白的时间
                    this.attractSpeed = this.attractRadius/(ANITIME.BOMB_BIRD_DELAY-startTime-(ANITIME.BOMB_BIRD_DELAY-3.5)-0.4);
                    this.attractSpeed1 = 0;
                    this.schedule(this.updateRotate, 0);
                    this.node.runAction(cc.repeatForever(cc.rotateBy(1, -360)));
                    this.node.zIndex = 10000;
                },this));
                actionArray.push(sequence);
            }
            else {
                cc.log("666666666", cmd[i].action);
            }

            curTime = cmd[i].playTime + cmd[i].keepTime;
        }
        /**
         * 智障的引擎设计，一群SB
         */
        if(actionArray.length == 1){
            this.node.runAction(actionArray[0]);
        }
        else{
            this.node.runAction(cc.sequence(...actionArray));
        }

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    setSelect: function(flag){
        var bg = this.node.getChildByName("select");
        if (!bg) {
            return;
        }

        var animation = this.node.getComponent(cc.Animation);
        if(flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON){
            animation.stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame;
        }
        else if(flag && this.model.status == CELL_STATUS.COMMON){
            animation.play(CELL_STATUS.CLICK);
        }
        else if(flag && this.model.status == CELL_STATUS.BIRD){
            animation.play(CELL_STATUS.CLICK);
        }
        bg.active = flag; 
        this.isSelect = flag;
    },

    toTipsLeft(playTime) {
        var move = cc.moveTo(playTime, cc.v2(this.node.x-0.05*CELL_WIDTH, this.node.y));
        var repeat = cc.moveTo(0, cc.v2(this.node.x, this.node.y));
        let sequence = cc.sequence(cc.repeat(cc.sequence(move, repeat), 2), cc.delayTime(2));
        this.node.runAction(cc.repeatForever(sequence)).setTag(ANITIME.TIPS_ACTION_TAG);
    },
    toTipsRight(playTime) {
        var move = cc.moveTo(playTime, cc.v2(this.node.x+0.05*CELL_WIDTH, this.node.y));
        var repeat = cc.moveTo(0, cc.v2(this.node.x, this.node.y));
        let sequence = cc.sequence(cc.repeat(cc.sequence(move, repeat), 2), cc.delayTime(2));
        this.node.runAction(cc.repeatForever(sequence)).setTag(ANITIME.TIPS_ACTION_TAG);
    },
    toTipsUp(playTime) {
        var move = cc.moveTo(playTime, cc.v2(this.node.x, this.node.y+0.05*CELL_HEIGHT));
        var repeat = cc.moveTo(0, cc.v2(this.node.x, this.node.y));
        let sequence = cc.sequence(cc.repeat(cc.sequence(move, repeat), 2), cc.delayTime(2));
        this.node.runAction(cc.repeatForever(sequence)).setTag(ANITIME.TIPS_ACTION_TAG);
    },
    toTipsDown(playTime) {
        var move = cc.moveTo(playTime, cc.v2(this.node.x, this.node.y-0.05*CELL_HEIGHT));
        var repeat = cc.moveTo(0, cc.v2(this.node.x, this.node.y));
        let sequence = cc.sequence(cc.repeat(cc.sequence(move, repeat), 2), cc.delayTime(2));
        this.node.runAction(cc.repeatForever(sequence)).setTag(ANITIME.TIPS_ACTION_TAG);
    },
    updateRotate(delta) {
        this.node.x = this.vCenter.x + Math.cos(this.vDir.angle(cc.v2(1, 0)))*this.attractRadius;
        this.node.y = this.vCenter.y + Math.sin(this.vDir.angle(cc.v2(1, 0)))*this.attractRadius;
        this.vDir = this.vDir.rotate(-this.attractRotate);
        if (Math.abs(this.node.x-this.vCenter.x) < 10 && Math.abs(this.node.y-this.vCenter.y) < 10) {
            this.unschedule(this.updateRotate);
            this.node.destroy();
        }
        this.attractRadius -= delta*this.attractSpeed;
        this.attractRotate += delta*this.attractSpeed;
    }
});
