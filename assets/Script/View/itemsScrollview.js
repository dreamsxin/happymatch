// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        refreshLabel:cc.Label,
        backLabel:cc.Label,
        changeLabel:cc.Label,
        lineLabel:cc.Label,
        columnLabel:cc.Label,
        hammerLabel:cc.Label,
        magicLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.refreshLabel.string = window.INIT_GAME_SAVE_DATA.items_refresh;
        this.backLabel.string = window.INIT_GAME_SAVE_DATA.items_back;
        this.changeLabel.string = window.INIT_GAME_SAVE_DATA.items_change;
        this.lineLabel.string = window.INIT_GAME_SAVE_DATA.items_line;
        this.columnLabel.string = window.INIT_GAME_SAVE_DATA.items_column;
        this.hammerLabel.string = window.INIT_GAME_SAVE_DATA.items_hammer;
        this.magicLabel.string = window.INIT_GAME_SAVE_DATA.items_magic;

        this.itemsSwitch = [];
    },
    defineParams(event, name) {
        let isSwitch = "is" + name;
        if (this["on" + name] == null) {
            this.itemsSwitch.push(isSwitch);

            this[isSwitch] = null;
            this["set" + name] = function(value) {
                this[name.toLowerCase() + "Label"].string = value > 0 ?  value : '+';
            };
            this["get" + name] = function() {
                let str = this[name.toLowerCase() + "Label"].string;
                return isNaN(str) ? 0 : Number(str);
            };
            this["on" + name] = function() {
                if (this["get" + name]() > 0) {
                    this[isSwitch] = true;
                }
                else {
                    cc.log("跳到道具购买界面");
                }
            };
        }
         
        for (const data of this.itemsSwitch) {
            if (data == isSwitch) {
                continue;
            }
            this[data] = false;
        }

        this["on" + name]();
    },
    // setRefresh(value) {
    //     this.refreshLabel.string = value;
    // },
    // getRefresh() {
    //     return this.refreshLabel.string;
    // },
    // setBack(value) {
    //     this.backLabel.string = value;
    // },
    // getBack(){
    //     return this.backLabel.string;
    // },
    // setChange(value) {
    //     this.changeLabel.string = value;
    // },
    // getLine(){
    //     return this.lineLabel.string;
    // },
    // setLine(value) {
    //     this.lineLabel.string = value;
    // },
    // getColumn(){
    //     return this.columnLabel.string;
    // },
    // setColumn(value) {
    //     this.columnLabel.string = value;
    // },
    // getChange() {
    //     return this.changeLabel.string;
    // },
    // setHammer(){
    //     this.hammerLabel.string = value;
    // },
    // getHammer() {
    //     return this.hammerLabel.string;
    // },
    // setMagic(value){
    //     this.magicLabel.string = value;
    // },
    // getMagix() {
    //     return this.magicLabel.string;
    // },
    
    // onRefresh() {
        
    // },
    // onHammer() {
    //     if (this.getRefresh() > 0) {
    //         this.isHammer = true;
    //     }
    //     else {
    //         cc.log("跳到道具购买锤子界面");
    //     }
    // },
    
    // update (dt) {},
});
