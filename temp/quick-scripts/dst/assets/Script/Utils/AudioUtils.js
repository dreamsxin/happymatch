
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Utils/AudioUtils.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'fe151y+R2lFvas76dyah2Uf', 'AudioUtils');
// Script/Utils/AudioUtils.js

"use strict";

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
    swap: {
      type: cc.AudioClip,
      "default": null
    },
    click: {
      type: cc.AudioClip,
      "default": null
    },
    eliminate: {
      type: [cc.AudioClip],
      "default": []
    },
    continuousMatch: {
      type: [cc.AudioClip],
      "default": []
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {},
  start: function start() {},
  playClick: function playClick() {
    cc.audioEngine.play(this.click, false, 1);
  },
  playSwap: function playSwap() {
    cc.audioEngine.play(this.swap, false, 1);
  },
  playEliminate: function playEliminate(step) {
    step = Math.min(this.eliminate.length - 1, step);
    cc.audioEngine.play(this.eliminate[step], false, 1);
  },
  playContinuousMatch: function playContinuousMatch(step) {
    console.log("step = ", step);
    step = Math.min(step, 11);

    if (step < 2) {
      return;
    }

    cc.audioEngine.play(this.continuousMatch[Math.floor(step / 2) - 1], false, 1);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvVXRpbHMvQXVkaW9VdGlscy5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN3YXAiLCJ0eXBlIiwiQXVkaW9DbGlwIiwiY2xpY2siLCJlbGltaW5hdGUiLCJjb250aW51b3VzTWF0Y2giLCJvbkxvYWQiLCJzdGFydCIsInBsYXlDbGljayIsImF1ZGlvRW5naW5lIiwicGxheSIsInBsYXlTd2FwIiwicGxheUVsaW1pbmF0ZSIsInN0ZXAiLCJNYXRoIiwibWluIiwibGVuZ3RoIiwicGxheUNvbnRpbnVvdXNNYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJmbG9vciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLElBQUksRUFBRTtBQUNGQyxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ00sU0FEUDtBQUVGLGlCQUFTO0FBRlAsS0FoQkU7QUFvQlJDLElBQUFBLEtBQUssRUFBRTtBQUNIRixNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ00sU0FETjtBQUVILGlCQUFTO0FBRk4sS0FwQkM7QUF3QlJFLElBQUFBLFNBQVMsRUFBQztBQUNOSCxNQUFBQSxJQUFJLEVBQUUsQ0FBQ0wsRUFBRSxDQUFDTSxTQUFKLENBREE7QUFFTixpQkFBUztBQUZILEtBeEJGO0FBNEJSRyxJQUFBQSxlQUFlLEVBQUM7QUFDWkosTUFBQUEsSUFBSSxFQUFFLENBQUNMLEVBQUUsQ0FBQ00sU0FBSixDQURNO0FBRVosaUJBQVM7QUFGRztBQTVCUixHQUhQO0FBcUNMO0FBRUFJLEVBQUFBLE1BdkNLLG9CQXVDSyxDQUVULENBekNJO0FBMkNMQyxFQUFBQSxLQTNDSyxtQkEyQ0ksQ0FFUixDQTdDSTtBQThDTEMsRUFBQUEsU0FBUyxFQUFFLHFCQUFVO0FBQ2pCWixJQUFBQSxFQUFFLENBQUNhLFdBQUgsQ0FBZUMsSUFBZixDQUFvQixLQUFLUCxLQUF6QixFQUFnQyxLQUFoQyxFQUF1QyxDQUF2QztBQUNILEdBaERJO0FBaURMUSxFQUFBQSxRQUFRLEVBQUUsb0JBQVU7QUFDaEJmLElBQUFBLEVBQUUsQ0FBQ2EsV0FBSCxDQUFlQyxJQUFmLENBQW9CLEtBQUtWLElBQXpCLEVBQStCLEtBQS9CLEVBQXNDLENBQXRDO0FBQ0gsR0FuREk7QUFvRExZLEVBQUFBLGFBQWEsRUFBRSx1QkFBU0MsSUFBVCxFQUFjO0FBQ3pCQSxJQUFBQSxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEtBQUtYLFNBQUwsQ0FBZVksTUFBZixHQUF3QixDQUFqQyxFQUFvQ0gsSUFBcEMsQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxDQUFDYSxXQUFILENBQWVDLElBQWYsQ0FBb0IsS0FBS04sU0FBTCxDQUFlUyxJQUFmLENBQXBCLEVBQTBDLEtBQTFDLEVBQWlELENBQWpEO0FBQ0gsR0F2REk7QUF3RExJLEVBQUFBLG1CQUFtQixFQUFFLDZCQUFTSixJQUFULEVBQWM7QUFDL0JLLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFBdUJOLElBQXZCO0FBQ0FBLElBQUFBLElBQUksR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNGLElBQVQsRUFBZSxFQUFmLENBQVA7O0FBQ0EsUUFBR0EsSUFBSSxHQUFHLENBQVYsRUFBWTtBQUNSO0FBQ0g7O0FBQ0RqQixJQUFBQSxFQUFFLENBQUNhLFdBQUgsQ0FBZUMsSUFBZixDQUFvQixLQUFLTCxlQUFMLENBQXFCUyxJQUFJLENBQUNNLEtBQUwsQ0FBV1AsSUFBSSxHQUFDLENBQWhCLElBQXFCLENBQTFDLENBQXBCLEVBQWtFLEtBQWxFLEVBQXlFLENBQXpFO0FBQ0gsR0EvREksQ0FpRUw7O0FBakVLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxuLy8gIC0gW0NoaW5lc2VdIGh0dHA6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC96aC9zY3JpcHRpbmcvY2xhc3MuaHRtbFxuLy8gIC0gW0VuZ2xpc2hdIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZy9kb2NzL2NyZWF0b3IvZW4vc2NyaXB0aW5nL2NsYXNzLmh0bWxcbi8vIExlYXJuIEF0dHJpYnV0ZTpcbi8vICAtIFtDaGluZXNlXSBodHRwOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvemgvc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcbi8vICAtIFtFbmdsaXNoXSBodHRwOi8vd3d3LmNvY29zMmQteC5vcmcvZG9jcy9jcmVhdG9yL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcbi8vICAtIFtDaGluZXNlXSBodHRwOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvemgvc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcbi8vICAtIFtFbmdsaXNoXSBodHRwOi8vd3d3LmNvY29zMmQteC5vcmcvZG9jcy9jcmVhdG9yL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICAgLy8gQVRUUklCVVRFUzpcbiAgICAgICAgLy8gICAgIGRlZmF1bHQ6IG51bGwsICAgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgICBzZXJpYWxpemFibGU6IHRydWUsICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyBiYXI6IHtcbiAgICAgICAgLy8gICAgIGdldCAoKSB7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIHRoaXMuX2JhcjtcbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5fYmFyID0gdmFsdWU7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0sXG4gICAgICAgIHN3YXA6IHtcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2s6IHtcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgZWxpbWluYXRlOntcbiAgICAgICAgICAgIHR5cGU6IFtjYy5BdWRpb0NsaXBdLFxuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRpbnVvdXNNYXRjaDp7XG4gICAgICAgICAgICB0eXBlOiBbY2MuQXVkaW9DbGlwXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuXG4gICAgfSxcbiAgICBwbGF5Q2xpY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkodGhpcy5jbGljaywgZmFsc2UsIDEpO1xuICAgIH0sXG4gICAgcGxheVN3YXA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkodGhpcy5zd2FwLCBmYWxzZSwgMSk7XG4gICAgfSxcbiAgICBwbGF5RWxpbWluYXRlOiBmdW5jdGlvbihzdGVwKXtcbiAgICAgICAgc3RlcCA9IE1hdGgubWluKHRoaXMuZWxpbWluYXRlLmxlbmd0aCAtIDEsIHN0ZXApO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KHRoaXMuZWxpbWluYXRlW3N0ZXBdLCBmYWxzZSwgMSk7XG4gICAgfSxcbiAgICBwbGF5Q29udGludW91c01hdGNoOiBmdW5jdGlvbihzdGVwKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGVwID0gXCIsIHN0ZXApO1xuICAgICAgICBzdGVwID0gTWF0aC5taW4oc3RlcCwgMTEpO1xuICAgICAgICBpZihzdGVwIDwgMil7XG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIH1cbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheSh0aGlzLmNvbnRpbnVvdXNNYXRjaFtNYXRoLmZsb29yKHN0ZXAvMikgLSAxXSwgZmFsc2UsIDEpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxufSk7XG4iXX0=