
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Model/CellModel.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'dae88GCevBMaK7lQqhume8G', 'CellModel');
// Script/Model/CellModel.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _ConstValue = require("./ConstValue");

var CellModel = /*#__PURE__*/function () {
  function CellModel() {
    this.type = null;
    this.status = _ConstValue.CELL_STATUS.COMMON;
    this.x = 1;
    this.y = 1;
    this.startX = 1;
    this.startY = 1;
    this.cmd = [];
    this.isDeath = false;
    this.objecCount = Math.floor(Math.random() * 1000);
  }

  var _proto = CellModel.prototype;

  _proto.init = function init(type) {
    this.type = type;
  };

  _proto.isEmpty = function isEmpty() {
    return this.type == _ConstValue.CELL_TYPE.EMPTY;
  };

  _proto.setEmpty = function setEmpty() {
    this.type = _ConstValue.CELL_TYPE.EMPTY;
  };

  _proto.setXY = function setXY(x, y) {
    this.x = x;
    this.y = y;
  };

  _proto.setStartXY = function setStartXY(x, y) {
    this.startX = x;
    this.startY = y;
  };

  _proto.setStatus = function setStatus(status) {
    this.status = status;
  };

  _proto.moveToAndBack = function moveToAndBack(pos) {
    var srcPos = cc.v2(this.x, this.y);
    this.cmd.push({
      action: "moveTo",
      keepTime: _ConstValue.ANITIME.TOUCH_MOVE,
      playTime: 0,
      pos: pos
    });
    this.cmd.push({
      action: "moveTo",
      keepTime: _ConstValue.ANITIME.TOUCH_MOVE,
      playTime: _ConstValue.ANITIME.TOUCH_MOVE,
      pos: srcPos
    });
  };

  _proto.moveTo = function moveTo(pos, playTime) {
    var srcPos = cc.v2(this.x, this.y);
    this.cmd.push({
      action: "moveTo",
      keepTime: _ConstValue.ANITIME.TOUCH_MOVE,
      playTime: playTime,
      pos: pos
    });
    this.x = pos.x;
    this.y = pos.y;
  };

  _proto.toDie = function toDie(playTime) {
    this.cmd.push({
      action: "toDie",
      playTime: playTime,
      keepTime: _ConstValue.ANITIME.DIE
    });
    this.isDeath = true;
  };

  _proto.toShake = function toShake(playTime) {
    this.cmd.push({
      action: "toShake",
      playTime: playTime,
      keepTime: _ConstValue.ANITIME.DIE_SHAKE
    });
  };

  _proto.setVisible = function setVisible(playTime, isVisible) {
    this.cmd.push({
      action: "setVisible",
      playTime: playTime,
      keepTime: 0,
      isVisible: isVisible
    });
  };

  _proto.moveToAndDie = function moveToAndDie(pos) {};

  _proto.isBird = function isBird() {
    return this.type == _ConstValue.CELL_TYPE.G;
  };

  return CellModel;
}();

exports["default"] = CellModel;
module.exports = exports["default"];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kZWwvQ2VsbE1vZGVsLmpzIl0sIm5hbWVzIjpbIkNlbGxNb2RlbCIsInR5cGUiLCJzdGF0dXMiLCJDRUxMX1NUQVRVUyIsIkNPTU1PTiIsIngiLCJ5Iiwic3RhcnRYIiwic3RhcnRZIiwiY21kIiwiaXNEZWF0aCIsIm9iamVjQ291bnQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJpbml0IiwiaXNFbXB0eSIsIkNFTExfVFlQRSIsIkVNUFRZIiwic2V0RW1wdHkiLCJzZXRYWSIsInNldFN0YXJ0WFkiLCJzZXRTdGF0dXMiLCJtb3ZlVG9BbmRCYWNrIiwicG9zIiwic3JjUG9zIiwiY2MiLCJ2MiIsInB1c2giLCJhY3Rpb24iLCJrZWVwVGltZSIsIkFOSVRJTUUiLCJUT1VDSF9NT1ZFIiwicGxheVRpbWUiLCJtb3ZlVG8iLCJ0b0RpZSIsIkRJRSIsInRvU2hha2UiLCJESUVfU0hBS0UiLCJzZXRWaXNpYmxlIiwiaXNWaXNpYmxlIiwibW92ZVRvQW5kRGllIiwiaXNCaXJkIiwiRyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7SUFDcUJBO0FBQ2pCLHVCQUFjO0FBQ1YsU0FBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLQyxNQUFMLEdBQWNDLHdCQUFZQyxNQUExQjtBQUNBLFNBQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTLENBQVQ7QUFDQSxTQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsR0FBTCxHQUFXLEVBQVg7QUFDQSxTQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsSUFBM0IsQ0FBbEI7QUFDSDs7OztTQUVEQyxPQUFBLGNBQUtkLElBQUwsRUFBVztBQUNQLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNI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LEtBQUt6QyxJQUFMLElBQWFnQixzQkFBVTBCLENBQTlCO0FBQ0giLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENFTExfVFlQRSwgQU5JVElNRSwgQ0VMTF9TVEFUVVMsIEdSSURfSEVJR0hUIH0gZnJvbSBcIi4vQ29uc3RWYWx1ZVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VsbE1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBDRUxMX1NUQVRVUy5DT01NT047XG4gICAgICAgIHRoaXMueCA9IDE7XG4gICAgICAgIHRoaXMueSA9IDE7XG4gICAgICAgIHRoaXMuc3RhcnRYID0gMTtcbiAgICAgICAgdGhpcy5zdGFydFkgPSAxO1xuICAgICAgICB0aGlzLmNtZCA9IFtdO1xuICAgICAgICB0aGlzLmlzRGVhdGggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vYmplY0NvdW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XG4gICAgfVxuXG4gICAgaW5pdCh0eXBlKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PSBDRUxMX1RZUEUuRU1QVFk7XG4gICAgfVxuXG4gICAgc2V0RW1wdHkoKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IENFTExfVFlQRS5FTVBUWTtcbiAgICB9XG4gICAgc2V0WFkoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIHNldFN0YXJ0WFkoeCwgeSkge1xuICAgICAgICB0aGlzLnN0YXJ0WCA9IHg7XG4gICAgICAgIHRoaXMuc3RhcnRZID0geTtcbiAgICB9XG5cbiAgICBzZXRTdGF0dXMoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cblxuICAgIG1vdmVUb0FuZEJhY2socG9zKSB7XG4gICAgICAgIHZhciBzcmNQb3MgPSBjYy52Mih0aGlzLngsIHRoaXMueSk7XG4gICAgICAgIHRoaXMuY21kLnB1c2goe1xuICAgICAgICAgICAgYWN0aW9uOiBcIm1vdmVUb1wiLFxuICAgICAgICAgICAga2VlcFRpbWU6IEFOSVRJTUUuVE9VQ0hfTU9WRSxcbiAgICAgICAgICAgIHBsYXlUaW1lOiAwLFxuICAgICAgICAgICAgcG9zOiBwb3NcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY21kLnB1c2goe1xuICAgICAgICAgICAgYWN0aW9uOiBcIm1vdmVUb1wiLFxuICAgICAgICAgICAga2VlcFRpbWU6IEFOSVRJTUUuVE9VQ0hfTU9WRSxcbiAgICAgICAgICAgIHBsYXlUaW1lOiBBTklUSU1FLlRPVUNIX01PVkUsXG4gICAgICAgICAgICBwb3M6IHNyY1Bvc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtb3ZlVG8ocG9zLCBwbGF5VGltZSkge1xuICAgICAgICB2YXIgc3JjUG9zID0gY2MudjIodGhpcy54LCB0aGlzLnkpOyBcbiAgICAgICAgdGhpcy5jbWQucHVzaCh7XG4gICAgICAgICAgICBhY3Rpb246IFwibW92ZVRvXCIsXG4gICAgICAgICAgICBrZWVwVGltZTogQU5JVElNRS5UT1VDSF9NT1ZFLFxuICAgICAgICAgICAgcGxheVRpbWU6IHBsYXlUaW1lLFxuICAgICAgICAgICAgcG9zOiBwb3NcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMueCA9IHBvcy54O1xuICAgICAgICB0aGlzLnkgPSBwb3MueTtcbiAgICB9XG5cbiAgICB0b0RpZShwbGF5VGltZSkge1xuICAgICAgICB0aGlzLmNtZC5wdXNoKHtcbiAgICAgICAgICAgIGFjdGlvbjogXCJ0b0RpZVwiLFxuICAgICAgICAgICAgcGxheVRpbWU6IHBsYXlUaW1lLFxuICAgICAgICAgICAga2VlcFRpbWU6IEFOSVRJTUUuRElFXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmlzRGVhdGggPSB0cnVlO1xuICAgIH1cblxuICAgIHRvU2hha2UocGxheVRpbWUpIHtcbiAgICAgICAgdGhpcy5jbWQucHVzaCh7XG4gICAgICAgICAgICBhY3Rpb246IFwidG9TaGFrZVwiLFxuICAgICAgICAgICAgcGxheVRpbWU6IHBsYXlUaW1lLFxuICAgICAgICAgICAga2VlcFRpbWU6IEFOSVRJTUUuRElFX1NIQUtFXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldFZpc2libGUocGxheVRpbWUsIGlzVmlzaWJsZSkge1xuICAgICAgICB0aGlzLmNtZC5wdXNoKHtcbiAgICAgICAgICAgIGFjdGlvbjogXCJzZXRWaXNpYmxlXCIsXG4gICAgICAgICAgICBwbGF5VGltZTogcGxheVRpbWUsXG4gICAgICAgICAgICBrZWVwVGltZTogMCxcbiAgICAgICAgICAgIGlzVmlzaWJsZTogaXNWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1vdmVUb0FuZERpZShwb3MpIHtcblxuICAgIH1cblxuICAgIGlzQmlyZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PSBDRUxMX1RZUEUuRztcbiAgICB9XG5cbn1cbiJdfQ==