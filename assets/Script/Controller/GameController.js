import GameModel from "../Model/GameModel";

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
        this.gameModel.init(4);
        var gridScript = this.grid.getComponent("GridView");
        gridScript.setController(this);
        gridScript.setGameModel(this.gameModel);
        gridScript.initWithCellModels(this.gameModel.getCells());
    }
});
