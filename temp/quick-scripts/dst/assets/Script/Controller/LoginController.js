
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Controller/LoginController.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '5f4845Bus5AQoZakK7KAXht', 'LoginController');
// Script/Controller/LoginController.js

"use strict";

var _AudioUtils = _interopRequireDefault(require("../Utils/AudioUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    loadingBar: {
      type: cc.ProgressBar,
      "default": null
    },
    loginButton: {
      type: cc.Button,
      "default": null
    },
    worldSceneBGM: {
      type: cc.AudioClip,
      "default": null
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
  },
  start: function start() {},
  onLogin: function onLogin() {
    this.loadingBar.node.active = true;
    this.loginButton.node.active = false;
    this.loadingBar.progress = 0;
    var backup = cc.loader.onProgress;

    cc.loader.onProgress = function (count, amount) {
      this.loadingBar.progress = count / amount;
    }.bind(this);

    cc.director.preloadScene("Game", function () {
      cc.loader.onProgress = backup;
      this.loadingBar.node.active = false;
      this.loginButton.node.active = true;
      cc.director.loadScene("Game");
    }.bind(this));
  },
  onDestroy: function onDestroy() {
    cc.audioEngine.stop(this.gameSceneBGMAudioId);
  } // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQ29udHJvbGxlci9Mb2dpbkNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsb2FkaW5nQmFyIiwidHlwZSIsIlByb2dyZXNzQmFyIiwibG9naW5CdXR0b24iLCJCdXR0b24iLCJ3b3JsZFNjZW5lQkdNIiwiQXVkaW9DbGlwIiwib25Mb2FkIiwiZ2FtZVNjZW5lQkdNQXVkaW9JZCIsImF1ZGlvRW5naW5lIiwicGxheSIsInN0YXJ0Iiwib25Mb2dpbiIsIm5vZGUiLCJhY3RpdmUiLCJwcm9ncmVzcyIsImJhY2t1cCIsImxvYWRlciIsIm9uUHJvZ3Jlc3MiLCJjb3VudCIsImFtb3VudCIsImJpbmQiLCJkaXJlY3RvciIsInByZWxvYWRTY2VuZSIsImxvYWRTY2VuZSIsIm9uRGVzdHJveSIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUE7Ozs7QUFWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLFVBQVUsRUFBRTtBQUNSQyxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ00sV0FERDtBQUVSLGlCQUFTO0FBRkQsS0FoQko7QUFvQlJDLElBQUFBLFdBQVcsRUFBRTtBQUNURixNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ1EsTUFEQTtBQUVULGlCQUFTO0FBRkEsS0FwQkw7QUF3QlJDLElBQUFBLGFBQWEsRUFBQztBQUNWSixNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ1UsU0FEQztBQUVWLGlCQUFTO0FBRkM7QUF4Qk4sR0FIUDtBQWlDTDtBQUVBQyxFQUFBQSxNQW5DSyxvQkFtQ0s7QUFDTixTQUFLQyxtQkFBTCxHQUEyQlosRUFBRSxDQUFDYSxXQUFILENBQWVDLElBQWYsQ0FBb0IsS0FBS0wsYUFBekIsRUFBd0MsSUFBeEMsRUFBOEMsQ0FBOUMsQ0FBM0I7QUFDSCxHQXJDSTtBQXVDTE0sRUFBQUEsS0F2Q0ssbUJBdUNJLENBRVIsQ0F6Q0k7QUEyQ0xDLEVBQUFBLE9BQU8sRUFBRSxtQkFBVTtBQUNmLFNBQUtaLFVBQUwsQ0FBZ0JhLElBQWhCLENBQXFCQyxNQUFyQixHQUE4QixJQUE5QjtBQUNBLFNBQUtYLFdBQUwsQ0FBaUJVLElBQWpCLENBQXNCQyxNQUF0QixHQUErQixLQUEvQjtBQUNBLFNBQUtkLFVBQUwsQ0FBZ0JlLFFBQWhCLEdBQTJCLENBQTNCO0FBQ0EsUUFBSUMsTUFBTSxHQUFHcEIsRUFBRSxDQUFDcUIsTUFBSCxDQUFVQyxVQUF2Qjs7QUFDQXRCLElBQUFBLEVBQUUsQ0FBQ3FCLE1BQUgsQ0FBVUMsVUFBVixHQUF1QixVQUFVQyxLQUFWLEVBQWlCQyxNQUFqQixFQUF5QjtBQUM1QyxXQUFLcEIsVUFBTCxDQUFnQmUsUUFBaEIsR0FBMkJJLEtBQUssR0FBR0MsTUFBbkM7QUFDSCxLQUZzQixDQUVyQkMsSUFGcUIsQ0FFaEIsSUFGZ0IsQ0FBdkI7O0FBSUF6QixJQUFBQSxFQUFFLENBQUMwQixRQUFILENBQVlDLFlBQVosQ0FBeUIsTUFBekIsRUFBaUMsWUFBWTtBQUN6QzNCLE1BQUFBLEVBQUUsQ0FBQ3FCLE1BQUgsQ0FBVUMsVUFBVixHQUF1QkYsTUFBdkI7QUFDQSxXQUFLaEIsVUFBTCxDQUFnQmEsSUFBaEIsQ0FBcUJDLE1BQXJCLEdBQThCLEtBQTlCO0FBQ0EsV0FBS1gsV0FBTCxDQUFpQlUsSUFBakIsQ0FBc0JDLE1BQXRCLEdBQStCLElBQS9CO0FBQ0FsQixNQUFBQSxFQUFFLENBQUMwQixRQUFILENBQVlFLFNBQVosQ0FBc0IsTUFBdEI7QUFDSCxLQUxnQyxDQUsvQkgsSUFMK0IsQ0FLMUIsSUFMMEIsQ0FBakM7QUFNSCxHQTFESTtBQTRETEksRUFBQUEsU0FBUyxFQUFFLHFCQUFVO0FBQ2pCN0IsSUFBQUEsRUFBRSxDQUFDYSxXQUFILENBQWVpQixJQUFmLENBQW9CLEtBQUtsQixtQkFBekI7QUFDSCxHQTlESSxDQWdFTDs7QUFoRUssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTGVhcm4gY2MuQ2xhc3M6XG4vLyAgLSBbQ2hpbmVzZV0gaHR0cDovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL3poL3NjcmlwdGluZy9jbGFzcy5odG1sXG4vLyAgLSBbRW5nbGlzaF0gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnL2RvY3MvY3JlYXRvci9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxuLy8gTGVhcm4gQXR0cmlidXRlOlxuLy8gIC0gW0NoaW5lc2VdIGh0dHA6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcbi8vIExlYXJuIGxpZmUtY3ljbGUgY2FsbGJhY2tzOlxuLy8gIC0gW0NoaW5lc2VdIGh0dHA6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcblxuaW1wb3J0IEF1ZGlvVXRpbHMgZnJvbSBcIi4uL1V0aWxzL0F1ZGlvVXRpbHNcIjtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgICAvLyBBVFRSSUJVVEVTOlxuICAgICAgICAvLyAgICAgZGVmYXVsdDogbnVsbCwgICAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIGJhcjoge1xuICAgICAgICAvLyAgICAgZ2V0ICgpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gdGhpcy5fYmFyO1xuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLl9iYXIgPSB2YWx1ZTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSxcbiAgICAgICAgbG9hZGluZ0Jhcjoge1xuICAgICAgICAgICAgdHlwZTogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB9LFxuICAgICAgICBsb2dpbkJ1dHRvbjoge1xuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgd29ybGRTY2VuZUJHTTp7XG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb0NsaXAsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgdGhpcy5nYW1lU2NlbmVCR01BdWRpb0lkID0gY2MuYXVkaW9FbmdpbmUucGxheSh0aGlzLndvcmxkU2NlbmVCR00sIHRydWUsIDEpO1xuICAgIH0sXG5cbiAgICBzdGFydCAoKSB7XG5cbiAgICB9LFxuXG4gICAgb25Mb2dpbjogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5sb2FkaW5nQmFyLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sb2dpbkJ1dHRvbi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvYWRpbmdCYXIucHJvZ3Jlc3MgPSAwO1xuICAgICAgICBsZXQgYmFja3VwID0gY2MubG9hZGVyLm9uUHJvZ3Jlc3M7XG4gICAgICAgIGNjLmxvYWRlci5vblByb2dyZXNzID0gZnVuY3Rpb24gKGNvdW50LCBhbW91bnQpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0Jhci5wcm9ncmVzcyA9IGNvdW50IC8gYW1vdW50O1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IucHJlbG9hZFNjZW5lKFwiR2FtZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5sb2FkZXIub25Qcm9ncmVzcyA9IGJhY2t1cDtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0Jhci5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb2dpbkJ1dHRvbi5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJHYW1lXCIpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3AodGhpcy5nYW1lU2NlbmVCR01BdWRpb0lkKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcbn0pO1xuIl19