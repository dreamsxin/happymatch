
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Controller/GameController.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '5ac64Iq16lBqrHZ0246FRcZ', 'GameController');
// Script/Controller/GameController.js

"use strict";

var _GameModel = _interopRequireDefault(require("../Model/GameModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
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
    grid: {
      "default": null,
      type: cc.Node
    }
  },
  // use this for initialization
  onLoad: function onLoad() {
    this.gameModel = new _GameModel["default"]();
    this.gameModel.init(4);
    var gridScript = this.grid.getComponent("GridView");
    gridScript.setController(this);
    gridScript.initWithCellModels(this.gameModel.getCells());
  },
  selectCell: function selectCell(pos) {
    return this.gameModel.selectCell(pos);
  },
  cleanCmd: function cleanCmd() {
    this.gameModel.cleanCmd();
  } // called every frame, uncomment this function to activate update callback
  // update: function (dt) {
  // }, 

});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQ29udHJvbGxlci9HYW1lQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImdyaWQiLCJ0eXBlIiwiTm9kZSIsIm9uTG9hZCIsImdhbWVNb2RlbCIsIkdhbWVNb2RlbCIsImluaXQiLCJncmlkU2NyaXB0IiwiZ2V0Q29tcG9uZW50Iiwic2V0Q29udHJvbGxlciIsImluaXRXaXRoQ2VsbE1vZGVscyIsImdldENlbGxzIiwic2VsZWN0Q2VsbCIsInBvcyIsImNsZWFuQ21kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLElBQUksRUFBQztBQUNELGlCQUFTLElBRFI7QUFFREMsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNO0FBRlI7QUFYRyxHQUhQO0FBb0JMO0FBQ0FDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQixTQUFLQyxTQUFMLEdBQWlCLElBQUlDLHFCQUFKLEVBQWpCO0FBQ0EsU0FBS0QsU0FBTCxDQUFlRSxJQUFmLENBQW9CLENBQXBCO0FBQ0EsUUFBSUMsVUFBVSxHQUFHLEtBQUtQLElBQUwsQ0FBVVEsWUFBVixDQUF1QixVQUF2QixDQUFqQjtBQUNBRCxJQUFBQSxVQUFVLENBQUNFLGFBQVgsQ0FBeUIsSUFBekI7QUFDQUYsSUFBQUEsVUFBVSxDQUFDRyxrQkFBWCxDQUE4QixLQUFLTixTQUFMLENBQWVPLFFBQWYsRUFBOUI7QUFDSCxHQTNCSTtBQTZCTEMsRUFBQUEsVUFBVSxFQUFFLG9CQUFTQyxHQUFULEVBQWE7QUFDckIsV0FBTyxLQUFLVCxTQUFMLENBQWVRLFVBQWYsQ0FBMEJDLEdBQTFCLENBQVA7QUFDSCxHQS9CSTtBQWdDTEMsRUFBQUEsUUFBUSxFQUFFLG9CQUFVO0FBQ2hCLFNBQUtWLFNBQUwsQ0FBZVUsUUFBZjtBQUNILEdBbENJLENBcUNMO0FBQ0E7QUFFQTs7QUF4Q0ssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWVNb2RlbCBmcm9tIFwiLi4vTW9kZWwvR2FtZU1vZGVsXCI7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGdyaWQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKCk7XG4gICAgICAgIHRoaXMuZ2FtZU1vZGVsLmluaXQoNCk7XG4gICAgICAgIHZhciBncmlkU2NyaXB0ID0gdGhpcy5ncmlkLmdldENvbXBvbmVudChcIkdyaWRWaWV3XCIpO1xuICAgICAgICBncmlkU2NyaXB0LnNldENvbnRyb2xsZXIodGhpcyk7XG4gICAgICAgIGdyaWRTY3JpcHQuaW5pdFdpdGhDZWxsTW9kZWxzKHRoaXMuZ2FtZU1vZGVsLmdldENlbGxzKCkpO1xuICAgIH0sXG5cbiAgICBzZWxlY3RDZWxsOiBmdW5jdGlvbihwb3Mpe1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lTW9kZWwuc2VsZWN0Q2VsbChwb3MpO1xuICAgIH0sXG4gICAgY2xlYW5DbWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuZ2FtZU1vZGVsLmNsZWFuQ21kKCk7XG4gICAgfVxuXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LCBcbn0pO1xuIl19