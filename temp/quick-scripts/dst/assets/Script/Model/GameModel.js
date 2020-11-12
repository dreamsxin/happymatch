
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Model/GameModel.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cc442HaMlBE/ZKi7W/YUKwd', 'GameModel');
// Script/Model/GameModel.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CellModel = _interopRequireDefault(require("./CellModel"));

var _ConstValue = require("./ConstValue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var GameModel = /*#__PURE__*/function () {
  function GameModel() {
    this.cells = null;
    this.cellBgs = null;
    this.lastPos = cc.v2(-1, -1);
    this.cellTypeNum = 5;
    this.cellCreateType = []; // 升成种类只在这个数组里面查找
  }

  var _proto = GameModel.prototype;

  _proto.init = function init(cellTypeNum) {
    this.cells = [];
    this.setCellTypeNum(cellTypeNum || this.cellTypeNum);

    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
      this.cells[i] = [];

      for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
        this.cells[i][j] = new _CellModel["default"]();
      }
    }

    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
      for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
        var flag = true;

        while (flag) {
          flag = false;
          this.cells[i][j].init(this.getRandomCellType());
          var result = this.checkPoint(j, i)[0];

          if (result.length > 2) {
            flag = true;
          }

          this.cells[i][j].setXY(j, i);
          this.cells[i][j].setStartXY(j, i);
        }
      }
    }
  };

  _proto.initWithData = function initWithData(data) {// to do
  };

  _proto.checkPoint = function checkPoint(x, y) {
    var checkWithDirection = function checkWithDirection(x, y, direction) {
      var queue = [];
      var vis = [];
      vis[x + y * 9] = true;
      queue.push(cc.v2(x, y));
      var front = 0;

      while (front < queue.length) {
        //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
        var point = queue[front];
        var cellModel = this.cells[point.y][point.x];
        front++;

        if (!cellModel) {
          continue;
        }

        for (var i = 0; i < direction.length; i++) {
          var tmpX = point.x + direction[i].x;
          var tmpY = point.y + direction[i].y;

          if (tmpX < 1 || tmpX > 9 || tmpY < 1 || tmpY > 9 || vis[tmpX + tmpY * 9] || !this.cells[tmpY][tmpX]) {
            continue;
          }

          if (cellModel.type == this.cells[tmpY][tmpX].type) {
            vis[tmpX + tmpY * 9] = true;
            queue.push(cc.v2(tmpX, tmpY));
          }
        }
      }

      return queue;
    };

    var rowResult = checkWithDirection.call(this, x, y, [cc.v2(1, 0), cc.v2(-1, 0)]);
    var colResult = checkWithDirection.call(this, x, y, [cc.v2(0, -1), cc.v2(0, 1)]);
    var result = [];
    var newCellStatus = "";

    if (rowResult.length >= 5 || colResult.length >= 5) {
      newCellStatus = _ConstValue.CELL_STATUS.BIRD;
    } else if (rowResult.length >= 3 && colResult.length >= 3) {
      newCellStatus = _ConstValue.CELL_STATUS.WRAP;
    } else if (rowResult.length >= 4) {
      newCellStatus = _ConstValue.CELL_STATUS.LINE;
    } else if (colResult.length >= 4) {
      newCellStatus = _ConstValue.CELL_STATUS.COLUMN;
    }

    if (rowResult.length >= 3) {
      result = rowResult;
    }

    if (colResult.length >= 3) {
      var tmp = result.concat();
      colResult.forEach(function (newEle) {
        var flag = false;
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
  };

  _proto.printInfo = function printInfo() {
    for (var i = 1; i <= 9; i++) {
      var printStr = "";

      for (var j = 1; j <= 9; j++) {
        printStr += this.cells[i][j].type + " ";
      }

      console.log(printStr);
    }
  };

  _proto.getCells = function getCells() {
    return this.cells;
  } // controller调用的主要入口
  // 点击某个格子
  ;

  _proto.selectCell = function selectCell(pos) {
    this.changeModels = []; // 发生改变的model，将作为返回值，给view播动作

    this.effectsQueue = []; // 动物消失，爆炸等特效

    var lastPos = this.lastPos;
    var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);

    if (delta != 1) {
      //非相邻格子， 直接返回
      this.lastPos = pos;
      return [[], []];
    }

    var curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子

    var lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格式

    this.exchangeCell(lastPos, pos);
    var result1 = this.checkPoint(pos.x, pos.y)[0];
    var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
    this.curTime = 0; // 动画播放的当前时间

    this.pushToChangeModels(curClickCell);
    this.pushToChangeModels(lastClickCell);
    var isCanBomb = curClickCell.status != _ConstValue.CELL_STATUS.COMMON && // 判断两个是否是特殊的动物
    lastClickCell.status != _ConstValue.CELL_STATUS.COMMON || curClickCell.status == _ConstValue.CELL_STATUS.BIRD || lastClickCell.status == _ConstValue.CELL_STATUS.BIRD;

    if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
      //不会发生消除的情况
      this.exchangeCell(lastPos, pos);
      curClickCell.moveToAndBack(lastPos);
      lastClickCell.moveToAndBack(pos);
      this.lastPos = cc.v2(-1, -1);
      return [this.changeModels];
    } else {
      this.lastPos = cc.v2(-1, -1);
      curClickCell.moveTo(lastPos, this.curTime);
      lastClickCell.moveTo(pos, this.curTime);
      var checkPoint = [pos, lastPos];
      this.curTime += _ConstValue.ANITIME.TOUCH_MOVE;
      this.processCrush(checkPoint);
      return [this.changeModels, this.effectsQueue];
    }
  } // 消除
  ;

  _proto.processCrush = function processCrush(checkPoint) {
    var cycleCount = 0;

    while (checkPoint.length > 0) {
      var bombModels = [];

      if (cycleCount == 0 && checkPoint.length == 2) {
        //特殊消除
        var pos1 = checkPoint[0];
        var pos2 = checkPoint[1];
        var model1 = this.cells[pos1.y][pos1.x];
        var model2 = this.cells[pos2.y][pos2.x];

        if (model1.status == _ConstValue.CELL_STATUS.BIRD || model2.status == _ConstValue.CELL_STATUS.BIRD) {
          var bombModel = null;

          if (model1.status == _ConstValue.CELL_STATUS.BIRD) {
            model1.type = model2.type;
            bombModels.push(model1);
          } else {
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

        var _this$checkPoint = this.checkPoint(pos.x, pos.y),
            result = _this$checkPoint[0],
            newCellStatus = _this$checkPoint[1],
            newCellType = _this$checkPoint[2];

        if (result.length < 3) {
          continue;
        }

        for (var j in result) {
          var model = this.cells[result[j].y][result[j].x];
          this.crushCell(result[j].x, result[j].y, false, cycleCount);

          if (model.status != _ConstValue.CELL_STATUS.COMMON) {
            bombModels.push(model);
          }
        }

        this.createNewCell(pos, newCellStatus, newCellType);
      }

      this.processBomb(bombModels, cycleCount);
      this.curTime += _ConstValue.ANITIME.DIE;
      checkPoint = this.down();
      cycleCount++;
    }
  } //生成新cell
  ;

  _proto.createNewCell = function createNewCell(pos, status, type) {
    if (status == "") {
      return;
    }

    if (status == _ConstValue.CELL_STATUS.BIRD) {
      type = _ConstValue.CELL_TYPE.BIRD;
    }

    var model = new _CellModel["default"]();
    this.cells[pos.y][pos.x] = model;
    model.init(type);
    model.setStartXY(pos.x, pos.y);
    model.setXY(pos.x, pos.y);
    model.setStatus(status);
    model.setVisible(0, false);
    model.setVisible(this.curTime, true);
    this.changeModels.push(model);
  } // 下落
  ;

  _proto.down = function down() {
    var newCheckPoint = [];

    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
      for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
        if (this.cells[i][j] == null) {
          var curRow = i;

          for (var k = curRow; k <= _ConstValue.GRID_HEIGHT; k++) {
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

          for (var k = curRow; k <= _ConstValue.GRID_HEIGHT; k++) {
            this.cells[k][j] = new _CellModel["default"]();
            this.cells[k][j].init(this.getRandomCellType());
            this.cells[k][j].setStartXY(j, count + _ConstValue.GRID_HEIGHT);
            this.cells[k][j].setXY(j, count + _ConstValue.GRID_HEIGHT);
            this.cells[k][j].moveTo(cc.v2(j, k), this.curTime);
            count++;
            this.changeModels.push(this.cells[k][j]);
            newCheckPoint.push(this.cells[k][j]);
          }
        }
      }
    }

    this.curTime += _ConstValue.ANITIME.TOUCH_MOVE + 0.3;
    return newCheckPoint;
  };

  _proto.pushToChangeModels = function pushToChangeModels(model) {
    if (this.changeModels.indexOf(model) != -1) {
      return;
    }

    this.changeModels.push(model);
  };

  _proto.cleanCmd = function cleanCmd() {
    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
      for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
        if (this.cells[i][j]) {
          this.cells[i][j].cmd = [];
        }
      }
    }
  };

  _proto.exchangeCell = function exchangeCell(pos1, pos2) {
    var tmpModel = this.cells[pos1.y][pos1.x];
    this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
    this.cells[pos1.y][pos1.x].x = pos1.x;
    this.cells[pos1.y][pos1.x].y = pos1.y;
    this.cells[pos2.y][pos2.x] = tmpModel;
    this.cells[pos2.y][pos2.x].x = pos2.x;
    this.cells[pos2.y][pos2.x].y = pos2.y;
  } // 设置种类
  // Todo 改成乱序算法
  ;

  _proto.setCellTypeNum = function setCellTypeNum(num) {
    console.log("num = ", num);
    this.cellTypeNum = num;
    this.cellCreateType = [];
    var createTypeList = this.cellCreateType;

    for (var i = 1; i <= _ConstValue.CELL_BASENUM; i++) {
      createTypeList.push(i);
    }

    for (var _i = 0; _i < createTypeList.length; _i++) {
      var index = Math.floor(Math.random() * (_ConstValue.CELL_BASENUM - _i)) + _i;

      createTypeList[_i], createTypeList[index] = createTypeList[index], createTypeList[_i];
    }
  } // 随要生成一个类型
  ;

  _proto.getRandomCellType = function getRandomCellType() {
    var index = Math.floor(Math.random() * this.cellTypeNum);
    return this.cellCreateType[index];
  } // TODO bombModels去重
  ;

  _proto.processBomb = function processBomb(bombModels, cycleCount) {
    var _this = this;

    var _loop = function _loop() {
      var newBombModel = [];
      var bombTime = _ConstValue.ANITIME.BOMB_DELAY;
      bombModels.forEach(function (model) {
        if (model.status == _ConstValue.CELL_STATUS.LINE) {
          for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
            if (this.cells[model.y][i]) {
              if (this.cells[model.y][i].status != _ConstValue.CELL_STATUS.COMMON) {
                newBombModel.push(this.cells[model.y][i]);
              }

              this.crushCell(i, model.y, false, cycleCount);
            }
          }

          this.addRowBomb(this.curTime, cc.v2(model.x, model.y));
        } else if (model.status == _ConstValue.CELL_STATUS.COLUMN) {
          for (var _i2 = 1; _i2 <= _ConstValue.GRID_HEIGHT; _i2++) {
            if (this.cells[_i2][model.x]) {
              if (this.cells[_i2][model.x].status != _ConstValue.CELL_STATUS.COMMON) {
                newBombModel.push(this.cells[_i2][model.x]);
              }

              this.crushCell(model.x, _i2, false, cycleCount);
            }
          }

          this.addColBomb(this.curTime, cc.v2(model.x, model.y));
        } else if (model.status == _ConstValue.CELL_STATUS.WRAP) {
          var x = model.x;
          var y = model.y;

          for (var _i3 = 1; _i3 <= _ConstValue.GRID_HEIGHT; _i3++) {
            for (var j = 1; j <= _ConstValue.GRID_WIDTH; j++) {
              var delta = Math.abs(x - j) + Math.abs(y - _i3);

              if (this.cells[_i3][j] && delta <= 2) {
                if (this.cells[_i3][j].status != _ConstValue.CELL_STATUS.COMMON) {
                  newBombModel.push(this.cells[_i3][j]);
                }

                this.crushCell(j, _i3, false, cycleCount);
              }
            }
          }
        } else if (model.status == _ConstValue.CELL_STATUS.BIRD) {
          var crushType = model.type;

          if (bombTime < _ConstValue.ANITIME.BOMB_BIRD_DELAY) {
            bombTime = _ConstValue.ANITIME.BOMB_BIRD_DELAY;
          }

          if (crushType == _ConstValue.CELL_TYPE.BIRD) {
            crushType = this.getRandomCellType();
          }

          for (var _i4 = 1; _i4 <= _ConstValue.GRID_HEIGHT; _i4++) {
            for (var _j = 1; _j <= _ConstValue.GRID_WIDTH; _j++) {
              if (this.cells[_i4][_j] && this.cells[_i4][_j].type == crushType) {
                if (this.cells[_i4][_j].status != _ConstValue.CELL_STATUS.COMMON) {
                  newBombModel.push(this.cells[_i4][_j]);
                }

                this.crushCell(_j, _i4, true, cycleCount);
              }
            }
          } //this.crushCell(model.x, model.y);

        }
      }, _this);

      if (bombModels.length > 0) {
        _this.curTime += bombTime;
      }

      bombModels = newBombModel;
    };

    while (bombModels.length > 0) {
      _loop();
    }
  }
  /**
   * 
   * @param {开始播放的时间} playTime 
   * @param {*cell位置} pos 
   * @param {*第几次消除，用于播放音效} step 
   */
  ;

  _proto.addCrushEffect = function addCrushEffect(playTime, pos, step) {
    this.effectsQueue.push({
      playTime: playTime,
      pos: pos,
      action: "crush",
      step: step
    });
  };

  _proto.addRowBomb = function addRowBomb(playTime, pos) {
    this.effectsQueue.push({
      playTime: playTime,
      pos: pos,
      action: "rowBomb"
    });
  };

  _proto.addColBomb = function addColBomb(playTime, pos) {
    this.effectsQueue.push({
      playTime: playTime,
      pos: pos,
      action: "colBomb"
    });
  };

  _proto.addWrapBomb = function addWrapBomb(playTime, pos) {// TODO
  } // cell消除逻辑
  ;

  _proto.crushCell = function crushCell(x, y, needShake, step) {
    var model = this.cells[y][x];
    this.pushToChangeModels(model);

    if (needShake) {
      model.toShake(this.curTime);
    }

    var shakeTime = needShake ? _ConstValue.ANITIME.DIE_SHAKE : 0;
    model.toDie(this.curTime + shakeTime);
    this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), step);
    this.cells[y][x] = null;
  };

  return GameModel;
}();

exports["default"] = GameModel;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kZWwvR2FtZU1vZGVsLmpzIl0sIm5hbWVzIjpbIkdhbWVNb2RlbCIsImNlbGxzIiwiY2VsbEJncyIsImxhc3RQb3MiLCJjYyIsInYyIiwiY2VsbFR5cGVOdW0iLCJjZWxsQ3JlYXRlVHlwZSIsImluaXQiLCJzZXRDZWxsVHlwZU51bSIsImkiLCJHUklEX1dJRFRIIiwiaiIsIkdSSURfSEVJR0hUIiwiQ2VsbE1vZGVsIiwiZmxhZyIsImdldFJhbmRvbUNlbGxUeXBlIiwicmVzdWx0IiwiY2hlY2tQb2ludCIsImxlbmd0aCIsInNldFhZIiwic2V0U3RhcnRYWSIsImluaXRXaXRoRGF0YSIsImRhdGEiLCJ4IiwieSIsImNoZWNrV2l0aERpcmVjdGlvbiIsImRpcmVjdGlvbiIsInF1ZXVlIiwidmlzIiwicHVzaCIsImZyb250IiwicG9pbnQiLCJjZWxsTW9kZWwiLCJ0bXBYIiwidG1wWSIsInR5cGUiLCJyb3dSZXN1bHQiLCJjYWxsIiwiY29sUmVzdWx0IiwibmV3Q2VsbFN0YXR1cyIsIkNFTExfU1RBVFVTIiwiQklSRCIsIldSQVAiLCJMSU5FIiwiQ09MVU1OIiwidG1wIiwiY29uY2F0IiwiZm9yRWFjaCIsIm5ld0VsZSIsIm9sZEVsZSIsInByaW50SW5mbyIsInByaW50U3RyIiwiY29uc29sZSIsImxvZyIsImdldENlbGxzIiwic2VsZWN0Q2VsbCIsInBvcyIsImNoYW5nZU1vZGVscyIsImVmZmVjdHNRdWV1ZSIsImRlbHRhIiwiTWF0aCIsImFicyIsImN1ckNsaWNrQ2VsbCIsImxhc3RDbGlja0NlbGwiLCJleGNoYW5nZUNlbGwiLCJyZXN1bHQxIiwicmVzdWx0MiIsImN1clRpbWUiLCJwdXNoVG9DaGFuZ2VNb2RlbHMiLCJpc0NhbkJvbWIiLCJzdGF0dXMiLCJDT01NT04iLCJtb3ZlVG9BbmRCYWNrIiwibW92ZVRvIiwiQU5JVElNRSIsIlRPVUNIX01PVkUiLCJwcm9jZXNzQ3J1c2giLCJjeWNsZUNvdW50IiwiYm9tYk1vZGVscyIsInBvczEiLCJwb3MyIiwibW9kZWwxIiwibW9kZWwyIiwiYm9tYk1vZGVsIiwibmV3Q2VsbFR5cGUiLCJtb2RlbCIsImNydXNoQ2VsbCIsImNyZWF0ZU5ld0NlbGwiLCJwcm9jZXNzQm9tYiIsIkRJRSIsImRvd24iLCJDRUxMX1RZUEUiLCJzZXRTdGF0dXMiLCJzZXRWaXNpYmxlIiwibmV3Q2hlY2tQb2ludCIsImN1clJvdyIsImsiLCJjb3VudCIsImluZGV4T2YiLCJjbGVhbkNtZCIsImNtZCIsInRtcE1vZGVsIiwibnVtIiwiY3JlYXRlVHlwZUxpc3QiLCJDRUxMX0JBU0VOVU0iLCJpbmRleCIsImZsb29yIiwicmFuZG9tIiwibmV3Qm9tYk1vZGVsIiwiYm9tYlRpbWUiLCJCT01CX0RFTEFZIiwiYWRkUm93Qm9tYiIsImFkZENvbEJvbWIiLCJjcnVzaFR5cGUiLCJCT01CX0JJUkRfREVMQVkiLCJhZGRDcnVzaEVmZmVjdCIsInBsYXlUaW1lIiwic3RlcCIsImFjdGlvbiIsImFkZFdyYXBCb21iIiwibmVlZFNoYWtlIiwidG9TaGFrZSIsInNoYWtlVGltZSIsIkRJRV9TSEFLRSIsInRvRGllIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0lBRXFCQTtBQUNqQix1QkFBYztBQUNWLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWVDLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNLENBQUMsQ0FBUCxFQUFVLENBQUMsQ0FBWCxDQUFmO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixDQUFuQjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsRUFBdEIsQ0FMVSxDQUtnQjtBQUM3Qjs7OztTQUVEQyxPQUFBLGNBQUtGLFdBQUwsRUFBa0I7QUFDZCxTQUFLTCxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUtRLGNBQUwsQ0FBb0JILFdBQVcsSUFBSSxLQUFLQSxXQUF4Qzs7QUFDQSxTQUFLLElBQUlJLENBQUMsR0FBRyxD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QWNELENBQWQsSUFBbUIsSUFBbkI7QUFDSCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENlbGxNb2RlbCBmcm9tIFwiLi9DZWxsTW9kZWxcIjtcbmltcG9ydCB7IENFTExfVFlQRSwgQ0VMTF9CQVNFTlVNLCBDRUxMX1NUQVRVUywgR1JJRF9XSURUSCwgR1JJRF9IRUlHSFQsIEFOSVRJTUUgfSBmcm9tIFwiLi9Db25zdFZhbHVlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2VsbHMgPSBudWxsO1xuICAgICAgICB0aGlzLmNlbGxCZ3MgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RQb3MgPSBjYy52MigtMSwgLTEpO1xuICAgICAgICB0aGlzLmNlbGxUeXBlTnVtID0gNTtcbiAgICAgICAgdGhpcy5jZWxsQ3JlYXRlVHlwZSA9IFtdOyAvLyDljYfmiJDnp43nsbvlj6rlnKjov5nkuKrmlbDnu4Tph4zpnaLmn6Xmib5cbiAgICB9XG5cbiAgICBpbml0KGNlbGxUeXBlTnVtKSB7XG4gICAgICAgIHRoaXMuY2VsbHMgPSBbXTtcbiAgICAgICAgdGhpcy5zZXRDZWxsVHlwZU51bShjZWxsVHlwZU51bSB8fCB0aGlzLmNlbGxUeXBlTnVtKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gR1JJRF9XSURUSDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNlbGxzW2ldID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBHUklEX0hFSUdIVDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXSA9IG5ldyBDZWxsTW9kZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IEdSSURfV0lEVEg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gR1JJRF9IRUlHSFQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uaW5pdCh0aGlzLmdldFJhbmRvbUNlbGxUeXBlKCkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5jaGVja1BvaW50KGosIGkpWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uc2V0WFkoaiwgaSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uc2V0U3RhcnRYWShqLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGluaXRXaXRoRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIHRvIGRvXG4gICAgfVxuXG4gICAgY2hlY2tQb2ludCh4LCB5KSB7XG4gICAgICAgIGxldCBjaGVja1dpdGhEaXJlY3Rpb24gPSBmdW5jdGlvbiAoeCwgeSwgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBsZXQgcXVldWUgPSBbXTtcbiAgICAgICAgICAgIGxldCB2aXMgPSBbXTtcbiAgICAgICAgICAgIHZpc1t4ICsgeSAqIDldID0gdHJ1ZTtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goY2MudjIoeCwgeSkpO1xuICAgICAgICAgICAgbGV0IGZyb250ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChmcm9udCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vbGV0IGRpcmVjdGlvbiA9IFtjYy52MigwLCAtMSksIGNjLnYyKDAsIDEpLCBjYy52MigxLCAwKSwgY2MudjIoLTEsIDApXTtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnQgPSBxdWV1ZVtmcm9udF07XG4gICAgICAgICAgICAgICAgbGV0IGNlbGxNb2RlbCA9IHRoaXMuY2VsbHNbcG9pbnQueV1bcG9pbnQueF07XG4gICAgICAgICAgICAgICAgZnJvbnQrKztcbiAgICAgICAgICAgICAgICBpZiAoIWNlbGxNb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFggPSBwb2ludC54ICsgZGlyZWN0aW9uW2ldLng7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0bXBZID0gcG9pbnQueSArIGRpcmVjdGlvbltpXS55O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG1wWCA8IDEgfHwgdG1wWCA+IDlcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRtcFkgPCAxIHx8IHRtcFkgPiA5XG4gICAgICAgICAgICAgICAgICAgICAgICB8fCB2aXNbdG1wWCArIHRtcFkgKiA5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgIXRoaXMuY2VsbHNbdG1wWV1bdG1wWF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsTW9kZWwudHlwZSA9PSB0aGlzLmNlbGxzW3RtcFldW3RtcFhdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc1t0bXBYICsgdG1wWSAqIDldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goY2MudjIodG1wWCwgdG1wWSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCByb3dSZXN1bHQgPSBjaGVja1dpdGhEaXJlY3Rpb24uY2FsbCh0aGlzLCB4LCB5LCBbY2MudjIoMSwgMCksIGNjLnYyKC0xLCAwKV0pO1xuICAgICAgICBsZXQgY29sUmVzdWx0ID0gY2hlY2tXaXRoRGlyZWN0aW9uLmNhbGwodGhpcywgeCwgeSwgW2NjLnYyKDAsIC0xKSwgY2MudjIoMCwgMSldKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgbmV3Q2VsbFN0YXR1cyA9IFwiXCI7XG4gICAgICAgIGlmIChyb3dSZXN1bHQubGVuZ3RoID49IDUgfHwgY29sUmVzdWx0Lmxlbmd0aCA+PSA1KSB7XG4gICAgICAgICAgICBuZXdDZWxsU3RhdHVzID0gQ0VMTF9TVEFUVVMuQklSRDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3dSZXN1bHQubGVuZ3RoID49IDMgJiYgY29sUmVzdWx0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICBuZXdDZWxsU3RhdHVzID0gQ0VMTF9TVEFUVVMuV1JBUDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3dSZXN1bHQubGVuZ3RoID49IDQpIHtcbiAgICAgICAgICAgIG5ld0NlbGxTdGF0dXMgPSBDRUxMX1NUQVRVUy5MSU5FO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbFJlc3VsdC5sZW5ndGggPj0gNCkge1xuICAgICAgICAgICAgbmV3Q2VsbFN0YXR1cyA9IENFTExfU1RBVFVTLkNPTFVNTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm93UmVzdWx0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByb3dSZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbFJlc3VsdC5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgbGV0IHRtcCA9IHJlc3VsdC5jb25jYXQoKTtcbiAgICAgICAgICAgIGNvbFJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uIChuZXdFbGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRtcC5mb3JFYWNoKGZ1bmN0aW9uIChvbGRFbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0VsZS54ID09IG9sZEVsZS54ICYmIG5ld0VsZS55ID09IG9sZEVsZS55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICghZmxhZykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXdFbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcmVzdWx0LCBuZXdDZWxsU3RhdHVzLCB0aGlzLmNlbGxzW3ldW3hdLnR5cGVdO1xuICAgIH1cblxuICAgIHByaW50SW5mbygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gOTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJpbnRTdHIgPSBcIlwiO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gOTsgaisrKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRTdHIgKz0gdGhpcy5jZWxsc1tpXVtqXS50eXBlICsgXCIgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcmludFN0cik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDZWxscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHM7XG4gICAgfVxuICAgIC8vIGNvbnRyb2xsZXLosIPnlKjnmoTkuLvopoHlhaXlj6NcbiAgICAvLyDngrnlh7vmn5DkuKrmoLzlrZBcbiAgICBzZWxlY3RDZWxsKHBvcykge1xuICAgICAgICB0aGlzLmNoYW5nZU1vZGVscyA9IFtdOy8vIOWPkeeUn+aUueWPmOeahG1vZGVs77yM5bCG5L2c5Li66L+U5Zue5YC877yM57uZdmlld+aSreWKqOS9nFxuICAgICAgICB0aGlzLmVmZmVjdHNRdWV1ZSA9IFtdOyAvLyDliqjnianmtojlpLHvvIzniIbngrjnrYnnibnmlYhcbiAgICAgICAgdmFyIGxhc3RQb3MgPSB0aGlzLmxhc3RQb3M7XG4gICAgICAgIHZhciBkZWx0YSA9IE1hdGguYWJzKHBvcy54IC0gbGFzdFBvcy54KSArIE1hdGguYWJzKHBvcy55IC0gbGFzdFBvcy55KTtcbiAgICAgICAgaWYgKGRlbHRhICE9IDEpIHsgLy/pnZ7nm7jpgrvmoLzlrZDvvIwg55u05o6l6L+U5ZueXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3MgPSBwb3M7XG4gICAgICAgICAgICByZXR1cm4gW1tdLCBbXV07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN1ckNsaWNrQ2VsbCA9IHRoaXMuY2VsbHNbcG9zLnldW3Bvcy54XTsgLy/lvZPliY3ngrnlh7vnmoTmoLzlrZBcbiAgICAgICAgbGV0IGxhc3RDbGlja0NlbGwgPSB0aGlzLmNlbGxzW2xhc3RQb3MueV1bbGFzdFBvcy54XTsgLy8g5LiK5LiA5qyh54K55Ye755qE5qC85byPXG4gICAgICAgIHRoaXMuZXhjaGFuZ2VDZWxsKGxhc3RQb3MsIHBvcyk7XG4gICAgICAgIHZhciByZXN1bHQxID0gdGhpcy5jaGVja1BvaW50KHBvcy54LCBwb3MueSlbMF07XG4gICAgICAgIHZhciByZXN1bHQyID0gdGhpcy5jaGVja1BvaW50KGxhc3RQb3MueCwgbGFzdFBvcy55KVswXTtcbiAgICAgICAgdGhpcy5jdXJUaW1lID0gMDsgLy8g5Yqo55S75pKt5pS+55qE5b2T5YmN5pe26Ze0XG4gICAgICAgIHRoaXMucHVzaFRvQ2hhbmdlTW9kZWxzKGN1ckNsaWNrQ2VsbCk7XG4gICAgICAgIHRoaXMucHVzaFRvQ2hhbmdlTW9kZWxzKGxhc3RDbGlja0NlbGwpO1xuICAgICAgICBsZXQgaXNDYW5Cb21iID0gKGN1ckNsaWNrQ2VsbC5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OICYmIC8vIOWIpOaWreS4pOS4quaYr+WQpuaYr+eJueauiueahOWKqOeJqVxuICAgICAgICAgICAgbGFzdENsaWNrQ2VsbC5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OKSB8fFxuICAgICAgICAgICAgY3VyQ2xpY2tDZWxsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEIHx8XG4gICAgICAgICAgICBsYXN0Q2xpY2tDZWxsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEO1xuICAgICAgICBpZiAocmVzdWx0MS5sZW5ndGggPCAzICYmIHJlc3VsdDIubGVuZ3RoIDwgMyAmJiAhaXNDYW5Cb21iKSB7Ly/kuI3kvJrlj5HnlJ/mtojpmaTnmoTmg4XlhrVcbiAgICAgICAgICAgIHRoaXMuZXhjaGFuZ2VDZWxsKGxhc3RQb3MsIHBvcyk7XG4gICAgICAgICAgICBjdXJDbGlja0NlbGwubW92ZVRvQW5kQmFjayhsYXN0UG9zKTtcbiAgICAgICAgICAgIGxhc3RDbGlja0NlbGwubW92ZVRvQW5kQmFjayhwb3MpO1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zID0gY2MudjIoLTEsIC0xKTtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5jaGFuZ2VNb2RlbHNdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zID0gY2MudjIoLTEsIC0xKTtcbiAgICAgICAgICAgIGN1ckNsaWNrQ2VsbC5tb3ZlVG8obGFzdFBvcywgdGhpcy5jdXJUaW1lKTtcbiAgICAgICAgICAgIGxhc3RDbGlja0NlbGwubW92ZVRvKHBvcywgdGhpcy5jdXJUaW1lKTtcbiAgICAgICAgICAgIHZhciBjaGVja1BvaW50ID0gW3BvcywgbGFzdFBvc107XG4gICAgICAgICAgICB0aGlzLmN1clRpbWUgKz0gQU5JVElNRS5UT1VDSF9NT1ZFO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ3J1c2goY2hlY2tQb2ludCk7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuY2hhbmdlTW9kZWxzLCB0aGlzLmVmZmVjdHNRdWV1ZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g5raI6ZmkXG4gICAgcHJvY2Vzc0NydXNoKGNoZWNrUG9pbnQpIHtcbiAgICAgICAgbGV0IGN5Y2xlQ291bnQgPSAwO1xuICAgICAgICB3aGlsZSAoY2hlY2tQb2ludC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgYm9tYk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgaWYgKGN5Y2xlQ291bnQgPT0gMCAmJiBjaGVja1BvaW50Lmxlbmd0aCA9PSAyKSB7IC8v54m55q6K5raI6ZmkXG4gICAgICAgICAgICAgICAgbGV0IHBvczEgPSBjaGVja1BvaW50WzBdO1xuICAgICAgICAgICAgICAgIGxldCBwb3MyID0gY2hlY2tQb2ludFsxXTtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwxID0gdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF07XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsMiA9IHRoaXMuY2VsbHNbcG9zMi55XVtwb3MyLnhdO1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbDEuc3RhdHVzID09IENFTExfU1RBVFVTLkJJUkQgfHwgbW9kZWwyLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBib21iTW9kZWwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwxLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDEudHlwZSA9IG1vZGVsMi50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9tYk1vZGVscy5wdXNoKG1vZGVsMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDIudHlwZSA9IG1vZGVsMS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9tYk1vZGVscy5wdXNoKG1vZGVsMik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY2hlY2tQb2ludCkge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBjaGVja1BvaW50W2ldO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jZWxsc1twb3MueV1bcG9zLnhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgW3Jlc3VsdCwgbmV3Q2VsbFN0YXR1cywgbmV3Q2VsbFR5cGVdID0gdGhpcy5jaGVja1BvaW50KHBvcy54LCBwb3MueSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2VsbHNbcmVzdWx0W2pdLnldW3Jlc3VsdFtqXS54XTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcnVzaENlbGwocmVzdWx0W2pdLngsIHJlc3VsdFtqXS55LCBmYWxzZSwgY3ljbGVDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib21iTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3Q2VsbChwb3MsIG5ld0NlbGxTdGF0dXMsIG5ld0NlbGxUeXBlKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQm9tYihib21iTW9kZWxzLCBjeWNsZUNvdW50KTtcbiAgICAgICAgICAgIHRoaXMuY3VyVGltZSArPSBBTklUSU1FLkRJRTtcbiAgICAgICAgICAgIGNoZWNrUG9pbnQgPSB0aGlzLmRvd24oKTtcbiAgICAgICAgICAgIGN5Y2xlQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8v55Sf5oiQ5pawY2VsbFxuICAgIGNyZWF0ZU5ld0NlbGwocG9zLCBzdGF0dXMsIHR5cGUpIHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICB0eXBlID0gQ0VMTF9UWVBFLkJJUkRcbiAgICAgICAgfVxuICAgICAgICBsZXQgbW9kZWwgPSBuZXcgQ2VsbE1vZGVsKCk7XG4gICAgICAgIHRoaXMuY2VsbHNbcG9zLnldW3Bvcy54XSA9IG1vZGVsXG4gICAgICAgIG1vZGVsLmluaXQodHlwZSk7XG4gICAgICAgIG1vZGVsLnNldFN0YXJ0WFkocG9zLngsIHBvcy55KTtcbiAgICAgICAgbW9kZWwuc2V0WFkocG9zLngsIHBvcy55KTtcbiAgICAgICAgbW9kZWwuc2V0U3RhdHVzKHN0YXR1cyk7XG4gICAgICAgIG1vZGVsLnNldFZpc2libGUoMCwgZmFsc2UpO1xuICAgICAgICBtb2RlbC5zZXRWaXNpYmxlKHRoaXMuY3VyVGltZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuY2hhbmdlTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgIH1cbiAgICAvLyDkuIvokL1cbiAgICBkb3duKCkge1xuICAgICAgICBsZXQgbmV3Q2hlY2tQb2ludCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBHUklEX1dJRFRIOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAxOyBqIDw9IEdSSURfSEVJR0hUOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVtqXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJSb3cgPSBpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gY3VyUm93OyBrIDw9IEdSSURfSEVJR0hUOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW2tdW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoVG9DaGFuZ2VNb2RlbHModGhpcy5jZWxsc1trXVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2hlY2tQb2ludC5wdXNoKHRoaXMuY2VsbHNba11bal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbY3VyUm93XVtqXSA9IHRoaXMuY2VsbHNba11bal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tjdXJSb3ddW2pdLnNldFhZKGosIGN1clJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tjdXJSb3ddW2pdLm1vdmVUbyhjYy52MihqLCBjdXJSb3cpLCB0aGlzLmN1clRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clJvdysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSBjdXJSb3c7IGsgPD0gR1JJRF9IRUlHSFQ7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXSA9IG5ldyBDZWxsTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNba11bal0uaW5pdCh0aGlzLmdldFJhbmRvbUNlbGxUeXBlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXS5zZXRTdGFydFhZKGosIGNvdW50ICsgR1JJRF9IRUlHSFQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXS5zZXRYWShqLCBjb3VudCArIEdSSURfSEVJR0hUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNba11bal0ubW92ZVRvKGNjLnYyKGosIGspLCB0aGlzLmN1clRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlTW9kZWxzLnB1c2godGhpcy5jZWxsc1trXVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDaGVja1BvaW50LnB1c2godGhpcy5jZWxsc1trXVtqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1clRpbWUgKz0gQU5JVElNRS5UT1VDSF9NT1ZFICsgMC4zXG4gICAgICAgIHJldHVybiBuZXdDaGVja1BvaW50O1xuICAgIH1cblxuICAgIHB1c2hUb0NoYW5nZU1vZGVscyhtb2RlbCkge1xuICAgICAgICBpZiAodGhpcy5jaGFuZ2VNb2RlbHMuaW5kZXhPZihtb2RlbCkgIT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYW5nZU1vZGVscy5wdXNoKG1vZGVsKTtcbiAgICB9XG5cbiAgICBjbGVhbkNtZCgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gR1JJRF9XSURUSDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBHUklEX0hFSUdIVDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2VsbHNbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXS5jbWQgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleGNoYW5nZUNlbGwocG9zMSwgcG9zMikge1xuICAgICAgICB2YXIgdG1wTW9kZWwgPSB0aGlzLmNlbGxzW3BvczEueV1bcG9zMS54XTtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF0gPSB0aGlzLmNlbGxzW3BvczIueV1bcG9zMi54XTtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF0ueCA9IHBvczEueDtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF0ueSA9IHBvczEueTtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MyLnldW3BvczIueF0gPSB0bXBNb2RlbDtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MyLnldW3BvczIueF0ueCA9IHBvczIueDtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MyLnldW3BvczIueF0ueSA9IHBvczIueTtcbiAgICB9XG4gICAgLy8g6K6+572u56eN57G7XG4gICAgLy8gVG9kbyDmlLnmiJDkubHluo/nrpfms5VcbiAgICBzZXRDZWxsVHlwZU51bShudW0pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJudW0gPSBcIiwgbnVtKTtcbiAgICAgICAgdGhpcy5jZWxsVHlwZU51bSA9IG51bTtcbiAgICAgICAgdGhpcy5jZWxsQ3JlYXRlVHlwZSA9IFtdO1xuICAgICAgICBsZXQgY3JlYXRlVHlwZUxpc3QgPSB0aGlzLmNlbGxDcmVhdGVUeXBlO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBDRUxMX0JBU0VOVU07IGkrKykge1xuICAgICAgICAgICAgY3JlYXRlVHlwZUxpc3QucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNyZWF0ZVR5cGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoQ0VMTF9CQVNFTlVNIC0gaSkpICsgaTtcbiAgICAgICAgICAgIGNyZWF0ZVR5cGVMaXN0W2ldLCBjcmVhdGVUeXBlTGlzdFtpbmRleF0gPSBjcmVhdGVUeXBlTGlzdFtpbmRleF0sIGNyZWF0ZVR5cGVMaXN0W2ldXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g6ZqP6KaB55Sf5oiQ5LiA5Liq57G75Z6LXG4gICAgZ2V0UmFuZG9tQ2VsbFR5cGUoKSB7XG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2VsbFR5cGVOdW0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxsQ3JlYXRlVHlwZVtpbmRleF07XG4gICAgfVxuICAgIC8vIFRPRE8gYm9tYk1vZGVsc+WOu+mHjVxuICAgIHByb2Nlc3NCb21iKGJvbWJNb2RlbHMsIGN5Y2xlQ291bnQpIHtcbiAgICAgICAgd2hpbGUgKGJvbWJNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IG5ld0JvbWJNb2RlbCA9IFtdO1xuICAgICAgICAgICAgbGV0IGJvbWJUaW1lID0gQU5JVElNRS5CT01CX0RFTEFZO1xuICAgICAgICAgICAgYm9tYk1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbC5zdGF0dXMgPT0gQ0VMTF9TVEFUVVMuTElORSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX1dJRFRIOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW21vZGVsLnldW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2VsbHNbbW9kZWwueV1baV0uc3RhdHVzICE9IENFTExfU1RBVFVTLkNPTU1PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCb21iTW9kZWwucHVzaCh0aGlzLmNlbGxzW21vZGVsLnldW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcnVzaENlbGwoaSwgbW9kZWwueSwgZmFsc2UsIGN5Y2xlQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUm93Qm9tYih0aGlzLmN1clRpbWUsIGNjLnYyKG1vZGVsLngsIG1vZGVsLnkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZWwuc3RhdHVzID09IENFTExfU1RBVFVTLkNPTFVNTikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX0hFSUdIVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVttb2RlbC54XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW2ldW21vZGVsLnhdLnN0YXR1cyAhPSBDRUxMX1NUQVRVUy5DT01NT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Qm9tYk1vZGVsLnB1c2godGhpcy5jZWxsc1tpXVttb2RlbC54XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3J1c2hDZWxsKG1vZGVsLngsIGksIGZhbHNlLCBjeWNsZUNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENvbEJvbWIodGhpcy5jdXJUaW1lLCBjYy52Mihtb2RlbC54LCBtb2RlbC55KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGVsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5XUkFQKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4ID0gbW9kZWwueDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkgPSBtb2RlbC55O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX0hFSUdIVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBHUklEX1dJRFRIOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVsdGEgPSBNYXRoLmFicyh4IC0gaikgKyBNYXRoLmFicyh5IC0gaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2VsbHNbaV1bal0gJiYgZGVsdGEgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVtqXS5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCb21iTW9kZWwucHVzaCh0aGlzLmNlbGxzW2ldW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNydXNoQ2VsbChqLCBpLCBmYWxzZSwgY3ljbGVDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGVsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjcnVzaFR5cGUgPSBtb2RlbC50eXBlXG4gICAgICAgICAgICAgICAgICAgIGlmIChib21iVGltZSA8IEFOSVRJTUUuQk9NQl9CSVJEX0RFTEFZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib21iVGltZSA9IEFOSVRJTUUuQk9NQl9CSVJEX0RFTEFZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjcnVzaFR5cGUgPT0gQ0VMTF9UWVBFLkJJUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNydXNoVHlwZSA9IHRoaXMuZ2V0UmFuZG9tQ2VsbFR5cGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX0hFSUdIVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBHUklEX1dJRFRIOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVtqXSAmJiB0aGlzLmNlbGxzW2ldW2pdLnR5cGUgPT0gY3J1c2hUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW2ldW2pdLnN0YXR1cyAhPSBDRUxMX1NUQVRVUy5DT01NT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0JvbWJNb2RlbC5wdXNoKHRoaXMuY2VsbHNbaV1bal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3J1c2hDZWxsKGosIGksIHRydWUsIGN5Y2xlQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuY3J1c2hDZWxsKG1vZGVsLngsIG1vZGVsLnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgaWYgKGJvbWJNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VyVGltZSArPSBib21iVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvbWJNb2RlbHMgPSBuZXdCb21iTW9kZWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHvlvIDlp4vmkq3mlL7nmoTml7bpl7R9IHBsYXlUaW1lIFxuICAgICAqIEBwYXJhbSB7KmNlbGzkvY3nva59IHBvcyBcbiAgICAgKiBAcGFyYW0geyrnrKzlh6DmrKHmtojpmaTvvIznlKjkuo7mkq3mlL7pn7PmlYh9IHN0ZXAgXG4gICAgICovXG4gICAgYWRkQ3J1c2hFZmZlY3QocGxheVRpbWUsIHBvcywgc3RlcCkge1xuICAgICAgICB0aGlzLmVmZmVjdHNRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIHBsYXlUaW1lLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgYWN0aW9uOiBcImNydXNoXCIsXG4gICAgICAgICAgICBzdGVwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZFJvd0JvbWIocGxheVRpbWUsIHBvcykge1xuICAgICAgICB0aGlzLmVmZmVjdHNRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIHBsYXlUaW1lLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgYWN0aW9uOiBcInJvd0JvbWJcIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRDb2xCb21iKHBsYXlUaW1lLCBwb3MpIHtcbiAgICAgICAgdGhpcy5lZmZlY3RzUXVldWUucHVzaCh7XG4gICAgICAgICAgICBwbGF5VGltZSxcbiAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICAgIGFjdGlvbjogXCJjb2xCb21iXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkV3JhcEJvbWIocGxheVRpbWUsIHBvcykge1xuICAgICAgICAvLyBUT0RPXG4gICAgfVxuICAgIC8vIGNlbGzmtojpmaTpgLvovpFcbiAgICBjcnVzaENlbGwoeCwgeSwgbmVlZFNoYWtlLCBzdGVwKSB7XG4gICAgICAgIGxldCBtb2RlbCA9IHRoaXMuY2VsbHNbeV1beF07XG4gICAgICAgIHRoaXMucHVzaFRvQ2hhbmdlTW9kZWxzKG1vZGVsKTtcbiAgICAgICAgaWYgKG5lZWRTaGFrZSkge1xuICAgICAgICAgICAgbW9kZWwudG9TaGFrZSh0aGlzLmN1clRpbWUpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2hha2VUaW1lID0gbmVlZFNoYWtlID8gQU5JVElNRS5ESUVfU0hBS0UgOiAwO1xuICAgICAgICBtb2RlbC50b0RpZSh0aGlzLmN1clRpbWUgKyBzaGFrZVRpbWUpO1xuICAgICAgICB0aGlzLmFkZENydXNoRWZmZWN0KHRoaXMuY3VyVGltZSArIHNoYWtlVGltZSwgY2MudjIobW9kZWwueCwgbW9kZWwueSksIHN0ZXApO1xuICAgICAgICB0aGlzLmNlbGxzW3ldW3hdID0gbnVsbDtcbiAgICB9XG5cbn1cblxuIl19