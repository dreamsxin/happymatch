import GameModel from "../Model/GameModel";
import http from "../Utils/http";

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
        grid:{
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.gameModel = new GameModel();
        // this.gameModel.init(6);
        // var gridScript = this.grid.getComponent("GridView");
        // gridScript.setController(this);
        // gridScript.setGameModel(this.gameModel);
        // gridScript.initWithCellModels(this.gameModel.getCells());
    },
    start() {
        http.httpPost(window.MAP_URL+"/api/map/getMapByLevel", {level:1}, function(respone , object){
            if (respone.status != 0) {
                cc.log("服务器请求 地图 失败");
                return;
            }

            object.gameModel.initServerCells(6, respone.content.cubes);
            object.createGridViewWithServer(respone.content.bgImage);
        }, null, this);
    },
    createGridViewWithServer(bgImage) {
        this.gridScript = this.grid.getComponent("GridView");
        this.gridScript.setController(this);
        this.gridScript.setGameModel(this.gameModel);
        this.gridScript.setServerBgImage(bgImage); 

        if (!this.arrImage) {
            http.httpPost(window.MAP_URL+"/api/config/getConfig", {key:"cube_bg_images"}, function(respone , object){
                if (respone.status != 0) {
                    cc.log("服务器请求 地图配置 失败");
                    return;
                }

                let arrAnimal = JSON.parse(respone.content);
                object.arrImage = [];
                for (const data of arrAnimal) {
                    object.arrImage[data.code] = data.image;
                }
                object.gridScript.initWithCellModelsWithServer(object.gameModel.getCells(), object.arrImage);
                
            }, null, this);
        }
        else {
            gridScript.initWithCellModelsWithServer(this.gameModel.getCells(), this.arrImage);
        }
    }
});
