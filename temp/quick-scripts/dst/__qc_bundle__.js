
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Script/Controller/GameController');
require('./assets/Script/Controller/LoginController');
require('./assets/Script/Model/CellModel');
require('./assets/Script/Model/ConstValue');
require('./assets/Script/Model/GameModel');
require('./assets/Script/UnitTest/GameModelTest');
require('./assets/Script/Utils/AudioUtils');
require('./assets/Script/View/CellView');
require('./assets/Script/View/EffectLayer');
require('./assets/Script/View/GridView');
require('./assets/migration/use_v2.0.x_cc.Toggle_event');

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
//------QC-SOURCE-SPLIT------

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kZWwvR2FtZU1vZGVsLmpzIl0sIm5hbWVzIjpbIkdhbWVNb2RlbCIsImNlbGxzIiwiY2VsbEJncyIsImxhc3RQb3MiLCJjYyIsInYyIiwiY2VsbFR5cGVOdW0iLCJjZWxsQ3JlYXRlVHlwZSIsImluaXQiLCJzZXRDZWxsVHlwZU51bSIsImkiLCJHUklEX1dJRFRIIiwiaiIsIkdSSURfSEVJR0hUIiwiQ2VsbE1vZGVsIiwiZmxhZyIsImdldFJhbmRvbUNlbGxUeXBlIiwicmVzdWx0IiwiY2hlY2tQb2ludCIsImxlbmd0aCIsInNldFhZIiwic2V0U3RhcnRYWSIsImluaXRXaXRoRGF0YSIsImRhdGEiLCJ4IiwieSIsImNoZWNrV2l0aERpcmVjdGlvbiIsImRpcmVjdGlvbiIsInF1ZXVlIiwidmlzIiwicHVzaCIsImZyb250IiwicG9pbnQiLCJjZWxsTW9kZWwiLCJ0bXBYIiwidG1wWSIsInR5cGUiLCJyb3dSZXN1bHQiLCJjYWxsIiwiY29sUmVzdWx0IiwibmV3Q2VsbFN0YXR1cyIsIkNFTExfU1RBVFVTIiwiQklSRCIsIldSQVAiLCJMSU5FIiwiQ09MVU1OIiwidG1wIiwiY29uY2F0IiwiZm9yRWFjaCIsIm5ld0VsZSIsIm9sZEVsZSIsInByaW50SW5mbyIsInByaW50U3RyIiwiY29uc29sZSIsImxvZyIsImdldENlbGxzIiwic2VsZWN0Q2VsbCIsInBvcyIsImNoYW5nZU1vZGVscyIsImVmZmVjdHNRdWV1ZSIsImRlbHRhIiwiTWF0aCIsImFicyIsImN1ckNsaWNrQ2VsbCIsImxhc3RDbGlja0NlbGwiLCJleGNoYW5nZUNlbGwiLCJyZXN1bHQxIiwicmVzdWx0MiIsImN1clRpbWUiLCJwdXNoVG9DaGFuZ2VNb2RlbHMiLCJpc0NhbkJvbWIiLCJzdGF0dXMiLCJDT01NT04iLCJtb3ZlVG9BbmRCYWNrIiwibW92ZVRvIiwiQU5JVElNRSIsIlRPVUNIX01PVkUiLCJwcm9jZXNzQ3J1c2giLCJjeWNsZUNvdW50IiwiYm9tYk1vZGVscyIsInBvczEiLCJwb3MyIiwibW9kZWwxIiwibW9kZWwyIiwiYm9tYk1vZGVsIiwibmV3Q2VsbFR5cGUiLCJtb2RlbCIsImNydXNoQ2VsbCIsImNyZWF0ZU5ld0NlbGwiLCJwcm9jZXNzQm9tYiIsIkRJRSIsImRvd24iLCJDRUxMX1RZUEUiLCJzZXRTdGF0dXMiLCJzZXRWaXNpYmxlIiwibmV3Q2hlY2tQb2ludCIsImN1clJvdyIsImsiLCJjb3VudCIsImluZGV4T2YiLCJjbGVhbkNtZCIsImNtZCIsInRtcE1vZGVsIiwibnVtIiwiY3JlYXRlVHlwZUxpc3QiLCJDRUxMX0JBU0VOVU0iLCJpbmRleCIsImZsb29yIiwicmFuZG9tIiwibmV3Qm9tYk1vZGVsIiwiYm9tYlRpbWUiLCJCT01CX0RFTEFZIiwiYWRkUm93Qm9tYiIsImFkZENvbEJvbWIiLCJjcnVzaFR5cGUiLCJCT01CX0JJUkRfREVMQVkiLCJhZGRDcnVzaEVmZmVjdCIsInBsYXlUaW1lIiwic3RlcCIsImFjdGlvbiIsImFkZFdyYXBCb21iIiwibmVlZFNoYWtlIiwidG9TaGFrZSIsInNoYWtlVGltZSIsIkRJRV9TSEFLRSIsInRvRGllIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0lBRXFCQTtBQUNqQix1QkFBYztBQUNWLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxTQUFLQyxPQUFMLEdBQWVDLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNLENBQUMsQ0FBUCxFQUFVLENBQUMsQ0FBWCxDQUFmO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixDQUFuQjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsRUFBdEIsQ0FMVSxDQUtnQjtBQUM3Qjs7OztTQUVEQyxPQUFBLGNBQUtGLFdBQUwsRUFBa0I7QUFDZCxTQUFLTCxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUtRLGNBQUwsQ0FBb0JILFdBQVcsSUFBSSxLQUFLQSxXQUF4Qzs7QUFDQSxTQUFLLElBQUlJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLElBQUlDLHNCQUFyQixFQUFpQ0QsQ0FBQyxFQUFsQyxFQUFzQztBQUNsQyxXQUFLVCxLQUFMLENBQVdTLENBQVgsSUFBZ0IsRUFBaEI7O0FBQ0EsV0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxJQUFJQyx1QkFBckIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsYUFBS1gsS0FBTCxDQUFXUyxDQUFYLEVBQWNFLENBQWQsSUFBbUIsSUFBSUUscUJBQUosRUFBbkI7QUFDSDtBQUNKOztBQUVELFNBQUssSUFBSUosQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSUMsc0JBQXJCLEVBQWlDRCxDQUFDLEVBQWxDLEVBQXNDO0FBQ2xDLFdBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSUMsdUJBQXJCLEVBQWtDRCxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFlBQUlHLElBQUksR0FBRyxJQUFYOztBQUNBLGVBQU9BLElBQVAsRUFBYTtBQUNUQSxVQUFBQSxJQUFJLEdBQUcsS0FBUDtBQUNBLGVBQUtkLEtBQUwsQ0FBV1MsQ0FBWCxFQUFjRSxDQUFkLEVBQWlCSixJQUFqQixDQUFzQixLQUFLUSxpQkFBTCxFQUF0QjtBQUNBLGNBQUlDLE1BQU0sR0FBRyxLQUFLQyxVQUFMLENBQWdCTixDQUFoQixFQUFtQkYsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBYjs7QUFDQSxjQUFJTyxNQUFNLENBQUNFLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDbkJKLFlBQUFBLElBQUksR0FBRyxJQUFQO0FBQ0g7O0FBQ0QsZUFBS2QsS0FBTCxDQUFXUyxDQUFYLEVBQWNFLENBQWQsRUFBaUJRLEtBQWpCLENBQXVCUixDQUF2QixFQUEwQkYsQ0FBMUI7QUFDQSxlQUFLVCxLQUFMLENBQVdTLENBQVgsRUFBY0UsQ0FBZCxFQUFpQlMsVUFBakIsQ0FBNEJULENBQTVCLEVBQStCRixDQUEvQjtBQUNIO0FBQ0o7QUFDSjtBQUVKOztTQUVEWSxlQUFBLHNCQUFhQyxJQUFiLEVBQW1CLENBQ2Y7QUFDSDs7U0FFREwsYUFBQSxvQkFBV00sQ0FBWCxFQUFjQyxDQUFkLEVBQWlCO0FBQ2IsUUFBSUMsa0JBQWtCLEdBQUcsU0FBckJBLGtCQUFxQixDQUFVRixDQUFWLEVBQWFDLENBQWIsRUFBZ0JFLFNBQWhCLEVBQTJCO0FBQ2hELFVBQUlDLEtBQUssR0FBRyxFQUFaO0FBQ0EsVUFBSUMsR0FBRyxHQUFHLEVBQVY7QUFDQUEsTUFBQUEsR0FBRyxDQUFDTCxDQUFDLEdBQUdDLENBQUMsR0FBRyxDQUFULENBQUgsR0FBaUIsSUFBakI7QUFDQUcsTUFBQUEsS0FBSyxDQUFDRSxJQUFOLENBQVcxQixFQUFFLENBQUNDLEVBQUgsQ0FBTW1CLENBQU4sRUFBU0MsQ0FBVCxDQUFYO0FBQ0EsVUFBSU0sS0FBSyxHQUFHLENBQVo7O0FBQ0EsYUFBT0EsS0FBSyxHQUFHSCxLQUFLLENBQUNULE1BQXJCLEVBQTZCO0FBQ3pCO0FBQ0EsWUFBSWEsS0FBSyxHQUFHSixLQUFLLENBQUNHLEtBQUQsQ0FBakI7QUFDQSxZQUFJRSxTQUFTLEdBQUcsS0FBS2hDLEtBQUwsQ0FBVytCLEtBQUssQ0FBQ1AsQ0FBakIsRUFBb0JPLEtBQUssQ0FBQ1IsQ0FBMUIsQ0FBaEI7QUFDQU8sUUFBQUEsS0FBSzs7QUFDTCxZQUFJLENBQUNFLFNBQUwsRUFBZ0I7QUFDWjtBQUNIOztBQUNELGFBQUssSUFBSXZCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdpQixTQUFTLENBQUNSLE1BQTlCLEVBQXNDVCxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLGNBQUl3QixJQUFJLEdBQUdGLEtBQUssQ0FBQ1IsQ0FBTixHQUFVRyxTQUFTLENBQUNqQixDQUFELENBQVQsQ0FBYWMsQ0FBbEM7QUFDQSxjQUFJVyxJQUFJLEdBQUdILEtBQUssQ0FBQ1AsQ0FBTixHQUFVRSxTQUFTLENBQUNqQixDQUFELENBQVQsQ0FBYWUsQ0FBbEM7O0FBQ0EsY0FBSVMsSUFBSSxHQUFHLENBQVAsSUFBWUEsSUFBSSxHQUFHLENBQW5CLElBQ0dDLElBQUksR0FBRyxDQURWLElBQ2VBLElBQUksR0FBRyxDQUR0QixJQUVHTixHQUFHLENBQUNLLElBQUksR0FBR0MsSUFBSSxHQUFHLENBQWYsQ0FGTixJQUdHLENBQUMsS0FBS2xDLEtBQUwsQ0FBV2tDLElBQVgsRUFBaUJELElBQWpCLENBSFIsRUFHZ0M7QUFDNUI7QUFDSDs7QUFDRCxjQUFJRCxTQUFTLENBQUNHLElBQVYsSUFBa0IsS0FBS25DLEtBQUwsQ0FBV2tDLElBQVgsRUFBaUJELElBQWpCLEVBQXVCRSxJQUE3QyxFQUFtRDtBQUMvQ1AsWUFBQUEsR0FBRyxDQUFDSyxJQUFJLEdBQUdDLElBQUksR0FBRyxDQUFmLENBQUgsR0FBdUIsSUFBdkI7QUFDQVAsWUFBQUEsS0FBSyxDQUFDRSxJQUFOLENBQVcxQixFQUFFLENBQUNDLEVBQUgsQ0FBTTZCLElBQU4sRUFBWUMsSUFBWixDQUFYO0FBQ0g7QUFDSjtBQUNKOztBQUNELGFBQU9QLEtBQVA7QUFDSCxLQTlCRDs7QUErQkEsUUFBSVMsU0FBUyxHQUFHWCxrQkFBa0IsQ0FBQ1ksSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJkLENBQTlCLEVBQWlDQyxDQUFqQyxFQUFvQyxDQUFDckIsRUFBRSxDQUFDQyxFQUFILENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBRCxFQUFjRCxFQUFFLENBQUNDLEVBQUgsQ0FBTSxDQUFDLENBQVAsRUFBVSxDQUFWLENBQWQsQ0FBcEMsQ0FBaEI7QUFDQSxRQUFJa0MsU0FBUyxHQUFHYixrQkFBa0IsQ0FBQ1ksSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJkLENBQTlCLEVBQWlDQyxDQUFqQyxFQUFvQyxDQUFDckIsRUFBRSxDQUFDQyxFQUFILENBQU0sQ0FBTixFQUFTLENBQUMsQ0FBVixDQUFELEVBQWVELEVBQUUsQ0FBQ0MsRUFBSCxDQUFNLENBQU4sRUFBUyxDQUFULENBQWYsQ0FBcEMsQ0FBaEI7QUFDQSxRQUFJWSxNQUFNLEdBQUcsRUFBYjtBQUNBLFFBQUl1QixhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsUUFBSUgsU0FBUyxDQUFDbEIsTUFBVixJQUFvQixDQUFwQixJQUF5Qm9CLFNBQVMsQ0FBQ3BCLE1BQVYsSUFBb0IsQ0FBakQsRUFBb0Q7QUFDaERxQixNQUFBQSxhQUFhLEdBQUdDLHdCQUFZQyxJQUE1QjtBQUNILEtBRkQsTUFHSyxJQUFJTCxTQUFTLENBQUNsQixNQUFWLElBQW9CLENBQXBCLElBQXlCb0IsU0FBUyxDQUFDcEIsTUFBVixJQUFvQixDQUFqRCxFQUFvRDtBQUNyRHFCLE1BQUFBLGFBQWEsR0FBR0Msd0JBQVlFLElBQTVCO0FBQ0gsS0FGSSxNQUdBLElBQUlOLFNBQVMsQ0FBQ2xCLE1BQVYsSUFBb0IsQ0FBeEIsRUFBMkI7QUFDNUJxQixNQUFBQSxhQUFhLEdBQUdDLHdCQUFZRyxJQUE1QjtBQUNILEtBRkksTUFHQSxJQUFJTCxTQUFTLENBQUNwQixNQUFWLElBQW9CLENBQXhCLEVBQTJCO0FBQzVCcUIsTUFBQUEsYUFBYSxHQUFHQyx3QkFBWUksTUFBNUI7QUFDSDs7QUFDRCxRQUFJUixTQUFTLENBQUNsQixNQUFWLElBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCRixNQUFBQSxNQUFNLEdBQUdvQixTQUFUO0FBQ0g7O0FBQ0QsUUFBSUUsU0FBUyxDQUFDcEIsTUFBVixJQUFvQixDQUF4QixFQUEyQjtBQUN2QixVQUFJMkIsR0FBRyxHQUFHN0IsTUFBTSxDQUFDOEIsTUFBUCxFQUFWO0FBQ0FSLE1BQUFBLFNBQVMsQ0FBQ1MsT0FBVixDQUFrQixVQUFVQyxNQUFWLEVBQWtCO0FBQ2hDLFlBQUlsQyxJQUFJLEdBQUcsS0FBWDtBQUNBK0IsUUFBQUEsR0FBRyxDQUFDRSxPQUFKLENBQVksVUFBVUUsTUFBVixFQUFrQjtBQUMxQixjQUFJRCxNQUFNLENBQUN6QixDQUFQLElBQVkwQixNQUFNLENBQUMxQixDQUFuQixJQUF3QnlCLE1BQU0sQ0FBQ3hCLENBQVAsSUFBWXlCLE1BQU0sQ0FBQ3pCLENBQS9DLEVBQWtEO0FBQzlDVixZQUFBQSxJQUFJLEdBQUcsSUFBUDtBQUNIO0FBQ0osU0FKRCxFQUlHLElBSkg7O0FBS0EsWUFBSSxDQUFDQSxJQUFMLEVBQVc7QUFDUEUsVUFBQUEsTUFBTSxDQUFDYSxJQUFQLENBQVltQixNQUFaO0FBQ0g7QUFDSixPQVZELEVBVUcsSUFWSDtBQVdIOztBQUNELFdBQU8sQ0FBQ2hDLE1BQUQsRUFBU3VCLGFBQVQsRUFBd0IsS0FBS3ZDLEtBQUwsQ0FBV3dCLENBQVgsRUFBY0QsQ0FBZCxFQUFpQlksSUFBekMsQ0FBUDtBQUNIOztTQUVEZSxZQUFBLHFCQUFZO0FBQ1IsU0FBSyxJQUFJekMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSSxDQUFyQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUN6QixVQUFJMEMsUUFBUSxHQUFHLEVBQWY7O0FBQ0EsV0FBSyxJQUFJeEMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSSxDQUFyQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUN6QndDLFFBQUFBLFFBQVEsSUFBSSxLQUFLbkQsS0FBTCxDQUFXUyxDQUFYLEVBQWNFLENBQWQsRUFBaUJ3QixJQUFqQixHQUF3QixHQUFwQztBQUNIOztBQUNEaUIsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLFFBQVo7QUFDSDtBQUNKOztTQUVERyxXQUFBLG9CQUFXO0FBQ1AsV0FBTyxLQUFLdEQsS0FBWjtBQUNILElBQ0Q7QUFDQTs7O1NBQ0F1RCxhQUFBLG9CQUFXQyxHQUFYLEVBQWdCO0FBQ1osU0FBS0MsWUFBTCxHQUFvQixFQUFwQixDQURZLENBQ1c7O0FBQ3ZCLFNBQUtDLFlBQUwsR0FBb0IsRUFBcEIsQ0FGWSxDQUVZOztBQUN4QixRQUFJeEQsT0FBTyxHQUFHLEtBQUtBLE9BQW5CO0FBQ0EsUUFBSXlELEtBQUssR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNMLEdBQUcsQ0FBQ2pDLENBQUosR0FBUXJCLE9BQU8sQ0FBQ3FCLENBQXpCLElBQThCcUMsSUFBSSxDQUFDQyxHQUFMLENBQVNMLEdBQUcsQ0FBQ2hDLENBQUosR0FBUXRCLE9BQU8sQ0FBQ3NCLENBQXpCLENBQTFDOztBQUNBLFFBQUltQyxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUFFO0FBQ2QsV0FBS3pELE9BQUwsR0FBZXNELEdBQWY7QUFDQSxhQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FBUDtBQUNIOztBQUNELFFBQUlNLFlBQVksR0FBRyxLQUFLOUQsS0FBTCxDQUFXd0QsR0FBRyxDQUFDaEMsQ0FBZixFQUFrQmdDLEdBQUcsQ0FBQ2pDLENBQXRCLENBQW5CLENBVFksQ0FTaUM7O0FBQzdDLFFBQUl3QyxhQUFhLEdBQUcsS0FBSy9ELEtBQUwsQ0FBV0UsT0FBTyxDQUFDc0IsQ0FBbkIsRUFBc0J0QixPQUFPLENBQUNxQixDQUE5QixDQUFwQixDQVZZLENBVTBDOztBQUN0RCxTQUFLeUMsWUFBTCxDQUFrQjlELE9BQWxCLEVBQTJCc0QsR0FBM0I7QUFDQSxRQUFJUyxPQUFPLEdBQUcsS0FBS2hELFVBQUwsQ0FBZ0J1QyxHQUFHLENBQUNqQyxDQUFwQixFQUF1QmlDLEdBQUcsQ0FBQ2hDLENBQTNCLEVBQThCLENBQTlCLENBQWQ7QUFDQSxRQUFJMEMsT0FBTyxHQUFHLEtBQUtqRCxVQUFMLENBQWdCZixPQUFPLENBQUNxQixDQUF4QixFQUEyQnJCLE9BQU8sQ0FBQ3NCLENBQW5DLEVBQXNDLENBQXRDLENBQWQ7QUFDQSxTQUFLMkMsT0FBTCxHQUFlLENBQWYsQ0FkWSxDQWNNOztBQUNsQixTQUFLQyxrQkFBTCxDQUF3Qk4sWUFBeEI7QUFDQSxTQUFLTSxrQkFBTCxDQUF3QkwsYUFBeEI7QUFDQSxRQUFJTSxTQUFTLEdBQUlQLFlBQVksQ0FBQ1EsTUFBYixJQUF1QjlCLHdCQUFZK0IsTUFBbkMsSUFBNkM7QUFDMURSLElBQUFBLGFBQWEsQ0FBQ08sTUFBZCxJQUF3QjlCLHdCQUFZK0IsTUFEeEIsSUFFWlQsWUFBWSxDQUFDUSxNQUFiLElBQXVCOUIsd0JBQVlDLElBRnZCLElBR1pzQixhQUFhLENBQUNPLE1BQWQsSUFBd0I5Qix3QkFBWUMsSUFIeEM7O0FBSUEsUUFBSXdCLE9BQU8sQ0FBQy9DLE1BQVIsR0FBaUIsQ0FBakIsSUFBc0JnRCxPQUFPLENBQUNoRCxNQUFSLEdBQWlCLENBQXZDLElBQTRDLENBQUNtRCxTQUFqRCxFQUE0RDtBQUFDO0FBQ3pELFdBQUtMLFlBQUwsQ0FBa0I5RCxPQUFsQixFQUEyQnNELEdBQTNCO0FBQ0FNLE1BQUFBLFlBQVksQ0FBQ1UsYUFBYixDQUEyQnRFLE9BQTNCO0FBQ0E2RCxNQUFBQSxhQUFhLENBQUNTLGFBQWQsQ0FBNEJoQixHQUE1QjtBQUNBLFdBQUt0RCxPQUFMLEdBQWVDLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNLENBQUMsQ0FBUCxFQUFVLENBQUMsQ0FBWCxDQUFmO0FBQ0EsYUFBTyxDQUFDLEtBQUtxRCxZQUFOLENBQVA7QUFDSCxLQU5ELE1BT0s7QUFDRCxXQUFLdkQsT0FBTCxHQUFlQyxFQUFFLENBQUNDLEVBQUgsQ0FBTSxDQUFDLENBQVAsRUFBVSxDQUFDLENBQVgsQ0FBZjtBQUNBMEQsTUFBQUEsWUFBWSxDQUFDVyxNQUFiLENBQW9CdkUsT0FBcEIsRUFBNkIsS0FBS2lFLE9BQWxDO0FBQ0FKLE1BQUFBLGFBQWEsQ0FBQ1UsTUFBZCxDQUFxQmpCLEdBQXJCLEVBQTBCLEtBQUtXLE9BQS9CO0FBQ0EsVUFBSWxELFVBQVUsR0FBRyxDQUFDdUMsR0FBRCxFQUFNdEQsT0FBTixDQUFqQjtBQUNBLFdBQUtpRSxPQUFMLElBQWdCTyxvQkFBUUMsVUFBeEI7QUFDQSxXQUFLQyxZQUFMLENBQWtCM0QsVUFBbEI7QUFDQSxhQUFPLENBQUMsS0FBS3dDLFlBQU4sRUFBb0IsS0FBS0MsWUFBekIsQ0FBUDtBQUNIO0FBQ0osSUFDRDs7O1NBQ0FrQixlQUFBLHNCQUFhM0QsVUFBYixFQUF5QjtBQUNyQixRQUFJNEQsVUFBVSxHQUFHLENBQWpCOztBQUNBLFdBQU81RCxVQUFVLENBQUNDLE1BQVgsR0FBb0IsQ0FBM0IsRUFBOEI7QUFDMUIsVUFBSTRELFVBQVUsR0FBRyxFQUFqQjs7QUFDQSxVQUFJRCxVQUFVLElBQUksQ0FBZCxJQUFtQjVELFVBQVUsQ0FBQ0MsTUFBWCxJQUFxQixDQUE1QyxFQUErQztBQUFFO0FBQzdDLFlBQUk2RCxJQUFJLEdBQUc5RCxVQUFVLENBQUMsQ0FBRCxDQUFyQjtBQUNBLFlBQUkrRCxJQUFJLEdBQUcvRCxVQUFVLENBQUMsQ0FBRCxDQUFyQjtBQUNBLFlBQUlnRSxNQUFNLEdBQUcsS0FBS2pGLEtBQUwsQ0FBVytFLElBQUksQ0FBQ3ZELENBQWhCLEVBQW1CdUQsSUFBSSxDQUFDeEQsQ0FBeEIsQ0FBYjtBQUNBLFlBQUkyRCxNQUFNLEdBQUcsS0FBS2xGLEtBQUwsQ0FBV2dGLElBQUksQ0FBQ3hELENBQWhCLEVBQW1Cd0QsSUFBSSxDQUFDekQsQ0FBeEIsQ0FBYjs7QUFDQSxZQUFJMEQsTUFBTSxDQUFDWCxNQUFQLElBQWlCOUIsd0JBQVlDLElBQTdCLElBQXFDeUMsTUFBTSxDQUFDWixNQUFQLElBQWlCOUIsd0JBQVlDLElBQXRFLEVBQTRFO0FBQ3hFLGNBQUkwQyxTQUFTLEdBQUcsSUFBaEI7O0FBQ0EsY0FBSUYsTUFBTSxDQUFDWCxNQUFQLElBQWlCOUIsd0JBQVlDLElBQWpDLEVBQXVDO0FBQ25Dd0MsWUFBQUEsTUFBTSxDQUFDOUMsSUFBUCxHQUFjK0MsTUFBTSxDQUFDL0MsSUFBckI7QUFDQTJDLFlBQUFBLFVBQVUsQ0FBQ2pELElBQVgsQ0FBZ0JvRCxNQUFoQjtBQUNILFdBSEQsTUFJSztBQUNEQyxZQUFBQSxNQUFNLENBQUMvQyxJQUFQLEdBQWM4QyxNQUFNLENBQUM5QyxJQUFyQjtBQUNBMkMsWUFBQUEsVUFBVSxDQUFDakQsSUFBWCxDQUFnQnFELE1BQWhCO0FBQ0g7QUFFSjtBQUNKOztBQUNELFdBQUssSUFBSXpFLENBQVQsSUFBY1EsVUFBZCxFQUEwQjtBQUN0QixZQUFJdUMsR0FBRyxHQUFHdkMsVUFBVSxDQUFDUixDQUFELENBQXBCOztBQUNBLFlBQUksQ0FBQyxLQUFLVCxLQUFMLENBQVd3RCxHQUFHLENBQUNoQyxDQUFmLEVBQWtCZ0MsR0FBRyxDQUFDakMsQ0FBdEIsQ0FBTCxFQUErQjtBQUMzQjtBQUNIOztBQUpxQiwrQkFLcUIsS0FBS04sVUFBTCxDQUFnQnVDLEdBQUcsQ0FBQ2pDLENBQXBCLEVBQXVCaUMsR0FBRyxDQUFDaEMsQ0FBM0IsQ0FMckI7QUFBQSxZQUtqQlIsTUFMaUI7QUFBQSxZQUtUdUIsYUFMUztBQUFBLFlBS002QyxXQUxOOztBQU90QixZQUFJcEUsTUFBTSxDQUFDRSxNQUFQLEdBQWdCLENBQXBCLEVBQXVCO0FBQ25CO0FBQ0g7O0FBQ0QsYUFBSyxJQUFJUCxDQUFULElBQWNLLE1BQWQsRUFBc0I7QUFDbEIsY0FBSXFFLEtBQUssR0FBRyxLQUFLckYsS0FBTCxDQUFXZ0IsTUFBTSxDQUFDTCxDQUFELENBQU4sQ0FBVWEsQ0FBckIsRUFBd0JSLE1BQU0sQ0FBQ0wsQ0FBRCxDQUFOLENBQVVZLENBQWxDLENBQVo7QUFDQSxlQUFLK0QsU0FBTCxDQUFldEUsTUFBTSxDQUFDTCxDQUFELENBQU4sQ0FBVVksQ0FBekIsRUFBNEJQLE1BQU0sQ0FBQ0wsQ0FBRCxDQUFOLENBQVVhLENBQXRDLEVBQXlDLEtBQXpDLEVBQWdEcUQsVUFBaEQ7O0FBQ0EsY0FBSVEsS0FBSyxDQUFDZixNQUFOLElBQWdCOUIsd0JBQVkrQixNQUFoQyxFQUF3QztBQUNwQ08sWUFBQUEsVUFBVSxDQUFDakQsSUFBWCxDQUFnQndELEtBQWhCO0FBQ0g7QUFDSjs7QUFDRCxhQUFLRSxhQUFMLENBQW1CL0IsR0FBbkIsRUFBd0JqQixhQUF4QixFQUF1QzZDLFdBQXZDO0FBRUg7O0FBQ0QsV0FBS0ksV0FBTCxDQUFpQlYsVUFBakIsRUFBNkJELFVBQTdCO0FBQ0EsV0FBS1YsT0FBTCxJQUFnQk8sb0JBQVFlLEdBQXhCO0FBQ0F4RSxNQUFBQSxVQUFVLEdBQUcsS0FBS3lFLElBQUwsRUFBYjtBQUNBYixNQUFBQSxVQUFVO0FBQ2I7QUFDSixJQUVEOzs7U0FDQVUsZ0JBQUEsdUJBQWMvQixHQUFkLEVBQW1CYyxNQUFuQixFQUEyQm5DLElBQTNCLEVBQWlDO0FBQzdCLFFBQUltQyxNQUFNLElBQUksRUFBZCxFQUFrQjtBQUNkO0FBQ0g7O0FBQ0QsUUFBSUEsTUFBTSxJQUFJOUIsd0JBQVlDLElBQTFCLEVBQWdDO0FBQzVCTixNQUFBQSxJQUFJLEdBQUd3RCxzQkFBVWxELElBQWpCO0FBQ0g7O0FBQ0QsUUFBSTRDLEtBQUssR0FBRyxJQUFJeEUscUJBQUosRUFBWjtBQUNBLFNBQUtiLEtBQUwsQ0FBV3dELEdBQUcsQ0FBQ2hDLENBQWYsRUFBa0JnQyxHQUFHLENBQUNqQyxDQUF0QixJQUEyQjhELEtBQTNCO0FBQ0FBLElBQUFBLEtBQUssQ0FBQzlFLElBQU4sQ0FBVzRCLElBQVg7QUFDQWtELElBQUFBLEtBQUssQ0FBQ2pFLFVBQU4sQ0FBaUJvQyxHQUFHLENBQUNqQyxDQUFyQixFQUF3QmlDLEdBQUcsQ0FBQ2hDLENBQTVCO0FBQ0E2RCxJQUFBQSxLQUFLLENBQUNsRSxLQUFOLENBQVlxQyxHQUFHLENBQUNqQyxDQUFoQixFQUFtQmlDLEdBQUcsQ0FBQ2hDLENBQXZCO0FBQ0E2RCxJQUFBQSxLQUFLLENBQUNPLFNBQU4sQ0FBZ0J0QixNQUFoQjtBQUNBZSxJQUFBQSxLQUFLLENBQUNRLFVBQU4sQ0FBaUIsQ0FBakIsRUFBb0IsS0FBcEI7QUFDQVIsSUFBQUEsS0FBSyxDQUFDUSxVQUFOLENBQWlCLEtBQUsxQixPQUF0QixFQUErQixJQUEvQjtBQUNBLFNBQUtWLFlBQUwsQ0FBa0I1QixJQUFsQixDQUF1QndELEtBQXZCO0FBQ0gsSUFDRDs7O1NBQ0FLLE9BQUEsZ0JBQU87QUFDSCxRQUFJSSxhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsU0FBSyxJQUFJckYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSUMsc0JBQXJCLEVBQWlDRCxDQUFDLEVBQWxDLEVBQXNDO0FBQ2xDLFdBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSUMsdUJBQXJCLEVBQWtDRCxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFlBQUksS0FBS1gsS0FBTCxDQUFXUyxDQUFYLEVBQWNFLENBQWQsS0FBb0IsSUFBeEIsRUFBOEI7QUFDMUIsY0FBSW9GLE1BQU0sR0FBR3RGLENBQWI7O0FBQ0EsZUFBSyxJQUFJdUYsQ0FBQyxHQUFHRCxNQUFiLEVBQXFCQyxDQUFDLElBQUlwRix1QkFBMUIsRUFBdUNvRixDQUFDLEVBQXhDLEVBQTRDO0FBQ3hDLGdCQUFJLEtBQUtoRyxLQUFMLENBQVdnRyxDQUFYLEVBQWNyRixDQUFkLENBQUosRUFBc0I7QUFDbEIsbUJBQUt5RCxrQkFBTCxDQUF3QixLQUFLcEUsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxDQUF4QjtBQUNBbUYsY0FBQUEsYUFBYSxDQUFDakUsSUFBZCxDQUFtQixLQUFLN0IsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxDQUFuQjtBQUNBLG1CQUFLWCxLQUFMLENBQVcrRixNQUFYLEVBQW1CcEYsQ0FBbkIsSUFBd0IsS0FBS1gsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxDQUF4QjtBQUNBLG1CQUFLWCxLQUFMLENBQVdnRyxDQUFYLEVBQWNyRixDQUFkLElBQW1CLElBQW5CO0FBQ0EsbUJBQUtYLEtBQUwsQ0FBVytGLE1BQVgsRUFBbUJwRixDQUFuQixFQUFzQlEsS0FBdEIsQ0FBNEJSLENBQTVCLEVBQStCb0YsTUFBL0I7QUFDQSxtQkFBSy9GLEtBQUwsQ0FBVytGLE1BQVgsRUFBbUJwRixDQUFuQixFQUFzQjhELE1BQXRCLENBQTZCdEUsRUFBRSxDQUFDQyxFQUFILENBQU1PLENBQU4sRUFBU29GLE1BQVQsQ0FBN0IsRUFBK0MsS0FBSzVCLE9BQXBEO0FBQ0E0QixjQUFBQSxNQUFNO0FBQ1Q7QUFDSjs7QUFDRCxjQUFJRSxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxlQUFLLElBQUlELENBQUMsR0FBR0QsTUFBYixFQUFxQkMsQ0FBQyxJQUFJcEYsdUJBQTFCLEVBQXVDb0YsQ0FBQyxFQUF4QyxFQUE0QztBQUN4QyxpQkFBS2hHLEtBQUwsQ0FBV2dHLENBQVgsRUFBY3JGLENBQWQsSUFBbUIsSUFBSUUscUJBQUosRUFBbkI7QUFDQSxpQkFBS2IsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxFQUFpQkosSUFBakIsQ0FBc0IsS0FBS1EsaUJBQUwsRUFBdEI7QUFDQSxpQkFBS2YsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxFQUFpQlMsVUFBakIsQ0FBNEJULENBQTVCLEVBQStCc0YsS0FBSyxHQUFHckYsdUJBQXZDO0FBQ0EsaUJBQUtaLEtBQUwsQ0FBV2dHLENBQVgsRUFBY3JGLENBQWQsRUFBaUJRLEtBQWpCLENBQXVCUixDQUF2QixFQUEwQnNGLEtBQUssR0FBR3JGLHVCQUFsQztBQUNBLGlCQUFLWixLQUFMLENBQVdnRyxDQUFYLEVBQWNyRixDQUFkLEVBQWlCOEQsTUFBakIsQ0FBd0J0RSxFQUFFLENBQUNDLEVBQUgsQ0FBTU8sQ0FBTixFQUFTcUYsQ0FBVCxDQUF4QixFQUFxQyxLQUFLN0IsT0FBMUM7QUFDQThCLFlBQUFBLEtBQUs7QUFDTCxpQkFBS3hDLFlBQUwsQ0FBa0I1QixJQUFsQixDQUF1QixLQUFLN0IsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxDQUF2QjtBQUNBbUYsWUFBQUEsYUFBYSxDQUFDakUsSUFBZCxDQUFtQixLQUFLN0IsS0FBTCxDQUFXZ0csQ0FBWCxFQUFjckYsQ0FBZCxDQUFuQjtBQUNIO0FBRUo7QUFDSjtBQUNKOztBQUNELFNBQUt3RCxPQUFMLElBQWdCTyxvQkFBUUMsVUFBUixHQUFxQixHQUFyQztBQUNBLFdBQU9tQixhQUFQO0FBQ0g7O1NBRUQxQixxQkFBQSw0QkFBbUJpQixLQUFuQixFQUEwQjtBQUN0QixRQUFJLEtBQUs1QixZQUFMLENBQWtCeUMsT0FBbEIsQ0FBMEJiLEtBQTFCLEtBQW9DLENBQUMsQ0FBekMsRUFBNEM7QUFDeEM7QUFDSDs7QUFDRCxTQUFLNUIsWUFBTCxDQUFrQjVCLElBQWxCLENBQXVCd0QsS0FBdkI7QUFDSDs7U0FFRGMsV0FBQSxvQkFBVztBQUNQLFNBQUssSUFBSTFGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLElBQUlDLHNCQUFyQixFQUFpQ0QsQ0FBQyxFQUFsQyxFQUFzQztBQUNsQyxXQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLElBQUlDLHVCQUFyQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNuQyxZQUFJLEtBQUtYLEtBQUwsQ0FBV1MsQ0FBWCxFQUFjRSxDQUFkLENBQUosRUFBc0I7QUFDbEIsZUFBS1gsS0FBTCxDQUFXUyxDQUFYLEVBQWNFLENBQWQsRUFBaUJ5RixHQUFqQixHQUF1QixFQUF2QjtBQUNIO0FBQ0o7QUFDSjtBQUNKOztTQUVEcEMsZUFBQSxzQkFBYWUsSUFBYixFQUFtQkMsSUFBbkIsRUFBeUI7QUFDckIsUUFBSXFCLFFBQVEsR0FBRyxLQUFLckcsS0FBTCxDQUFXK0UsSUFBSSxDQUFDdkQsQ0FBaEIsRUFBbUJ1RCxJQUFJLENBQUN4RCxDQUF4QixDQUFmO0FBQ0EsU0FBS3ZCLEtBQUwsQ0FBVytFLElBQUksQ0FBQ3ZELENBQWhCLEVBQW1CdUQsSUFBSSxDQUFDeEQsQ0FBeEIsSUFBNkIsS0FBS3ZCLEtBQUwsQ0FBV2dGLElBQUksQ0FBQ3hELENBQWhCLEVBQW1Cd0QsSUFBSSxDQUFDekQsQ0FBeEIsQ0FBN0I7QUFDQSxTQUFLdkIsS0FBTCxDQUFXK0UsSUFBSSxDQUFDdkQsQ0FBaEIsRUFBbUJ1RCxJQUFJLENBQUN4RCxDQUF4QixFQUEyQkEsQ0FBM0IsR0FBK0J3RCxJQUFJLENBQUN4RCxDQUFwQztBQUNBLFNBQUt2QixLQUFMLENBQVcrRSxJQUFJLENBQUN2RCxDQUFoQixFQUFtQnVELElBQUksQ0FBQ3hELENBQXhCLEVBQTJCQyxDQUEzQixHQUErQnVELElBQUksQ0FBQ3ZELENBQXBDO0FBQ0EsU0FBS3hCLEtBQUwsQ0FBV2dGLElBQUksQ0FBQ3hELENBQWhCLEVBQW1Cd0QsSUFBSSxDQUFDekQsQ0FBeEIsSUFBNkI4RSxRQUE3QjtBQUNBLFNBQUtyRyxLQUFMLENBQVdnRixJQUFJLENBQUN4RCxDQUFoQixFQUFtQndELElBQUksQ0FBQ3pELENBQXhCLEVBQTJCQSxDQUEzQixHQUErQnlELElBQUksQ0FBQ3pELENBQXBDO0FBQ0EsU0FBS3ZCLEtBQUwsQ0FBV2dGLElBQUksQ0FBQ3hELENBQWhCLEVBQW1Cd0QsSUFBSSxDQUFDekQsQ0FBeEIsRUFBMkJDLENBQTNCLEdBQStCd0QsSUFBSSxDQUFDeEQsQ0FBcEM7QUFDSCxJQUNEO0FBQ0E7OztTQUNBaEIsaUJBQUEsd0JBQWU4RixHQUFmLEVBQW9CO0FBQ2hCbEQsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksUUFBWixFQUFzQmlELEdBQXRCO0FBQ0EsU0FBS2pHLFdBQUwsR0FBbUJpRyxHQUFuQjtBQUNBLFNBQUtoRyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0EsUUFBSWlHLGNBQWMsR0FBRyxLQUFLakcsY0FBMUI7O0FBQ0EsU0FBSyxJQUFJRyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxJQUFJK0Ysd0JBQXJCLEVBQW1DL0YsQ0FBQyxFQUFwQyxFQUF3QztBQUNwQzhGLE1BQUFBLGNBQWMsQ0FBQzFFLElBQWYsQ0FBb0JwQixDQUFwQjtBQUNIOztBQUNELFNBQUssSUFBSUEsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBRzhGLGNBQWMsQ0FBQ3JGLE1BQW5DLEVBQTJDVCxFQUFDLEVBQTVDLEVBQWdEO0FBQzVDLFVBQUlnRyxLQUFLLEdBQUc3QyxJQUFJLENBQUM4QyxLQUFMLENBQVc5QyxJQUFJLENBQUMrQyxNQUFMLE1BQWlCSCwyQkFBZS9GLEVBQWhDLENBQVgsSUFBaURBLEVBQTdEOztBQUNBOEYsTUFBQUEsY0FBYyxDQUFDOUYsRUFBRCxDQUFkLEVBQW1COEYsY0FBYyxDQUFDRSxLQUFELENBQWQsR0FBd0JGLGNBQWMsQ0FBQ0UsS0FBRCxDQUF6RCxFQUFrRUYsY0FBYyxDQUFDOUYsRUFBRCxDQUFoRjtBQUNIO0FBQ0osSUFDRDs7O1NBQ0FNLG9CQUFBLDZCQUFvQjtBQUNoQixRQUFJMEYsS0FBSyxHQUFHN0MsSUFBSSxDQUFDOEMsS0FBTCxDQUFXOUMsSUFBSSxDQUFDK0MsTUFBTCxLQUFnQixLQUFLdEcsV0FBaEMsQ0FBWjtBQUNBLFdBQU8sS0FBS0MsY0FBTCxDQUFvQm1HLEtBQXBCLENBQVA7QUFDSCxJQUNEOzs7U0FDQWpCLGNBQUEscUJBQVlWLFVBQVosRUFBd0JELFVBQXhCLEVBQW9DO0FBQUE7O0FBQUE7QUFFNUIsVUFBSStCLFlBQVksR0FBRyxFQUFuQjtBQUNBLFVBQUlDLFFBQVEsR0FBR25DLG9CQUFRb0MsVUFBdkI7QUFDQWhDLE1BQUFBLFVBQVUsQ0FBQy9CLE9BQVgsQ0FBbUIsVUFBVXNDLEtBQVYsRUFBaUI7QUFDaEMsWUFBSUEsS0FBSyxDQUFDZixNQUFOLElBQWdCOUIsd0JBQVlHLElBQWhDLEVBQXNDO0FBQ2xDLGVBQUssSUFBSWxDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLElBQUlDLHNCQUFyQixFQUFpQ0QsQ0FBQyxFQUFsQyxFQUFzQztBQUNsQyxnQkFBSSxLQUFLVCxLQUFMLENBQVdxRixLQUFLLENBQUM3RCxDQUFqQixFQUFvQmYsQ0FBcEIsQ0FBSixFQUE0QjtBQUN4QixrQkFBSSxLQUFLVCxLQUFMLENBQVdxRixLQUFLLENBQUM3RCxDQUFqQixFQUFvQmYsQ0FBcEIsRUFBdUI2RCxNQUF2QixJQUFpQzlCLHdCQUFZK0IsTUFBakQsRUFBeUQ7QUFDckRxQyxnQkFBQUEsWUFBWSxDQUFDL0UsSUFBYixDQUFrQixLQUFLN0IsS0FBTCxDQUFXcUYsS0FBSyxDQUFDN0QsQ0FBakIsRUFBb0JmLENBQXBCLENBQWxCO0FBQ0g7O0FBQ0QsbUJBQUs2RSxTQUFMLENBQWU3RSxDQUFmLEVBQWtCNEUsS0FBSyxDQUFDN0QsQ0FBeEIsRUFBMkIsS0FBM0IsRUFBa0NxRCxVQUFsQztBQUNIO0FBQ0o7O0FBQ0QsZUFBS2tDLFVBQUwsQ0FBZ0IsS0FBSzVDLE9BQXJCLEVBQThCaEUsRUFBRSxDQUFDQyxFQUFILENBQU1pRixLQUFLLENBQUM5RCxDQUFaLEVBQWU4RCxLQUFLLENBQUM3RCxDQUFyQixDQUE5QjtBQUNILFNBVkQsTUFXSyxJQUFJNkQsS0FBSyxDQUFDZixNQUFOLElBQWdCOUIsd0JBQVlJLE1BQWhDLEVBQXdDO0FBQ3pDLGVBQUssSUFBSW5DLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLElBQUlHLHVCQUFyQixFQUFrQ0gsR0FBQyxFQUFuQyxFQUF1QztBQUNuQyxnQkFBSSxLQUFLVCxLQUFMLENBQVdTLEdBQVgsRUFBYzRFLEtBQUssQ0FBQzlELENBQXBCLENBQUosRUFBNEI7QUFDeEIsa0JBQUksS0FBS3ZCLEtBQUwsQ0FBV1MsR0FBWCxFQUFjNEUsS0FBSyxDQUFDOUQsQ0FBcEIsRUFBdUIrQyxNQUF2QixJQUFpQzlCLHdCQUFZK0IsTUFBakQsRUFBeUQ7QUFDckRxQyxnQkFBQUEsWUFBWSxDQUFDL0UsSUFBYixDQUFrQixLQUFLN0IsS0FBTCxDQUFXUyxHQUFYLEVBQWM0RSxLQUFLLENBQUM5RCxDQUFwQixDQUFsQjtBQUNIOztBQUNELG1CQUFLK0QsU0FBTCxDQUFlRCxLQUFLLENBQUM5RCxDQUFyQixFQUF3QmQsR0FBeEIsRUFBMkIsS0FBM0IsRUFBa0NvRSxVQUFsQztBQUNIO0FBQ0o7O0FBQ0QsZUFBS21DLFVBQUwsQ0FBZ0IsS0FBSzdDLE9BQXJCLEVBQThCaEUsRUFBRSxDQUFDQyxFQUFILENBQU1pRixLQUFLLENBQUM5RCxDQUFaLEVBQWU4RCxLQUFLLENBQUM3RCxDQUFyQixDQUE5QjtBQUNILFNBVkksTUFXQSxJQUFJNkQsS0FBSyxDQUFDZixNQUFOLElBQWdCOUIsd0JBQVlFLElBQWhDLEVBQXNDO0FBQ3ZDLGNBQUluQixDQUFDLEdBQUc4RCxLQUFLLENBQUM5RCxDQUFkO0FBQ0EsY0FBSUMsQ0FBQyxHQUFHNkQsS0FBSyxDQUFDN0QsQ0FBZDs7QUFDQSxlQUFLLElBQUlmLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLElBQUlHLHVCQUFyQixFQUFrQ0gsR0FBQyxFQUFuQyxFQUF1QztBQUNuQyxpQkFBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxJQUFJRCxzQkFBckIsRUFBaUNDLENBQUMsRUFBbEMsRUFBc0M7QUFDbEMsa0JBQUlnRCxLQUFLLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTdEMsQ0FBQyxHQUFHWixDQUFiLElBQWtCaUQsSUFBSSxDQUFDQyxHQUFMLENBQVNyQyxDQUFDLEdBQUdmLEdBQWIsQ0FBOUI7O0FBQ0Esa0JBQUksS0FBS1QsS0FBTCxDQUFXUyxHQUFYLEVBQWNFLENBQWQsS0FBb0JnRCxLQUFLLElBQUksQ0FBakMsRUFBb0M7QUFDaEMsb0JBQUksS0FBSzNELEtBQUwsQ0FBV1MsR0FBWCxFQUFjRSxDQUFkLEVBQWlCMkQsTUFBakIsSUFBMkI5Qix3QkFBWStCLE1BQTNDLEVBQW1EO0FBQy9DcUMsa0JBQUFBLFlBQVksQ0FBQy9FLElBQWIsQ0FBa0IsS0FBSzdCLEtBQUwsQ0FBV1MsR0FBWCxFQUFjRSxDQUFkLENBQWxCO0FBQ0g7O0FBQ0QscUJBQUsyRSxTQUFMLENBQWUzRSxDQUFmLEVBQWtCRixHQUFsQixFQUFxQixLQUFyQixFQUE0Qm9FLFVBQTVCO0FBQ0g7QUFDSjtBQUNKO0FBQ0osU0FkSSxNQWVBLElBQUlRLEtBQUssQ0FBQ2YsTUFBTixJQUFnQjlCLHdCQUFZQyxJQUFoQyxFQUFzQztBQUN2QyxjQUFJd0UsU0FBUyxHQUFHNUIsS0FBSyxDQUFDbEQsSUFBdEI7O0FBQ0EsY0FBSTBFLFFBQVEsR0FBR25DLG9CQUFRd0MsZUFBdkIsRUFBd0M7QUFDcENMLFlBQUFBLFFBQVEsR0FBR25DLG9CQUFRd0MsZUFBbkI7QUFDSDs7QUFDRCxjQUFJRCxTQUFTLElBQUl0QixzQkFBVWxELElBQTNCLEVBQWlDO0FBQzdCd0UsWUFBQUEsU0FBUyxHQUFHLEtBQUtsRyxpQkFBTCxFQUFaO0FBQ0g7O0FBQ0QsZUFBSyxJQUFJTixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxJQUFJRyx1QkFBckIsRUFBa0NILEdBQUMsRUFBbkMsRUFBdUM7QUFDbkMsaUJBQUssSUFBSUUsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsSUFBSUQsc0JBQXJCLEVBQWlDQyxFQUFDLEVBQWxDLEVBQXNDO0FBQ2xDLGtCQUFJLEtBQUtYLEtBQUwsQ0FBV1MsR0FBWCxFQUFjRSxFQUFkLEtBQW9CLEtBQUtYLEtBQUwsQ0FBV1MsR0FBWCxFQUFjRSxFQUFkLEVBQWlCd0IsSUFBakIsSUFBeUI4RSxTQUFqRCxFQUE0RDtBQUN4RCxvQkFBSSxLQUFLakgsS0FBTCxDQUFXUyxHQUFYLEVBQWNFLEVBQWQsRUFBaUIyRCxNQUFqQixJQUEyQjlCLHdCQUFZK0IsTUFBM0MsRUFBbUQ7QUFDL0NxQyxrQkFBQUEsWUFBWSxDQUFDL0UsSUFBYixDQUFrQixLQUFLN0IsS0FBTCxDQUFXUyxHQUFYLEVBQWNFLEVBQWQsQ0FBbEI7QUFDSDs7QUFDRCxxQkFBSzJFLFNBQUwsQ0FBZTNFLEVBQWYsRUFBa0JGLEdBQWxCLEVBQXFCLElBQXJCLEVBQTJCb0UsVUFBM0I7QUFDSDtBQUNKO0FBQ0osV0FqQnNDLENBa0J2Qzs7QUFDSDtBQUNKLE9BMURELEVBMERHLEtBMURIOztBQTJEQSxVQUFJQyxVQUFVLENBQUM1RCxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCLFFBQUEsS0FBSSxDQUFDaUQsT0FBTCxJQUFnQjBDLFFBQWhCO0FBQ0g7O0FBQ0QvQixNQUFBQSxVQUFVLEdBQUc4QixZQUFiO0FBbEU0Qjs7QUFDaEMsV0FBTzlCLFVBQVUsQ0FBQzVELE1BQVgsR0FBb0IsQ0FBM0IsRUFBOEI7QUFBQTtBQWtFN0I7QUFDSjtBQUNEOzs7Ozs7OztTQU1BaUcsaUJBQUEsd0JBQWVDLFFBQWYsRUFBeUI1RCxHQUF6QixFQUE4QjZELElBQTlCLEVBQW9DO0FBQ2hDLFNBQUszRCxZQUFMLENBQWtCN0IsSUFBbEIsQ0FBdUI7QUFDbkJ1RixNQUFBQSxRQUFRLEVBQVJBLFFBRG1CO0FBRW5CNUQsTUFBQUEsR0FBRyxFQUFIQSxHQUZtQjtBQUduQjhELE1BQUFBLE1BQU0sRUFBRSxPQUhXO0FBSW5CRCxNQUFBQSxJQUFJLEVBQUpBO0FBSm1CLEtBQXZCO0FBTUg7O1NBRUROLGFBQUEsb0JBQVdLLFFBQVgsRUFBcUI1RCxHQUFyQixFQUEwQjtBQUN0QixTQUFLRSxZQUFMLENBQWtCN0IsSUFBbEIsQ0FBdUI7QUFDbkJ1RixNQUFBQSxRQUFRLEVBQVJBLFFBRG1CO0FBRW5CNUQsTUFBQUEsR0FBRyxFQUFIQSxHQUZtQjtBQUduQjhELE1BQUFBLE1BQU0sRUFBRTtBQUhXLEtBQXZCO0FBS0g7O1NBRUROLGFBQUEsb0JBQVdJLFFBQVgsRUFBcUI1RCxHQUFyQixFQUEwQjtBQUN0QixTQUFLRSxZQUFMLENBQWtCN0IsSUFBbEIsQ0FBdUI7QUFDbkJ1RixNQUFBQSxRQUFRLEVBQVJBLFFBRG1CO0FBRW5CNUQsTUFBQUEsR0FBRyxFQUFIQSxHQUZtQjtBQUduQjhELE1BQUFBLE1BQU0sRUFBRTtBQUhXLEtBQXZCO0FBS0g7O1NBRURDLGNBQUEscUJBQVlILFFBQVosRUFBc0I1RCxHQUF0QixFQUEyQixDQUN2QjtBQUNILElBQ0Q7OztTQUNBOEIsWUFBQSxtQkFBVS9ELENBQVYsRUFBYUMsQ0FBYixFQUFnQmdHLFNBQWhCLEVBQTJCSCxJQUEzQixFQUFpQztBQUM3QixRQUFJaEMsS0FBSyxHQUFHLEtBQUtyRixLQUFMLENBQVd3QixDQUFYLEVBQWNELENBQWQsQ0FBWjtBQUNBLFNBQUs2QyxrQkFBTCxDQUF3QmlCLEtBQXhCOztBQUNBLFFBQUltQyxTQUFKLEVBQWU7QUFDWG5DLE1BQUFBLEtBQUssQ0FBQ29DLE9BQU4sQ0FBYyxLQUFLdEQsT0FBbkI7QUFDSDs7QUFFRCxRQUFJdUQsU0FBUyxHQUFHRixTQUFTLEdBQUc5QyxvQkFBUWlELFNBQVgsR0FBdUIsQ0FBaEQ7QUFDQXRDLElBQUFBLEtBQUssQ0FBQ3VDLEtBQU4sQ0FBWSxLQUFLekQsT0FBTCxHQUFldUQsU0FBM0I7QUFDQSxTQUFLUCxjQUFMLENBQW9CLEtBQUtoRCxPQUFMLEdBQWV1RCxTQUFuQyxFQUE4Q3ZILEVBQUUsQ0FBQ0MsRUFBSCxDQUFNaUYsS0FBSyxDQUFDOUQsQ0FBWixFQUFlOEQsS0FBSyxDQUFDN0QsQ0FBckIsQ0FBOUMsRUFBdUU2RixJQUF2RTtBQUNBLFNBQUtySCxLQUFMLENBQVd3QixDQUFYLEVBQWNELENBQWQsSUFBbUIsSUFBbkI7QUFDSCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENlbGxNb2RlbCBmcm9tIFwiLi9DZWxsTW9kZWxcIjtcbmltcG9ydCB7IENFTExfVFlQRSwgQ0VMTF9CQVNFTlVNLCBDRUxMX1NUQVRVUywgR1JJRF9XSURUSCwgR1JJRF9IRUlHSFQsIEFOSVRJTUUgfSBmcm9tIFwiLi9Db25zdFZhbHVlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2VsbHMgPSBudWxsO1xuICAgICAgICB0aGlzLmNlbGxCZ3MgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RQb3MgPSBjYy52MigtMSwgLTEpO1xuICAgICAgICB0aGlzLmNlbGxUeXBlTnVtID0gNTtcbiAgICAgICAgdGhpcy5jZWxsQ3JlYXRlVHlwZSA9IFtdOyAvLyDljYfmiJDnp43nsbvlj6rlnKjov5nkuKrmlbDnu4Tph4zpnaLmn6Xmib5cbiAgICB9XG5cbiAgICBpbml0KGNlbGxUeXBlTnVtKSB7XG4gICAgICAgIHRoaXMuY2VsbHMgPSBbXTtcbiAgICAgICAgdGhpcy5zZXRDZWxsVHlwZU51bShjZWxsVHlwZU51bSB8fCB0aGlzLmNlbGxUeXBlTnVtKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gR1JJRF9XSURUSDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNlbGxzW2ldID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBHUklEX0hFSUdIVDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXSA9IG5ldyBDZWxsTW9kZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IEdSSURfV0lEVEg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gR1JJRF9IRUlHSFQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uaW5pdCh0aGlzLmdldFJhbmRvbUNlbGxUeXBlKCkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5jaGVja1BvaW50KGosIGkpWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uc2V0WFkoaiwgaSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uc2V0U3RhcnRYWShqLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGluaXRXaXRoRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIHRvIGRvXG4gICAgfVxuXG4gICAgY2hlY2tQb2ludCh4LCB5KSB7XG4gICAgICAgIGxldCBjaGVja1dpdGhEaXJlY3Rpb24gPSBmdW5jdGlvbiAoeCwgeSwgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBsZXQgcXVldWUgPSBbXTtcbiAgICAgICAgICAgIGxldCB2aXMgPSBbXTtcbiAgICAgICAgICAgIHZpc1t4ICsgeSAqIDldID0gdHJ1ZTtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goY2MudjIoeCwgeSkpO1xuICAgICAgICAgICAgbGV0IGZyb250ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChmcm9udCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vbGV0IGRpcmVjdGlvbiA9IFtjYy52MigwLCAtMSksIGNjLnYyKDAsIDEpLCBjYy52MigxLCAwKSwgY2MudjIoLTEsIDApXTtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnQgPSBxdWV1ZVtmcm9udF07XG4gICAgICAgICAgICAgICAgbGV0IGNlbGxNb2RlbCA9IHRoaXMuY2VsbHNbcG9pbnQueV1bcG9pbnQueF07XG4gICAgICAgICAgICAgICAgZnJvbnQrKztcbiAgICAgICAgICAgICAgICBpZiAoIWNlbGxNb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRtcFggPSBwb2ludC54ICsgZGlyZWN0aW9uW2ldLng7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0bXBZID0gcG9pbnQueSArIGRpcmVjdGlvbltpXS55O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG1wWCA8IDEgfHwgdG1wWCA+IDlcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRtcFkgPCAxIHx8IHRtcFkgPiA5XG4gICAgICAgICAgICAgICAgICAgICAgICB8fCB2aXNbdG1wWCArIHRtcFkgKiA5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgIXRoaXMuY2VsbHNbdG1wWV1bdG1wWF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsTW9kZWwudHlwZSA9PSB0aGlzLmNlbGxzW3RtcFldW3RtcFhdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc1t0bXBYICsgdG1wWSAqIDldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goY2MudjIodG1wWCwgdG1wWSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCByb3dSZXN1bHQgPSBjaGVja1dpdGhEaXJlY3Rpb24uY2FsbCh0aGlzLCB4LCB5LCBbY2MudjIoMSwgMCksIGNjLnYyKC0xLCAwKV0pO1xuICAgICAgICBsZXQgY29sUmVzdWx0ID0gY2hlY2tXaXRoRGlyZWN0aW9uLmNhbGwodGhpcywgeCwgeSwgW2NjLnYyKDAsIC0xKSwgY2MudjIoMCwgMSldKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgbmV3Q2VsbFN0YXR1cyA9IFwiXCI7XG4gICAgICAgIGlmIChyb3dSZXN1bHQubGVuZ3RoID49IDUgfHwgY29sUmVzdWx0Lmxlbmd0aCA+PSA1KSB7XG4gICAgICAgICAgICBuZXdDZWxsU3RhdHVzID0gQ0VMTF9TVEFUVVMuQklSRDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3dSZXN1bHQubGVuZ3RoID49IDMgJiYgY29sUmVzdWx0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICBuZXdDZWxsU3RhdHVzID0gQ0VMTF9TVEFUVVMuV1JBUDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyb3dSZXN1bHQubGVuZ3RoID49IDQpIHtcbiAgICAgICAgICAgIG5ld0NlbGxTdGF0dXMgPSBDRUxMX1NUQVRVUy5MSU5FO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbFJlc3VsdC5sZW5ndGggPj0gNCkge1xuICAgICAgICAgICAgbmV3Q2VsbFN0YXR1cyA9IENFTExfU1RBVFVTLkNPTFVNTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm93UmVzdWx0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByb3dSZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbFJlc3VsdC5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgbGV0IHRtcCA9IHJlc3VsdC5jb25jYXQoKTtcbiAgICAgICAgICAgIGNvbFJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uIChuZXdFbGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRtcC5mb3JFYWNoKGZ1bmN0aW9uIChvbGRFbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0VsZS54ID09IG9sZEVsZS54ICYmIG5ld0VsZS55ID09IG9sZEVsZS55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICghZmxhZykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXdFbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcmVzdWx0LCBuZXdDZWxsU3RhdHVzLCB0aGlzLmNlbGxzW3ldW3hdLnR5cGVdO1xuICAgIH1cblxuICAgIHByaW50SW5mbygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gOTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJpbnRTdHIgPSBcIlwiO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPD0gOTsgaisrKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRTdHIgKz0gdGhpcy5jZWxsc1tpXVtqXS50eXBlICsgXCIgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcmludFN0cik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDZWxscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHM7XG4gICAgfVxuICAgIC8vIGNvbnRyb2xsZXLosIPnlKjnmoTkuLvopoHlhaXlj6NcbiAgICAvLyDngrnlh7vmn5DkuKrmoLzlrZBcbiAgICBzZWxlY3RDZWxsKHBvcykge1xuICAgICAgICB0aGlzLmNoYW5nZU1vZGVscyA9IFtdOy8vIOWPkeeUn+aUueWPmOeahG1vZGVs77yM5bCG5L2c5Li66L+U5Zue5YC877yM57uZdmlld+aSreWKqOS9nFxuICAgICAgICB0aGlzLmVmZmVjdHNRdWV1ZSA9IFtdOyAvLyDliqjnianmtojlpLHvvIzniIbngrjnrYnnibnmlYhcbiAgICAgICAgdmFyIGxhc3RQb3MgPSB0aGlzLmxhc3RQb3M7XG4gICAgICAgIHZhciBkZWx0YSA9IE1hdGguYWJzKHBvcy54IC0gbGFzdFBvcy54KSArIE1hdGguYWJzKHBvcy55IC0gbGFzdFBvcy55KTtcbiAgICAgICAgaWYgKGRlbHRhICE9IDEpIHsgLy/pnZ7nm7jpgrvmoLzlrZDvvIwg55u05o6l6L+U5ZueXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3MgPSBwb3M7XG4gICAgICAgICAgICByZXR1cm4gW1tdLCBbXV07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN1ckNsaWNrQ2VsbCA9IHRoaXMuY2VsbHNbcG9zLnldW3Bvcy54XTsgLy/lvZPliY3ngrnlh7vnmoTmoLzlrZBcbiAgICAgICAgbGV0IGxhc3RDbGlja0NlbGwgPSB0aGlzLmNlbGxzW2xhc3RQb3MueV1bbGFzdFBvcy54XTsgLy8g5LiK5LiA5qyh54K55Ye755qE5qC85byPXG4gICAgICAgIHRoaXMuZXhjaGFuZ2VDZWxsKGxhc3RQb3MsIHBvcyk7XG4gICAgICAgIHZhciByZXN1bHQxID0gdGhpcy5jaGVja1BvaW50KHBvcy54LCBwb3MueSlbMF07XG4gICAgICAgIHZhciByZXN1bHQyID0gdGhpcy5jaGVja1BvaW50KGxhc3RQb3MueCwgbGFzdFBvcy55KVswXTtcbiAgICAgICAgdGhpcy5jdXJUaW1lID0gMDsgLy8g5Yqo55S75pKt5pS+55qE5b2T5YmN5pe26Ze0XG4gICAgICAgIHRoaXMucHVzaFRvQ2hhbmdlTW9kZWxzKGN1ckNsaWNrQ2VsbCk7XG4gICAgICAgIHRoaXMucHVzaFRvQ2hhbmdlTW9kZWxzKGxhc3RDbGlja0NlbGwpO1xuICAgICAgICBsZXQgaXNDYW5Cb21iID0gKGN1ckNsaWNrQ2VsbC5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OICYmIC8vIOWIpOaWreS4pOS4quaYr+WQpuaYr+eJueauiueahOWKqOeJqVxuICAgICAgICAgICAgbGFzdENsaWNrQ2VsbC5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OKSB8fFxuICAgICAgICAgICAgY3VyQ2xpY2tDZWxsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEIHx8XG4gICAgICAgICAgICBsYXN0Q2xpY2tDZWxsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEO1xuICAgICAgICBpZiAocmVzdWx0MS5sZW5ndGggPCAzICYmIHJlc3VsdDIubGVuZ3RoIDwgMyAmJiAhaXNDYW5Cb21iKSB7Ly/kuI3kvJrlj5HnlJ/mtojpmaTnmoTmg4XlhrVcbiAgICAgICAgICAgIHRoaXMuZXhjaGFuZ2VDZWxsKGxhc3RQb3MsIHBvcyk7XG4gICAgICAgICAgICBjdXJDbGlja0NlbGwubW92ZVRvQW5kQmFjayhsYXN0UG9zKTtcbiAgICAgICAgICAgIGxhc3RDbGlja0NlbGwubW92ZVRvQW5kQmFjayhwb3MpO1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zID0gY2MudjIoLTEsIC0xKTtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5jaGFuZ2VNb2RlbHNdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zID0gY2MudjIoLTEsIC0xKTtcbiAgICAgICAgICAgIGN1ckNsaWNrQ2VsbC5tb3ZlVG8obGFzdFBvcywgdGhpcy5jdXJUaW1lKTtcbiAgICAgICAgICAgIGxhc3RDbGlja0NlbGwubW92ZVRvKHBvcywgdGhpcy5jdXJUaW1lKTtcbiAgICAgICAgICAgIHZhciBjaGVja1BvaW50ID0gW3BvcywgbGFzdFBvc107XG4gICAgICAgICAgICB0aGlzLmN1clRpbWUgKz0gQU5JVElNRS5UT1VDSF9NT1ZFO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ3J1c2goY2hlY2tQb2ludCk7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuY2hhbmdlTW9kZWxzLCB0aGlzLmVmZmVjdHNRdWV1ZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g5raI6ZmkXG4gICAgcHJvY2Vzc0NydXNoKGNoZWNrUG9pbnQpIHtcbiAgICAgICAgbGV0IGN5Y2xlQ291bnQgPSAwO1xuICAgICAgICB3aGlsZSAoY2hlY2tQb2ludC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgYm9tYk1vZGVscyA9IFtdO1xuICAgICAgICAgICAgaWYgKGN5Y2xlQ291bnQgPT0gMCAmJiBjaGVja1BvaW50Lmxlbmd0aCA9PSAyKSB7IC8v54m55q6K5raI6ZmkXG4gICAgICAgICAgICAgICAgbGV0IHBvczEgPSBjaGVja1BvaW50WzBdO1xuICAgICAgICAgICAgICAgIGxldCBwb3MyID0gY2hlY2tQb2ludFsxXTtcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWwxID0gdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF07XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsMiA9IHRoaXMuY2VsbHNbcG9zMi55XVtwb3MyLnhdO1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbDEuc3RhdHVzID09IENFTExfU1RBVFVTLkJJUkQgfHwgbW9kZWwyLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBib21iTW9kZWwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwxLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDEudHlwZSA9IG1vZGVsMi50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9tYk1vZGVscy5wdXNoKG1vZGVsMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDIudHlwZSA9IG1vZGVsMS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9tYk1vZGVscy5wdXNoKG1vZGVsMik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY2hlY2tQb2ludCkge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBjaGVja1BvaW50W2ldO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jZWxsc1twb3MueV1bcG9zLnhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgW3Jlc3VsdCwgbmV3Q2VsbFN0YXR1cywgbmV3Q2VsbFR5cGVdID0gdGhpcy5jaGVja1BvaW50KHBvcy54LCBwb3MueSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY2VsbHNbcmVzdWx0W2pdLnldW3Jlc3VsdFtqXS54XTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcnVzaENlbGwocmVzdWx0W2pdLngsIHJlc3VsdFtqXS55LCBmYWxzZSwgY3ljbGVDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib21iTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3Q2VsbChwb3MsIG5ld0NlbGxTdGF0dXMsIG5ld0NlbGxUeXBlKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQm9tYihib21iTW9kZWxzLCBjeWNsZUNvdW50KTtcbiAgICAgICAgICAgIHRoaXMuY3VyVGltZSArPSBBTklUSU1FLkRJRTtcbiAgICAgICAgICAgIGNoZWNrUG9pbnQgPSB0aGlzLmRvd24oKTtcbiAgICAgICAgICAgIGN5Y2xlQ291bnQrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8v55Sf5oiQ5pawY2VsbFxuICAgIGNyZWF0ZU5ld0NlbGwocG9zLCBzdGF0dXMsIHR5cGUpIHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICB0eXBlID0gQ0VMTF9UWVBFLkJJUkRcbiAgICAgICAgfVxuICAgICAgICBsZXQgbW9kZWwgPSBuZXcgQ2VsbE1vZGVsKCk7XG4gICAgICAgIHRoaXMuY2VsbHNbcG9zLnldW3Bvcy54XSA9IG1vZGVsXG4gICAgICAgIG1vZGVsLmluaXQodHlwZSk7XG4gICAgICAgIG1vZGVsLnNldFN0YXJ0WFkocG9zLngsIHBvcy55KTtcbiAgICAgICAgbW9kZWwuc2V0WFkocG9zLngsIHBvcy55KTtcbiAgICAgICAgbW9kZWwuc2V0U3RhdHVzKHN0YXR1cyk7XG4gICAgICAgIG1vZGVsLnNldFZpc2libGUoMCwgZmFsc2UpO1xuICAgICAgICBtb2RlbC5zZXRWaXNpYmxlKHRoaXMuY3VyVGltZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuY2hhbmdlTW9kZWxzLnB1c2gobW9kZWwpO1xuICAgIH1cbiAgICAvLyDkuIvokL1cbiAgICBkb3duKCkge1xuICAgICAgICBsZXQgbmV3Q2hlY2tQb2ludCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBHUklEX1dJRFRIOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAxOyBqIDw9IEdSSURfSEVJR0hUOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVtqXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJSb3cgPSBpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gY3VyUm93OyBrIDw9IEdSSURfSEVJR0hUOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW2tdW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoVG9DaGFuZ2VNb2RlbHModGhpcy5jZWxsc1trXVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2hlY2tQb2ludC5wdXNoKHRoaXMuY2VsbHNba11bal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbY3VyUm93XVtqXSA9IHRoaXMuY2VsbHNba11bal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tjdXJSb3ddW2pdLnNldFhZKGosIGN1clJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tjdXJSb3ddW2pdLm1vdmVUbyhjYy52MihqLCBjdXJSb3cpLCB0aGlzLmN1clRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clJvdysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSBjdXJSb3c7IGsgPD0gR1JJRF9IRUlHSFQ7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXSA9IG5ldyBDZWxsTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNba11bal0uaW5pdCh0aGlzLmdldFJhbmRvbUNlbGxUeXBlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXS5zZXRTdGFydFhZKGosIGNvdW50ICsgR1JJRF9IRUlHSFQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1trXVtqXS5zZXRYWShqLCBjb3VudCArIEdSSURfSEVJR0hUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNba11bal0ubW92ZVRvKGNjLnYyKGosIGspLCB0aGlzLmN1clRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlTW9kZWxzLnB1c2godGhpcy5jZWxsc1trXVtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDaGVja1BvaW50LnB1c2godGhpcy5jZWxsc1trXVtqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1clRpbWUgKz0gQU5JVElNRS5UT1VDSF9NT1ZFICsgMC4zXG4gICAgICAgIHJldHVybiBuZXdDaGVja1BvaW50O1xuICAgIH1cblxuICAgIHB1c2hUb0NoYW5nZU1vZGVscyhtb2RlbCkge1xuICAgICAgICBpZiAodGhpcy5jaGFuZ2VNb2RlbHMuaW5kZXhPZihtb2RlbCkgIT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYW5nZU1vZGVscy5wdXNoKG1vZGVsKTtcbiAgICB9XG5cbiAgICBjbGVhbkNtZCgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gR1JJRF9XSURUSDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSBHUklEX0hFSUdIVDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2VsbHNbaV1bal0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXS5jbWQgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleGNoYW5nZUNlbGwocG9zMSwgcG9zMikge1xuICAgICAgICB2YXIgdG1wTW9kZWwgPSB0aGlzLmNlbGxzW3BvczEueV1bcG9zMS54XTtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF0gPSB0aGlzLmNlbGxzW3BvczIueV1bcG9zMi54XTtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF0ueCA9IHBvczEueDtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MxLnldW3BvczEueF0ueSA9IHBvczEueTtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MyLnldW3BvczIueF0gPSB0bXBNb2RlbDtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MyLnldW3BvczIueF0ueCA9IHBvczIueDtcbiAgICAgICAgdGhpcy5jZWxsc1twb3MyLnldW3BvczIueF0ueSA9IHBvczIueTtcbiAgICB9XG4gICAgLy8g6K6+572u56eN57G7XG4gICAgLy8gVG9kbyDmlLnmiJDkubHluo/nrpfms5VcbiAgICBzZXRDZWxsVHlwZU51bShudW0pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJudW0gPSBcIiwgbnVtKTtcbiAgICAgICAgdGhpcy5jZWxsVHlwZU51bSA9IG51bTtcbiAgICAgICAgdGhpcy5jZWxsQ3JlYXRlVHlwZSA9IFtdO1xuICAgICAgICBsZXQgY3JlYXRlVHlwZUxpc3QgPSB0aGlzLmNlbGxDcmVhdGVUeXBlO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBDRUxMX0JBU0VOVU07IGkrKykge1xuICAgICAgICAgICAgY3JlYXRlVHlwZUxpc3QucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNyZWF0ZVR5cGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoQ0VMTF9CQVNFTlVNIC0gaSkpICsgaTtcbiAgICAgICAgICAgIGNyZWF0ZVR5cGVMaXN0W2ldLCBjcmVhdGVUeXBlTGlzdFtpbmRleF0gPSBjcmVhdGVUeXBlTGlzdFtpbmRleF0sIGNyZWF0ZVR5cGVMaXN0W2ldXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g6ZqP6KaB55Sf5oiQ5LiA5Liq57G75Z6LXG4gICAgZ2V0UmFuZG9tQ2VsbFR5cGUoKSB7XG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2VsbFR5cGVOdW0pO1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxsQ3JlYXRlVHlwZVtpbmRleF07XG4gICAgfVxuICAgIC8vIFRPRE8gYm9tYk1vZGVsc+WOu+mHjVxuICAgIHByb2Nlc3NCb21iKGJvbWJNb2RlbHMsIGN5Y2xlQ291bnQpIHtcbiAgICAgICAgd2hpbGUgKGJvbWJNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IG5ld0JvbWJNb2RlbCA9IFtdO1xuICAgICAgICAgICAgbGV0IGJvbWJUaW1lID0gQU5JVElNRS5CT01CX0RFTEFZO1xuICAgICAgICAgICAgYm9tYk1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbC5zdGF0dXMgPT0gQ0VMTF9TVEFUVVMuTElORSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX1dJRFRIOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW21vZGVsLnldW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2VsbHNbbW9kZWwueV1baV0uc3RhdHVzICE9IENFTExfU1RBVFVTLkNPTU1PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCb21iTW9kZWwucHVzaCh0aGlzLmNlbGxzW21vZGVsLnldW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcnVzaENlbGwoaSwgbW9kZWwueSwgZmFsc2UsIGN5Y2xlQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUm93Qm9tYih0aGlzLmN1clRpbWUsIGNjLnYyKG1vZGVsLngsIG1vZGVsLnkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZWwuc3RhdHVzID09IENFTExfU1RBVFVTLkNPTFVNTikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX0hFSUdIVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVttb2RlbC54XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW2ldW21vZGVsLnhdLnN0YXR1cyAhPSBDRUxMX1NUQVRVUy5DT01NT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Qm9tYk1vZGVsLnB1c2godGhpcy5jZWxsc1tpXVttb2RlbC54XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3J1c2hDZWxsKG1vZGVsLngsIGksIGZhbHNlLCBjeWNsZUNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENvbEJvbWIodGhpcy5jdXJUaW1lLCBjYy52Mihtb2RlbC54LCBtb2RlbC55KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGVsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5XUkFQKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4ID0gbW9kZWwueDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkgPSBtb2RlbC55O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX0hFSUdIVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBHUklEX1dJRFRIOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVsdGEgPSBNYXRoLmFicyh4IC0gaikgKyBNYXRoLmFicyh5IC0gaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2VsbHNbaV1bal0gJiYgZGVsdGEgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVtqXS5zdGF0dXMgIT0gQ0VMTF9TVEFUVVMuQ09NTU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCb21iTW9kZWwucHVzaCh0aGlzLmNlbGxzW2ldW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNydXNoQ2VsbChqLCBpLCBmYWxzZSwgY3ljbGVDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGVsLnN0YXR1cyA9PSBDRUxMX1NUQVRVUy5CSVJEKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjcnVzaFR5cGUgPSBtb2RlbC50eXBlXG4gICAgICAgICAgICAgICAgICAgIGlmIChib21iVGltZSA8IEFOSVRJTUUuQk9NQl9CSVJEX0RFTEFZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib21iVGltZSA9IEFOSVRJTUUuQk9NQl9CSVJEX0RFTEFZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjcnVzaFR5cGUgPT0gQ0VMTF9UWVBFLkJJUkQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNydXNoVHlwZSA9IHRoaXMuZ2V0UmFuZG9tQ2VsbFR5cGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBHUklEX0hFSUdIVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBHUklEX1dJRFRIOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jZWxsc1tpXVtqXSAmJiB0aGlzLmNlbGxzW2ldW2pdLnR5cGUgPT0gY3J1c2hUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzW2ldW2pdLnN0YXR1cyAhPSBDRUxMX1NUQVRVUy5DT01NT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0JvbWJNb2RlbC5wdXNoKHRoaXMuY2VsbHNbaV1bal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3J1c2hDZWxsKGosIGksIHRydWUsIGN5Y2xlQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuY3J1c2hDZWxsKG1vZGVsLngsIG1vZGVsLnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgaWYgKGJvbWJNb2RlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VyVGltZSArPSBib21iVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvbWJNb2RlbHMgPSBuZXdCb21iTW9kZWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHvlvIDlp4vmkq3mlL7nmoTml7bpl7R9IHBsYXlUaW1lIFxuICAgICAqIEBwYXJhbSB7KmNlbGzkvY3nva59IHBvcyBcbiAgICAgKiBAcGFyYW0geyrnrKzlh6DmrKHmtojpmaTvvIznlKjkuo7mkq3mlL7pn7PmlYh9IHN0ZXAgXG4gICAgICovXG4gICAgYWRkQ3J1c2hFZmZlY3QocGxheVRpbWUsIHBvcywgc3RlcCkge1xuICAgICAgICB0aGlzLmVmZmVjdHNRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIHBsYXlUaW1lLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgYWN0aW9uOiBcImNydXNoXCIsXG4gICAgICAgICAgICBzdGVwXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZFJvd0JvbWIocGxheVRpbWUsIHBvcykge1xuICAgICAgICB0aGlzLmVmZmVjdHNRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIHBsYXlUaW1lLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgYWN0aW9uOiBcInJvd0JvbWJcIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRDb2xCb21iKHBsYXlUaW1lLCBwb3MpIHtcbiAgICAgICAgdGhpcy5lZmZlY3RzUXVldWUucHVzaCh7XG4gICAgICAgICAgICBwbGF5VGltZSxcbiAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICAgIGFjdGlvbjogXCJjb2xCb21iXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkV3JhcEJvbWIocGxheVRpbWUsIHBvcykge1xuICAgICAgICAvLyBUT0RPXG4gICAgfVxuICAgIC8vIGNlbGzmtojpmaTpgLvovpFcbiAgICBjcnVzaENlbGwoeCwgeSwgbmVlZFNoYWtlLCBzdGVwKSB7XG4gICAgICAgIGxldCBtb2RlbCA9IHRoaXMuY2VsbHNbeV1beF07XG4gICAgICAgIHRoaXMucHVzaFRvQ2hhbmdlTW9kZWxzKG1vZGVsKTtcbiAgICAgICAgaWYgKG5lZWRTaGFrZSkge1xuICAgICAgICAgICAgbW9kZWwudG9TaGFrZSh0aGlzLmN1clRpbWUpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2hha2VUaW1lID0gbmVlZFNoYWtlID8gQU5JVElNRS5ESUVfU0hBS0UgOiAwO1xuICAgICAgICBtb2RlbC50b0RpZSh0aGlzLmN1clRpbWUgKyBzaGFrZVRpbWUpO1xuICAgICAgICB0aGlzLmFkZENydXNoRWZmZWN0KHRoaXMuY3VyVGltZSArIHNoYWtlVGltZSwgY2MudjIobW9kZWwueCwgbW9kZWwueSksIHN0ZXApO1xuICAgICAgICB0aGlzLmNlbGxzW3ldW3hdID0gbnVsbDtcbiAgICB9XG5cbn1cblxuIl19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/UnitTest/GameModelTest.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '16fce9lOkpA7a2vuhmMkDMZ', 'GameModelTest');
// Script/UnitTest/GameModelTest.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {// foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
  } // use this for initialization
  // onLoad: function () {
  //     var gameModel = new GameModel();
  //     gameModel.init();
  //     gameModel.printInfo();
  //     for(var i = 1;i<=9;i++){
  //         for(var j = 1;j<=9;j++){
  //             console.log(gameModel.checkPoint(i,j).join(" ,"));
  //         }
  //     }
  // },
  // called every frame, uncomment this function to activate update callback
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvVW5pdFRlc3QvR2FtZU1vZGVsVGVzdC5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFLENBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUSxHQUhQLENBZ0JMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7O0FBL0JLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIC8vIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICB2YXIgZ2FtZU1vZGVsID0gbmV3IEdhbWVNb2RlbCgpO1xuICAgIC8vICAgICBnYW1lTW9kZWwuaW5pdCgpO1xuICAgIC8vICAgICBnYW1lTW9kZWwucHJpbnRJbmZvKCk7XG4gICAgLy8gICAgIGZvcih2YXIgaSA9IDE7aTw9OTtpKyspe1xuICAgIC8vICAgICAgICAgZm9yKHZhciBqID0gMTtqPD05O2orKyl7XG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coZ2FtZU1vZGVsLmNoZWNrUG9pbnQoaSxqKS5qb2luKFwiICxcIikpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/View/EffectLayer.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0e925myn0dIjqdao1TpipF9', 'EffectLayer');
// Script/View/EffectLayer.js

"use strict";

var _ConstValue = require("../Model/ConstValue");

var _AudioUtils = _interopRequireDefault(require("../Utils/AudioUtils"));

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
    bombWhite: {
      "default": null,
      type: cc.Prefab
    },
    crushEffect: {
      "default": null,
      type: cc.Prefab
    },
    audioUtils: {
      type: _AudioUtils["default"],
      "default": null
    }
  },
  // use this for initialization
  onLoad: function onLoad() {},
  playEffects: function playEffects(effectQueue) {
    if (!effectQueue || effectQueue.length <= 0) {
      return;
    }

    var soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放

    effectQueue.forEach(function (cmd) {
      var delayTime = cc.delayTime(cmd.playTime);
      var callFunc = cc.callFunc(function () {
        var instantEffect = null;
        var animation = null;

        if (cmd.action == "crush") {
          instantEffect = cc.instantiate(this.crushEffect);
          animation = instantEffect.getComponent(cc.Animation);
          animation.play("effect");
          !soundMap["crush" + cmd.playTime] && this.audioUtils.playEliminate(cmd.step);
          soundMap["crush" + cmd.playTime] = true;
        } else if (cmd.action == "rowBomb") {
          instantEffect = cc.instantiate(this.bombWhite);
          animation = instantEffect.getComponent(cc.Animation);
          animation.play("effect_line");
        } else if (cmd.action == "colBomb") {
          instantEffect = cc.instantiate(this.bombWhite);
          animation = instantEffect.getComponent(cc.Animation);
          animation.play("effect_col");
        }

        instantEffect.x = _ConstValue.CELL_WIDTH * (cmd.pos.x - 0.5);
        instantEffect.y = _ConstValue.CELL_WIDTH * (cmd.pos.y - 0.5);
        instantEffect.parent = this.node;
        animation.on("finished", function () {
          instantEffect.destroy();
        }, this);
      }, this);
      this.node.runAction(cc.sequence(delayTime, callFunc));
    }, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvVmlldy9FZmZlY3RMYXllci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImJvbWJXaGl0ZSIsInR5cGUiLCJQcmVmYWIiLCJjcnVzaEVmZmVjdCIsImF1ZGlvVXRpbHMiLCJBdWRpb1V0aWxzIiwib25Mb2FkIiwicGxheUVmZmVjdHMiLCJlZmZlY3RRdWV1ZSIsImxlbmd0aCIsInNvdW5kTWFwIiwiZm9yRWFjaCIsImNtZCIsImRlbGF5VGltZSIsInBsYXlUaW1lIiwiY2FsbEZ1bmMiLCJpbnN0YW50RWZmZWN0IiwiYW5pbWF0aW9uIiwiYWN0aW9uIiwiaW5zdGFudGlhdGUiLCJnZXRDb21wb25lbnQiLCJBbmltYXRpb24iLCJwbGF5IiwicGxheUVsaW1pbmF0ZSIsInN0ZXAiLCJ4IiwiQ0VMTF9XSURUSCIsInBvcyIsInkiLCJwYXJlbnQiLCJub2RlIiwib24iLCJkZXN0cm95IiwicnVuQWN0aW9uIiwic2VxdWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsSUFBQUEsU0FBUyxFQUFDO0FBQ04saUJBQVMsSUFESDtBQUVOQyxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ007QUFGSCxLQVhGO0FBZVJDLElBQUFBLFdBQVcsRUFBQztBQUNSLGlCQUFTLElBREQ7QUFFUkYsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNO0FBRkQsS0FmSjtBQW1CUkUsSUFBQUEsVUFBVSxFQUFDO0FBQ1BILE1BQUFBLElBQUksRUFBRUksc0JBREM7QUFFUCxpQkFBUztBQUZGO0FBbkJILEdBSFA7QUE0Qkw7QUFDQUMsRUFB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e0NFTExfV0lEVEh9IGZyb20gJy4uL01vZGVsL0NvbnN0VmFsdWUnO1xuXG5pbXBvcnQgQXVkaW9VdGlscyBmcm9tIFwiLi4vVXRpbHMvQXVkaW9VdGlsc1wiO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgYm9tYldoaXRlOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgY3J1c2hFZmZlY3Q6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBhdWRpb1V0aWxzOntcbiAgICAgICAgICAgIHR5cGU6IEF1ZGlvVXRpbHMsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIHBsYXlFZmZlY3RzOiBmdW5jdGlvbihlZmZlY3RRdWV1ZSl7XG4gICAgICAgIGlmKCFlZmZlY3RRdWV1ZSB8fCBlZmZlY3RRdWV1ZS5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzb3VuZE1hcCA9IHt9OyAvL+afkOS4gOaXtuWIu++8jOafkOS4gOenjeWjsOmfs+aYr+WQpuaSreaUvui/h+eahOagh+iusO+8jOmYsuatoumHjeWkjeaSreaUvlxuICAgICAgICBlZmZlY3RRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKGNtZCl7XG4gICAgICAgICAgICBsZXQgZGVsYXlUaW1lID0gY2MuZGVsYXlUaW1lKGNtZC5wbGF5VGltZSk7XG4gICAgICAgICAgICBsZXQgY2FsbEZ1bmMgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGxldCBpbnN0YW50RWZmZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZihjbWQuYWN0aW9uID09IFwiY3J1c2hcIil7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbnRFZmZlY3QgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNydXNoRWZmZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uICA9IGluc3RhbnRFZmZlY3QuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiZWZmZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAhc291bmRNYXBbXCJjcnVzaFwiICsgY21kLnBsYXlUaW1lXSAmJiB0aGlzLmF1ZGlvVXRpbHMucGxheUVsaW1pbmF0ZShjbWQuc3RlcCk7XG4gICAgICAgICAgICAgICAgICAgIHNvdW5kTWFwW1wiY3J1c2hcIiArIGNtZC5wbGF5VGltZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGNtZC5hY3Rpb24gPT0gXCJyb3dCb21iXCIpe1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW50RWZmZWN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5ib21iV2hpdGUpO1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24gID0gaW5zdGFudEVmZmVjdC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJlZmZlY3RfbGluZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihjbWQuYWN0aW9uID09IFwiY29sQm9tYlwiKXtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFudEVmZmVjdCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm9tYldoaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uICA9IGluc3RhbnRFZmZlY3QuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiZWZmZWN0X2NvbFwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbnN0YW50RWZmZWN0LnggPSBDRUxMX1dJRFRIICogKGNtZC5wb3MueCAtIDAuNSk7XG4gICAgICAgICAgICAgICAgaW5zdGFudEVmZmVjdC55ID0gQ0VMTF9XSURUSCAqIChjbWQucG9zLnkgLSAwLjUpO1xuICAgICAgICAgICAgICAgIGluc3RhbnRFZmZlY3QucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5vbihcImZpbmlzaGVkXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFudEVmZmVjdC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoZGVsYXlUaW1lLCBjYWxsRnVuYykpO1xuICAgICAgICB9LHRoaXMpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Model/ConstValue.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f9088esGbNBtJmNaJsz0Gq4', 'ConstValue');
// Script/Model/ConstValue.js

"use strict";

exports.__esModule = true;
exports.ANITIME = exports.GRID_PIXEL_HEIGHT = exports.GRID_PIXEL_WIDTH = exports.CELL_HEIGHT = exports.CELL_WIDTH = exports.GRID_HEIGHT = exports.GRID_WIDTH = exports.CELL_STATUS = exports.CELL_BASENUM = exports.CELL_TYPE = void 0;
var CELL_TYPE = {
  EMPTY: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  BIRD: 7
};
exports.CELL_TYPE = CELL_TYPE;
var CELL_BASENUM = 6;
exports.CELL_BASENUM = CELL_BASENUM;
var CELL_STATUS = {
  COMMON: 0,
  CLICK: "click",
  LINE: "line",
  COLUMN: "column",
  WRAP: "wrap",
  BIRD: "bird"
};
exports.CELL_STATUS = CELL_STATUS;
var GRID_WIDTH = 9;
exports.GRID_WIDTH = GRID_WIDTH;
var GRID_HEIGHT = 9;
exports.GRID_HEIGHT = GRID_HEIGHT;
var CELL_WIDTH = 70;
exports.CELL_WIDTH = CELL_WIDTH;
var CELL_HEIGHT = 70;
exports.CELL_HEIGHT = CELL_HEIGHT;
var GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
exports.GRID_PIXEL_WIDTH = GRID_PIXEL_WIDTH;
var GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT; // ********************   时间表  animation time **************************

exports.GRID_PIXEL_HEIGHT = GRID_PIXEL_HEIGHT;
var ANITIME = {
  TOUCH_MOVE: 0.3,
  DIE: 0.2,
  DOWN: 0.5,
  BOMB_DELAY: 0.3,
  BOMB_BIRD_DELAY: 0.7,
  DIE_SHAKE: 0.4 // 死前抖动

};
exports.ANITIME = ANITIME;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kZWwvQ29uc3RWYWx1ZS5qcyJdLCJuYW1lcyI6WyJDRUxMX1RZUEUiLCJFTVBUWSIsIkEiLCJCIiwiQyIsIkQiLCJFIiwiRiIsIkJJUkQiLCJDRUxMX0JBU0VOVU0iLCJDRUxMX1NUQVRVUyIsIkNPTU1PTiIsIkNMSUNLIiwiTElORSIsIkNPTFVNTiIsIldSQVAiLCJHUklEX1dJRFRIIiwiR1JJRF9IRUlHSFQiLCJDRUxMX1dJRFRIIiwiQ0VMTF9IRUlHSFQiLCJHUklEX1BJWEVMX1dJRFRIIiwiR1JJRF9QSVhFTF9IRUlHSFQiLCJBTklUSU1FIiwiVE9VQ0hfTU9WRSIsIkRJRSIsIkRPV04iLCJCT01CX0RFTEFZIiwiQk9NQl9CSVJEX0RFTEFZIiwiRElFX1NIQUtFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ08sSUFBTUEsU0FBUyxHQUFHO0FBQ3JCQyxFQUFBQSxLQUFLLEVBQUcsQ0FEYTtBQUVyQkMsRUFBQUEsQ0FBQyxFQUFHLENBRmlCO0FBR3JCQyxFQUFBQSxDQUFDLEVBQUcsQ0FIaUI7QUFJckJDLEVBQUFBLENBQUMsRUFBRyxDQUppQjtBQUtyQkMsRUFBQUEsQ0FBQyxFQUFHLENBTGlCO0FBTXJCQyxFQUFBQSxDQUFDLEVBQUcsQ0FOaUI7QUFPckJDLEVBQUFBLENBQUMsRUFBRyxDQVBpQjtBQVFyQkMsRUFBQUEsSUFBSSxFQUFHO0FBUmMsQ0FBbEI7O0FBVUEsSUFBTUMsWUFBWSxHQUFHLENBQXJCOztBQUNBLElBQU1DLFdBQVcsR0FBRztBQUN2QkMsRUFBQUEsTUFBTSxFQUFFLENBRGU7QUFFdkJDLEVBQUFBLEtBQUssRUFBRSxPQUZnQjtBQUd2QkMsRUFBQUEsSUFBSSxFQUFFLE1BSGlCO0FBSXZCQyxFQUFBQSxNQUFNLEVBQUUsUUFKZTtBQUt2QkMsRUFBQUEsSUFBSSxFQUFFLE1BTGlCO0FBTXZCUCxFQUFBQSxJQUFJLEVBQUU7QUFOaUIsQ0FBcEI7O0FBU0EsSUFBTVEsVUFBVSxHQUFHLENBQW5COztBQUNBLElBQU1DLFdBQVcsR0FBRyxDQUFwQjs7QUFFQSxJQUFNQyxVQUFVLEdBQUcsRUFBbkI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHLEVBQXBCOztBQUVBLElBQU1DLGdCQUFnQixHQUFHSixVQUFVLEdBQUdFLFVBQXRDOztBQUNBLElBQU1HLGlCQUFpQixHQUFHSixXQUFXLEdBQUdFLFdBQXhDLEVBR1A7OztBQUNPLElBQU1HLE9BQU8sR0FBRztBQUNuQkMsRUFBQUEsVUFBVSxFQUFFLEdBRE87QUFFbkJDLEVBQUFBLEdBQUcsRUFBRSxHQUZjO0FBR25CQyxFQUFBQSxJQUFJLEVBQUUsR0FIYTtBQUluQkMsRUFBQUEsVUFBVSxFQUFFLEdBSk87QUFLbkJDLEVBQUFBLGVBQWUsRUFBRSxHQUxFO0FBTW5CQyxFQUFBQSxTQUFTLEVBQUUsR0FOUSxDQU1KOztBQU5JLENBQWhCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjb25zdCBDRUxMX1RZUEUgPSB7XG4gICAgRU1QVFkgOiAwLFxuICAgIEEgOiAxLFxuICAgIEIgOiAyLFxuICAgIEMgOiAzLFxuICAgIEQgOiA0LFxuICAgIEUgOiA1LFxuICAgIEYgOiA2LFxuICAgIEJJUkQgOiA3XG59XG5leHBvcnQgY29uc3QgQ0VMTF9CQVNFTlVNID0gNjtcbmV4cG9ydCBjb25zdCBDRUxMX1NUQVRVUyA9IHtcbiAgICBDT01NT046IDAgLFxuICAgIENMSUNLOiBcImNsaWNrXCIsXG4gICAgTElORTogXCJsaW5lXCIsXG4gICAgQ09MVU1OOiBcImNvbHVtblwiLFxuICAgIFdSQVA6IFwid3JhcFwiLFxuICAgIEJJUkQ6IFwiYmlyZFwiXG59IFxuXG5leHBvcnQgY29uc3QgR1JJRF9XSURUSCA9IDk7XG5leHBvcnQgY29uc3QgR1JJRF9IRUlHSFQgPSA5O1xuXG5leHBvcnQgY29uc3QgQ0VMTF9XSURUSCA9IDcwO1xuZXhwb3J0IGNvbnN0IENFTExfSEVJR0hUID0gNzA7XG5cbmV4cG9ydCBjb25zdCBHUklEX1BJWEVMX1dJRFRIID0gR1JJRF9XSURUSCAqIENFTExfV0lEVEg7XG5leHBvcnQgY29uc3QgR1JJRF9QSVhFTF9IRUlHSFQgPSBHUklEX0hFSUdIVCAqIENFTExfSEVJR0hUO1xuXG5cbi8vICoqKioqKioqKioqKioqKioqKioqICAg5pe26Ze06KGoICBhbmltYXRpb24gdGltZSAqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNvbnN0IEFOSVRJTUUgPSB7XG4gICAgVE9VQ0hfTU9WRTogMC4zLFxuICAgIERJRTogMC4yLFxuICAgIERPV046IDAuNSxcbiAgICBCT01CX0RFTEFZOiAwLjMsXG4gICAgQk9NQl9CSVJEX0RFTEFZOiAwLjcsXG4gICAgRElFX1NIQUtFOiAwLjQgLy8g5q275YmN5oqW5YqoXG59XG5cblxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '3a8a5Ff0shJHZEkS9YFfAhW', 'use_v2.0.x_cc.Toggle_event');
// migration/use_v2.0.x_cc.Toggle_event.js

"use strict";

/*
 * This script is automatically generated by Cocos Creator and is only compatible with projects prior to v2.1.0.
 * You do not need to manually add this script in any other project.
 * If you don't use cc.Toggle in your project, you can delete this script directly.
 * If your project is hosted in VCS such as git, submit this script together.
 *
 * 此脚本由 Cocos Creator 自动生成，仅用于兼容 v2.1.0 之前版本的工程，
 * 你无需在任何其它项目中手动添加此脚本。
 * 如果你的项目中没用到 Toggle，可直接删除该脚本。
 * 如果你的项目有托管于 git 等版本库，请将此脚本一并上传。
 */
if (cc.Toggle) {
  // Whether the 'toggle' and 'checkEvents' events are fired when 'toggle.check() / toggle.uncheck()' is called in the code
  // 在代码中调用 'toggle.check() / toggle.uncheck()' 时是否触发 'toggle' 与 'checkEvents' 事件
  cc.Toggle._triggerEventInScript_check = true;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9taWdyYXRpb24vdXNlX3YyLjAueF9jYy5Ub2dnbGVfZXZlbnQuanMiXSwibmFtZXMiOlsiY2MiLCJUb2dnbGUiLCJfdHJpZ2dlckV2ZW50SW5TY3JpcHRfY2hlY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FBWUEsSUFBSUEsRUFBRSxDQUFDQyxNQUFQLEVBQWU7QUFDWDtBQUNBO0FBQ0FELEVBQUFBLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVQywyQkFBVixHQUF3QyxJQUF4QztBQUNIIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogVGhpcyBzY3JpcHQgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgQ29jb3MgQ3JlYXRvciBhbmQgaXMgb25seSBjb21wYXRpYmxlIHdpdGggcHJvamVjdHMgcHJpb3IgdG8gdjIuMS4wLlxuICogWW91IGRvIG5vdCBuZWVkIHRvIG1hbnVhbGx5IGFkZCB0aGlzIHNjcmlwdCBpbiBhbnkgb3RoZXIgcHJvamVjdC5cbiAqIElmIHlvdSBkb24ndCB1c2UgY2MuVG9nZ2xlIGluIHlvdXIgcHJvamVjdCwgeW91IGNhbiBkZWxldGUgdGhpcyBzY3JpcHQgZGlyZWN0bHkuXG4gKiBJZiB5b3VyIHByb2plY3QgaXMgaG9zdGVkIGluIFZDUyBzdWNoIGFzIGdpdCwgc3VibWl0IHRoaXMgc2NyaXB0IHRvZ2V0aGVyLlxuICpcbiAqIOatpOiEmuacrOeUsSBDb2NvcyBDcmVhdG9yIOiHquWKqOeUn+aIkO+8jOS7heeUqOS6juWFvOWuuSB2Mi4xLjAg5LmL5YmN54mI5pys55qE5bel56iL77yMXG4gKiDkvaDml6DpnIDlnKjku7vkvZXlhbblroPpobnnm67kuK3miYvliqjmt7vliqDmraTohJrmnKzjgIJcbiAqIOWmguaenOS9oOeahOmhueebruS4reayoeeUqOWIsCBUb2dnbGXvvIzlj6/nm7TmjqXliKDpmaTor6XohJrmnKzjgIJcbiAqIOWmguaenOS9oOeahOmhueebruacieaJmOeuoeS6jiBnaXQg562J54mI5pys5bqT77yM6K+35bCG5q2k6ISa5pys5LiA5bm25LiK5Lyg44CCXG4gKi9cblxuaWYgKGNjLlRvZ2dsZSkge1xuICAgIC8vIFdoZXRoZXIgdGhlICd0b2dnbGUnIGFuZCAnY2hlY2tFdmVudHMnIGV2ZW50cyBhcmUgZmlyZWQgd2hlbiAndG9nZ2xlLmNoZWNrKCkgLyB0b2dnbGUudW5jaGVjaygpJyBpcyBjYWxsZWQgaW4gdGhlIGNvZGVcbiAgICAvLyDlnKjku6PnoIHkuK3osIPnlKggJ3RvZ2dsZS5jaGVjaygpIC8gdG9nZ2xlLnVuY2hlY2soKScg5pe25piv5ZCm6Kem5Y+RICd0b2dnbGUnIOS4jiAnY2hlY2tFdmVudHMnIOS6i+S7tlxuICAgIGNjLlRvZ2dsZS5fdHJpZ2dlckV2ZW50SW5TY3JpcHRfY2hlY2sgPSB0cnVlO1xufVxuIl19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/View/GridView.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd0d1fDj9rlDx5QUtP+2toQV', 'GridView');
// Script/View/GridView.js

"use strict";

var _ConstValue = require("../Model/ConstValue");

var _AudioUtils = _interopRequireDefault(require("../Utils/AudioUtils"));

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
    aniPre: {
      "default": [],
      type: [cc.Prefab]
    },
    effectLayer: {
      "default": null,
      type: cc.Node
    },
    audioUtils: {
      type: _AudioUtils["default"],
      "default": null
    }
  },
  // use this for initialization
  onLoad: function onLoad() {
    this.setListener();
    this.lastTouchPos = cc.Vec2(-1, -1);
    this.isCanMove = true;
    this.isInPlayAni = false; // 是否在播放中
  },
  setController: function setController(controller) {
    this.controller = controller;
  },
  initWithCellModels: function initWithCellModels(cellsModels) {
    this.cellViews = [];

    for (var i = 1; i <= 9; i++) {
      this.cellViews[i] = [];

      for (var j = 1; j <= 9; j++) {
        var type = cellsModels[i][j].type;
        var aniView = cc.instantiate(this.aniPre[type]);
        aniView.parent = this.node;
        var cellViewScript = aniView.getComponent("CellView");
        cellViewScript.initWithModel(cellsModels[i][j]);
        this.cellViews[i][j] = aniView;
      }
    }
  },
  setListener: function setListener() {
    this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {
      if (this.isInPlayAni) {
        //播放动画中，不允许点击
        return true;
      }

      var touchPos = eventTouch.getLocation();
      var cellPos = this.convertTouchPosToCell(touchPos);

      if (cellPos) {
        var changeModels = this.selectCell(cellPos);
        this.isCanMove = changeModels.length < 3;
      } else {
        this.isCanMove = false;
      }

      return true;
    }, this); // 滑动操作逻辑

    this.node.on(cc.Node.EventType.TOUCH_MOVE, function (eventTouch) {
      if (this.isCanMove) {
        var startTouchPos = eventTouch.getStartLocation();
        var startCellPos = this.convertTouchPosToCell(startTouchPos);
        var touchPos = eventTouch.getLocation();
        var cellPos = this.convertTouchPosToCell(touchPos);

        if (startCellPos.x != cellPos.x || startCellPos.y != cellPos.y) {
          this.isCanMove = false;
          var changeModels = this.selectCell(cellPos);
        }
      }
    }, this);
    this.node.on(cc.Node.EventType.TOUCH_END, function (eventTouch) {// console.log("1111");
    }, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (eventTouch) {// console.log("1111");
    }, this);
  },
  // 根据点击的像素位置，转换成网格中的位置
  convertTouchPosToCell: function convertTouchPosToCell(pos) {
    pos = this.node.convertToNodeSpace(pos);

    if (pos.x < 0 || pos.x >= _ConstValue.GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= _ConstValue.GRID_PIXEL_HEIGHT) {
      return false;
    }

    var x = Math.floor(pos.x / _ConstValue.CELL_WIDTH) + 1;
    var y = Math.floor(pos.y / _ConstValue.CELL_HEIGHT) + 1;
    return cc.v2(x, y);
  },
  // 移动格子
  updateView: function updateView(changeModels) {
    var newCellViewInfo = [];

    for (var i in changeModels) {
      var model = changeModels[i];
      var viewInfo = this.findViewByModel(model);
      var view = null; // 如果原来的cell不存在，则新建

      if (!viewInfo) {
        var type = model.type;
        var aniView = cc.instantiate(this.aniPre[type]);
        aniView.parent = this.node;
        var cellViewScript = aniView.getComponent("CellView");
        cellViewScript.initWithModel(model);
        view = aniView;
      } // 如果已经存在
      else {
          view = viewInfo.view;
          this.cellViews[viewInfo.y][viewInfo.x] = null;
        }

      var cellScript = view.getComponent("CellView");
      cellScript.updateView(); // 执行移动动作

      if (!model.isDeath) {
        newCellViewInfo.push({
          model: model,
          view: view
        });
      }
    } // 重新标记this.cellviews的信息


    newCellViewInfo.forEach(function (ele) {
      var model = ele.model;
      this.cellViews[model.y][model.x] = ele.view;
    }, this);
  },
  // 显示选中的格子背景
  updateSelect: function updateSelect(pos) {
    for (var i = 1; i <= 9; i++) {
      for (var j = 1; j <= 9; j++) {
        if (this.cellViews[i][j]) {
          var cellScript = this.cellViews[i][j].getComponent("CellView");

          if (pos.x == j && pos.y == i) {
            cellScript.setSelect(true);
          } else {
            cellScript.setSelect(false);
          }
        }
      }
    }
  },

  /**
   * 根据cell的model返回对应的view
   */
  findViewByModel: function findViewByModel(model) {
    for (var i = 1; i <= 9; i++) {
      for (var j = 1; j <= 9; j++) {
        if (this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model) {
          return {
            view: this.cellViews[i][j],
            x: j,
            y: i
          };
        }
      }
    }

    return null;
  },
  getPlayAniTime: function getPlayAniTime(changeModels) {
    if (!changeModels) {
      return 0;
    }

    var maxTime = 0;
    changeModels.forEach(function (ele) {
      ele.cmd.forEach(function (cmd) {
        if (maxTime < cmd.playTime + cmd.keepTime) {
          maxTime = cmd.playTime + cmd.keepTime;
        }
      }, this);
    }, this);
    return maxTime;
  },
  // 获得爆炸次数， 同一个时间算一个
  getStep: function getStep(effectsQueue) {
    if (!effectsQueue) {
      return 0;
    }

    return effectsQueue.reduce(function (maxValue, efffectCmd) {
      return Math.max(maxValue, efffectCmd.step || 0);
    }, 0);
  },
  //一段时间内禁止操作
  disableTouch: function disableTouch(time, step) {
    if (time <= 0) {
      return;
    }

    this.isInPlayAni = true;
    this.node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function () {
      this.isInPlayAni = false;
      this.audioUtils.playContinuousMatch(step);
    }, this)));
  },
  // 正常击中格子后的操作
  selectCell: function selectCell(cellPos) {
    var result = this.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑

    var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子

    var effectsQueue = result[1]; //各种特效

    this.playEffect(effectsQueue);
    this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
    this.updateView(changeModels);
    this.controller.cleanCmd();

    if (changeModels.length >= 2) {
      this.updateSelect(cc.v2(-1, -1));
      this.audioUtils.playSwap();
    } else {
      this.updateSelect(cellPos);
      this.audioUtils.playClick();
    }

    return changeModels;
  },
  playEffect: function playEffect(effectsQueue) {
    this.effectLayer.getComponent("EffectLayer").playEffects(effectsQueue);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvVmlldy9HcmlkVmlldy5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImFuaVByZSIsInR5cGUiLCJQcmVmYWIiLCJlZmZlY3RMYXllciIsIk5vZGUiLCJhdWRpb1V0aWxzIiwiQXVkaW9VdGlscyIsIm9uTG9hZCIsInNldExpc3RlbmVyIiwibGFzdFRvdWNoUG9zIiwiVmVjMiIsImlzQ2FuTW92ZSIsImlzSW5QbGF5QW5pIiwic2V0Q29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJpbml0V2l0aENlbGxNb2RlbHMiLCJjZWxsc01vZGVscyIsImNlbGxWaWV3cyIsImkiLCJqIiwiYW5pVmlldyIsImluc3RhbnRpYXRlIiwicGFyZW50Iiwibm9kZSIsImNlbGxWaWV3U2NyaXB0IiwiZ2V0Q29tcG9uZW50IiwiaW5pdFdpdGhNb2RlbCIsIm9uIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJldmVudFRvdWNoIiwidG91Y2hQb3MiLCJnZXRMb2NhdGlvbiIsImNlbGxQb3MiLCJjb252ZXJ0VG91Y2hQb3NUb0NlbGwiLCJjaGFuZ2VNb2RlbHMiLCJzZWxlY3RDZWxsIiwibGVuZ3RoIiwiVE9VQ0hfTU9WRSIsInN0YXJ0VG91Y2hQb3MiLCJnZXRTdGFydExvY2F0aW9uIiwic3RhcnRDZWxsUG9zIiwieCIsInkiLCJUT1VDSF9FTkQiLCJUT1VDSF9DQU5DRUwiLCJwb3MiLCJjb252ZXJ0VG9Ob2RlU3BhY2UiLCJHUklEX1BJWEVMX1dJRFRIIiwiR1JJRF9QSVhFTF9IRUlHSFQiLCJNYXRoIiwiZmxvb3IiLCJDRUxMX1dJRFRIIiwiQ0VMTF9IRUlHSFQiLCJ2MiIsInVwZGF0ZVZpZXciLCJuZXdDZWxsVmlld0luZm8iLCJtb2RlbCIsInZpZXdJbmZvIiwiZmluZFZpZXdCeU1vZGVsIiwidmlldyIsImNlbGxTY3JpcHQiLCJpc0RlYXRoIiwicHVzaCIsImZvckVhY2giLCJlbGUiLCJ1cGRhdGVTZWxlY3QiLCJzZXRTZWxlY3QiLCJnZXRQbGF5QW5pVGltZSIsIm1heFRpbWUiLCJjbWQiLCJwbGF5VGltZSIsImtlZXBUaW1lIiwiZ2V0U3RlcCIsImVmZmVjdHNRdWV1ZSIsInJlZHVjZSIsIm1heFZhbHVlIiwiZWZmZmVjdENtZCIsIm1heCIsInN0ZXAiLCJkaXNhYmxlVG91Y2giLCJ0aW1lIiwicnVuQWN0aW9uIiwic2VxdWVuY2UiLCJkZWxheVRpbWUiLCJjYWxsRnVuYyIsInBsYXlDb250aW51b3VzTWF0Y2giLCJyZXN1bHQiLCJwbGF5RWZmZWN0IiwiY2xlYW5DbWQiLCJwbGF5U3dhcCIsInBsYXlDbGljayIsInBsYXlFZmZlY3RzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLElBQUFBLE1BQU0sRUFBRTtBQUNKLGlCQUFTLEVBREw7QUFFSkMsTUFBQUEsSUFBSSxFQUFFLENBQUNMLEVBQUUsQ0FBQ00sTUFBSjtBQUZGLEtBWEE7QUFlUkMsSUFBQUEsV0FBVyxFQUFFO0FBQ1QsaUJBQVMsSUFEQTtBQUVURixNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ1E7QUFGQSxLQWZMO0FBbUJSQyxJQUFBQSxVQUFVLEVBQUM7QUFDUEosTUFBQUEsSUFBSSxFQUFFSyxzQkFEQztBQUVQLGlCQUFTO0FBRkY7QUFuQkgsR0FIUDtBQThCTDtBQUNBQyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsU0FBS0MsV0FBTDtBQUNBLFNBQUtDLFlBQUwsR0FBb0JiLEVBQUUsQ0FBQ2MsSUFBSCxDQUFRLENBQUMsQ0FBVCxFQUFZLENBQUMsQ0FBYixDQUFwQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLQyxXQUFMLEdB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QmpDLFlBQXBCLENBQWxCLEVBQXFELEtBQUtzQyxPQUFMLENBQWFDLFlBQWIsQ0FBckQ7QUFDQSxTQUFLbkIsVUFBTCxDQUFnQnBCLFlBQWhCO0FBQ0EsU0FBS3JCLFVBQUwsQ0FBZ0IyRSxRQUFoQjs7QUFDQSxRQUFHdEQsWUFBWSxDQUFDRSxNQUFiLElBQXVCLENBQTFCLEVBQTRCO0FBQ3hCLFdBQUs2QixZQUFMLENBQWtCdEUsRUFBRSxDQUFDMEQsRUFBSCxDQUFNLENBQUMsQ0FBUCxFQUFTLENBQUMsQ0FBVixDQUFsQjtBQUNBLFdBQUtqRCxVQUFMLENBQWdCcUYsUUFBaEI7QUFDSCxLQUhELE1BSUk7QUFDQSxXQUFLeEIsWUFBTCxDQUFrQmpDLE9BQWxCO0FBQ0EsV0FBSzVCLFVBQUwsQ0FBZ0JzRixTQUFoQjtBQUNIOztBQUNELFdBQU94RCxZQUFQO0FBQ0gsR0E1Tkk7QUE2TkxxRCxFQUFBQSxVQUFVLEVBQUUsb0JBQVNkLFlBQVQsRUFBc0I7QUFDOUIsU0FBS3ZFLFdBQUwsQ0FBaUJzQixZQUFqQixDQUE4QixhQUE5QixFQUE2Q21FLFdBQTdDLENBQXlEbEIsWUFBekQ7QUFDSCxHQS9OSSxDQW9PTDtBQUNBO0FBRUE7O0FBdk9LLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q0VMTF9XSURUSCwgQ0VMTF9IRUlHSFQsIEdSSURfUElYRUxfV0lEVEgsIEdSSURfUElYRUxfSEVJR0hULCBBTklUSU1FfSBmcm9tICcuLi9Nb2RlbC9Db25zdFZhbHVlJztcblxuaW1wb3J0IEF1ZGlvVXRpbHMgZnJvbSBcIi4uL1V0aWxzL0F1ZGlvVXRpbHNcIjtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgYW5pUHJlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFtjYy5QcmVmYWJdXG4gICAgICAgIH0sXG4gICAgICAgIGVmZmVjdExheWVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBhdWRpb1V0aWxzOntcbiAgICAgICAgICAgIHR5cGU6IEF1ZGlvVXRpbHMsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcblxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0TGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5sYXN0VG91Y2hQb3MgPSBjYy5WZWMyKC0xLCAtMSk7XG4gICAgICAgIHRoaXMuaXNDYW5Nb3ZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc0luUGxheUFuaSA9IGZhbHNlOyAvLyDmmK/lkKblnKjmkq3mlL7kuK1cbiAgICB9LFxuICAgIHNldENvbnRyb2xsZXI6IGZ1bmN0aW9uKGNvbnRyb2xsZXIpe1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgIH0sXG5cbiAgICBpbml0V2l0aENlbGxNb2RlbHM6IGZ1bmN0aW9uKGNlbGxzTW9kZWxzKXtcbiAgICAgICAgdGhpcy5jZWxsVmlld3MgPSBbXTtcbiAgICAgICAgZm9yKHZhciBpID0gMTtpPD05O2krKyl7XG4gICAgICAgICAgICB0aGlzLmNlbGxWaWV3c1tpXSA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBqID0gMTtqPD05O2orKyl7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBjZWxsc01vZGVsc1tpXVtqXS50eXBlO1xuICAgICAgICAgICAgICAgIHZhciBhbmlWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5hbmlQcmVbdHlwZV0pO1xuICAgICAgICAgICAgICAgIGFuaVZpZXcucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIHZhciBjZWxsVmlld1NjcmlwdCA9IGFuaVZpZXcuZ2V0Q29tcG9uZW50KFwiQ2VsbFZpZXdcIik7XG4gICAgICAgICAgICAgICAgY2VsbFZpZXdTY3JpcHQuaW5pdFdpdGhNb2RlbChjZWxsc01vZGVsc1tpXVtqXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsVmlld3NbaV1bal0gPSBhbmlWaWV3O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRMaXN0ZW5lcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbihldmVudFRvdWNoKXtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNJblBsYXlBbmkpey8v5pKt5pS+5Yqo55S75Lit77yM5LiN5YWB6K6454K55Ye7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdG91Y2hQb3MgPSBldmVudFRvdWNoLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgY2VsbFBvcyA9IHRoaXMuY29udmVydFRvdWNoUG9zVG9DZWxsKHRvdWNoUG9zKTtcbiAgICAgICAgICAgIGlmKGNlbGxQb3Mpe1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VNb2RlbHMgPSB0aGlzLnNlbGVjdENlbGwoY2VsbFBvcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Nhbk1vdmUgPSBjaGFuZ2VNb2RlbHMubGVuZ3RoIDwgMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Nhbk1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAvLyDmu5Hliqjmk43kvZzpgLvovpFcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIGZ1bmN0aW9uKGV2ZW50VG91Y2gpe1xuICAgICAgICAgICBpZih0aGlzLmlzQ2FuTW92ZSl7XG4gICAgICAgICAgICAgICB2YXIgc3RhcnRUb3VjaFBvcyA9IGV2ZW50VG91Y2guZ2V0U3RhcnRMb2NhdGlvbiAoKTtcbiAgICAgICAgICAgICAgIHZhciBzdGFydENlbGxQb3MgPSB0aGlzLmNvbnZlcnRUb3VjaFBvc1RvQ2VsbChzdGFydFRvdWNoUG9zKTtcbiAgICAgICAgICAgICAgIHZhciB0b3VjaFBvcyA9IGV2ZW50VG91Y2guZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgIHZhciBjZWxsUG9zID0gdGhpcy5jb252ZXJ0VG91Y2hQb3NUb0NlbGwodG91Y2hQb3MpO1xuICAgICAgICAgICAgICAgaWYoc3RhcnRDZWxsUG9zLnggIT0gY2VsbFBvcy54IHx8IHN0YXJ0Q2VsbFBvcy55ICE9IGNlbGxQb3MueSl7XG4gICAgICAgICAgICAgICAgICAgdGhpcy5pc0Nhbk1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICB2YXIgY2hhbmdlTW9kZWxzID0gdGhpcy5zZWxlY3RDZWxsKGNlbGxQb3MpOyBcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgZnVuY3Rpb24oZXZlbnRUb3VjaCl7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCIxMTExXCIpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgZnVuY3Rpb24oZXZlbnRUb3VjaCl7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCIxMTExXCIpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIC8vIOagueaNrueCueWHu+eahOWDj+e0oOS9jee9ru+8jOi9rOaNouaIkOe9keagvOS4reeahOS9jee9rlxuICAgIGNvbnZlcnRUb3VjaFBvc1RvQ2VsbDogZnVuY3Rpb24ocG9zKXtcbiAgICAgICAgcG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZShwb3MpO1xuICAgICAgICBpZihwb3MueCA8IDAgfHwgcG9zLnggPj0gR1JJRF9QSVhFTF9XSURUSCB8fCBwb3MueSA8IDAgfHwgcG9zLnkgPj0gR1JJRF9QSVhFTF9IRUlHSFQpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB4ID0gTWF0aC5mbG9vcihwb3MueCAvIENFTExfV0lEVEgpICsgMTtcbiAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKHBvcy55IC8gQ0VMTF9IRUlHSFQpICsgMTtcbiAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xuICAgIH0sXG4gICAgLy8g56e75Yqo5qC85a2QXG4gICAgdXBkYXRlVmlldzogZnVuY3Rpb24oY2hhbmdlTW9kZWxzKXtcbiAgICAgICAgbGV0IG5ld0NlbGxWaWV3SW5mbyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgaW4gY2hhbmdlTW9kZWxzKXtcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IGNoYW5nZU1vZGVsc1tpXTtcbiAgICAgICAgICAgIHZhciB2aWV3SW5mbyA9IHRoaXMuZmluZFZpZXdCeU1vZGVsKG1vZGVsKTtcbiAgICAgICAgICAgIHZhciB2aWV3ID0gbnVsbDtcbiAgICAgICAgICAgIC8vIOWmguaenOWOn+adpeeahGNlbGzkuI3lrZjlnKjvvIzliJnmlrDlu7pcbiAgICAgICAgICAgIGlmKCF2aWV3SW5mbyl7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBtb2RlbC50eXBlO1xuICAgICAgICAgICAgICAgIHZhciBhbmlWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5hbmlQcmVbdHlwZV0pO1xuICAgICAgICAgICAgICAgIGFuaVZpZXcucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIHZhciBjZWxsVmlld1NjcmlwdCA9IGFuaVZpZXcuZ2V0Q29tcG9uZW50KFwiQ2VsbFZpZXdcIik7XG4gICAgICAgICAgICAgICAgY2VsbFZpZXdTY3JpcHQuaW5pdFdpdGhNb2RlbChtb2RlbCk7XG4gICAgICAgICAgICAgICAgdmlldyA9IGFuaVZpZXc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDlpoLmnpzlt7Lnu4/lrZjlnKhcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdmlldyA9IHZpZXdJbmZvLnZpZXc7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsVmlld3Nbdmlld0luZm8ueV1bdmlld0luZm8ueF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNlbGxTY3JpcHQgPSB2aWV3LmdldENvbXBvbmVudChcIkNlbGxWaWV3XCIpO1xuICAgICAgICAgICAgY2VsbFNjcmlwdC51cGRhdGVWaWV3KCk7Ly8g5omn6KGM56e75Yqo5Yqo5L2cXG4gICAgICAgICAgICBpZiAoIW1vZGVsLmlzRGVhdGgpIHtcbiAgICAgICAgICAgICAgICBuZXdDZWxsVmlld0luZm8ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgICAgICAgICAgICAgdmlldzogdmlld1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgICAgICAvLyDph43mlrDmoIforrB0aGlzLmNlbGx2aWV3c+eahOS/oeaBr1xuICAgICAgICBuZXdDZWxsVmlld0luZm8uZm9yRWFjaChmdW5jdGlvbihlbGUpe1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gZWxlLm1vZGVsO1xuICAgICAgICAgICAgdGhpcy5jZWxsVmlld3NbbW9kZWwueV1bbW9kZWwueF0gPSBlbGUudmlldztcbiAgICAgICAgfSx0aGlzKTtcbiAgICB9LFxuICAgIC8vIOaYvuekuumAieS4reeahOagvOWtkOiDjOaZr1xuICAgIHVwZGF0ZVNlbGVjdDogZnVuY3Rpb24ocG9zKXtcbiAgICAgICAgIGZvcih2YXIgaSA9IDE7aSA8PTkgO2krKyl7XG4gICAgICAgICAgICBmb3IodmFyIGogPSAxIDtqIDw9OSA7aiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jZWxsVmlld3NbaV1bal0pe1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbFNjcmlwdCA9IHRoaXMuY2VsbFZpZXdzW2ldW2pdLmdldENvbXBvbmVudChcIkNlbGxWaWV3XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZihwb3MueCA9PSBqICYmIHBvcy55ID09aSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsU2NyaXB0LnNldFNlbGVjdCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbFNjcmlwdC5zZXRTZWxlY3QoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDmoLnmja5jZWxs55qEbW9kZWzov5Tlm57lr7nlupTnmoR2aWV3XG4gICAgICovXG4gICAgZmluZFZpZXdCeU1vZGVsOiBmdW5jdGlvbihtb2RlbCl7XG4gICAgICAgIGZvcih2YXIgaSA9IDE7aSA8PTkgO2krKyl7XG4gICAgICAgICAgICBmb3IodmFyIGogPSAxIDtqIDw9OSA7aiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jZWxsVmlld3NbaV1bal0gJiYgdGhpcy5jZWxsVmlld3NbaV1bal0uZ2V0Q29tcG9uZW50KFwiQ2VsbFZpZXdcIikubW9kZWwgPT0gbW9kZWwpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3ZpZXc6dGhpcy5jZWxsVmlld3NbaV1bal0seDpqLCB5Oml9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldFBsYXlBbmlUaW1lOiBmdW5jdGlvbihjaGFuZ2VNb2RlbHMpe1xuICAgICAgICBpZighY2hhbmdlTW9kZWxzKXtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXhUaW1lID0gMDtcbiAgICAgICAgY2hhbmdlTW9kZWxzLmZvckVhY2goZnVuY3Rpb24oZWxlKXtcbiAgICAgICAgICAgIGVsZS5jbWQuZm9yRWFjaChmdW5jdGlvbihjbWQpe1xuICAgICAgICAgICAgICAgIGlmKG1heFRpbWUgPCBjbWQucGxheVRpbWUgKyBjbWQua2VlcFRpbWUpe1xuICAgICAgICAgICAgICAgICAgICBtYXhUaW1lID0gY21kLnBsYXlUaW1lICsgY21kLmtlZXBUaW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sdGhpcylcbiAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgcmV0dXJuIG1heFRpbWU7XG4gICAgfSxcbiAgICAvLyDojrflvpfniIbngrjmrKHmlbDvvIwg5ZCM5LiA5Liq5pe26Ze0566X5LiA5LiqXG4gICAgZ2V0U3RlcDogZnVuY3Rpb24oZWZmZWN0c1F1ZXVlKXtcbiAgICAgICAgaWYoIWVmZmVjdHNRdWV1ZSl7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWZmZWN0c1F1ZXVlLnJlZHVjZShmdW5jdGlvbihtYXhWYWx1ZSwgZWZmZmVjdENtZCl7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgobWF4VmFsdWUsIGVmZmZlY3RDbWQuc3RlcCB8fCAwKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfSxcbiAgICAvL+S4gOauteaXtumXtOWGheemgeatouaTjeS9nFxuICAgIGRpc2FibGVUb3VjaDogZnVuY3Rpb24odGltZSwgc3RlcCl7XG4gICAgICAgIGlmKHRpbWUgPD0gMCl7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNJblBsYXlBbmkgPSB0cnVlO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmRlbGF5VGltZSh0aW1lKSxjYy5jYWxsRnVuYyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5pc0luUGxheUFuaSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hdWRpb1V0aWxzLnBsYXlDb250aW51b3VzTWF0Y2goc3RlcCk7XG4gICAgICAgIH0sIHRoaXMpKSk7XG4gICAgfSxcbiAgICAvLyDmraPluLjlh7vkuK3moLzlrZDlkI7nmoTmk43kvZxcbiAgICBzZWxlY3RDZWxsOiBmdW5jdGlvbihjZWxsUG9zKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuY29udHJvbGxlci5zZWxlY3RDZWxsKGNlbGxQb3MpOyAvLyDnm7TmjqXlhYjkuKLnu5ltb2RlbOWkhOeQhuaVsOaNrumAu+i+kVxuICAgICAgICB2YXIgY2hhbmdlTW9kZWxzID0gcmVzdWx0WzBdOyAvLyDmnInmlLnlj5jnmoRjZWxs77yM5YyF5ZCr5paw55Sf5oiQ55qEY2VsbOWSjOeUn+aIkOmprOS4iuaRp+avgeeahOagvOWtkFxuICAgICAgICB2YXIgZWZmZWN0c1F1ZXVlID0gcmVzdWx0WzFdOyAvL+WQhOenjeeJueaViFxuICAgICAgICB0aGlzLnBsYXlFZmZlY3QoZWZmZWN0c1F1ZXVlKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlVG91Y2godGhpcy5nZXRQbGF5QW5pVGltZShjaGFuZ2VNb2RlbHMpLCB0aGlzLmdldFN0ZXAoZWZmZWN0c1F1ZXVlKSk7XG4gICAgICAgIHRoaXMudXBkYXRlVmlldyhjaGFuZ2VNb2RlbHMpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2xlYW5DbWQoKTsgXG4gICAgICAgIGlmKGNoYW5nZU1vZGVscy5sZW5ndGggPj0gMil7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdChjYy52MigtMSwtMSkpO1xuICAgICAgICAgICAgdGhpcy5hdWRpb1V0aWxzLnBsYXlTd2FwKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0KGNlbGxQb3MpO1xuICAgICAgICAgICAgdGhpcy5hdWRpb1V0aWxzLnBsYXlDbGljaygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFuZ2VNb2RlbHM7XG4gICAgfSxcbiAgICBwbGF5RWZmZWN0OiBmdW5jdGlvbihlZmZlY3RzUXVldWUpe1xuICAgICAgICB0aGlzLmVmZmVjdExheWVyLmdldENvbXBvbmVudChcIkVmZmVjdExheWVyXCIpLnBsYXlFZmZlY3RzKGVmZmVjdHNRdWV1ZSk7XG4gICAgfVxuXG5cblxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/View/CellView.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'fbf19Cx4ptFV62UZ7+qJJpQ', 'CellView');
// Script/View/CellView.js

"use strict";

var _ConstValue = require("../Model/ConstValue");

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
    defaultFrame: {
      "default": null,
      type: cc.SpriteFrame
    }
  },
  // use this for initialization
  onLoad: function onLoad() {
    //this.model = null;
    this.isSelect = false;
  },
  initWithModel: function initWithModel(model) {
    this.model = model;
    var x = model.startX;
    var y = model.startY;
    this.node.x = _ConstValue.CELL_WIDTH * (x - 0.5);
    this.node.y = _ConstValue.CELL_HEIGHT * (y - 0.5);
    var animation = this.node.getComponent(cc.Animation);

    if (model.status == _ConstValue.CELL_STATUS.COMMON) {
      animation.stop();
    } else {
      animation.play(model.status);
    }
  },
  // 执行移动动作
  updateView: function updateView() {
    var _this = this;

    var cmd = this.model.cmd;

    if (cmd.length <= 0) {
      return;
    }

    var actionArray = [];
    var curTime = 0;

    for (var i in cmd) {
      if (cmd[i].playTime > curTime) {
        var delay = cc.delayTime(cmd[i].playTime - curTime);
        actionArray.push(delay);
      }

      if (cmd[i].action == "moveTo") {
        var x = (cmd[i].pos.x - 0.5) * _ConstValue.CELL_WIDTH;
        var y = (cmd[i].pos.y - 0.5) * _ConstValue.CELL_HEIGHT;
        var move = cc.moveTo(_ConstValue.ANITIME.TOUCH_MOVE, cc.v2(x, y));
        actionArray.push(move);
      } else if (cmd[i].action == "toDie") {
        if (this.status == _ConstValue.CELL_STATUS.BIRD) {
          var animation = this.node.getComponent(cc.Animation);
          animation.play("effect");
          actionArray.push(cc.delayTime(_ConstValue.ANITIME.BOMB_BIRD_DELAY));
        }

        var callFunc = cc.callFunc(function () {
          this.node.destroy();
        }, this);
        actionArray.push(callFunc);
      } else if (cmd[i].action == "setVisible") {
        (function () {
          var isVisible = cmd[i].isVisible;
          actionArray.push(cc.callFunc(function () {
            if (isVisible) {
              this.node.opacity = 255;
            } else {
              this.node.opacity = 0;
            }
          }, _this));
        })();
      } else if (cmd[i].action == "toShake") {
        var rotateRight = cc.rotateBy(0.06, 30);
        var rotateLeft = cc.rotateBy(0.12, -60);
        actionArray.push(cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2));
      }

      curTime = cmd[i].playTime + cmd[i].keepTime;
    }
    /**
     * 智障的引擎设计，一群SB
     */


    if (actionArray.length == 1) {
      this.node.runAction(actionArray[0]);
    } else {
      var _cc;

      this.node.runAction((_cc = cc).sequence.apply(_cc, actionArray));
    }
  },
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {
  // },
  setSelect: function setSelect(flag) {
    var animation = this.node.getComponent(cc.Animation);
    var bg = this.node.getChildByName("select");

    if (flag == false && this.isSelect && this.model.status == _ConstValue.CELL_STATUS.COMMON) {
      animation.stop();
      this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame;
    } else if (flag && this.model.status == _ConstValue.CELL_STATUS.COMMON) {
      animation.play(_ConstValue.CELL_STATUS.CLICK);
    } else if (flag && this.model.status == _ConstValue.CELL_STATUS.BIRD) {
      animation.play(_ConstValue.CELL_STATUS.CLICK);
    }

    bg.active = flag;
    this.isSelect = flag;
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvVmlldy9DZWxsVmlldy5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImRlZmF1bHRGcmFtZSIsInR5cGUiLCJTcHJpdGVGcmFtZSIsIm9uTG9hZCIsImlzU2VsZWN0IiwiaW5pdFdpdGhNb2RlbCIsIm1vZGVsIiwieCIsInN0YXJ0WCIsInkiLCJzdGFydFkiLCJub2RlIiwiQ0VMTF9XSURUSCIsIkNFTExfSEVJR0hUIiwiYW5pbWF0aW9uIiwiZ2V0Q29tcG9uZW50IiwiQW5pbWF0aW9uIiwic3RhdHVzIiwiQ0VMTF9TVEFUVVMiLCJDT01NT04iLCJzdG9wIiwicGxheSIsInVwZGF0ZVZpZXciLCJjbWQiLCJsZW5ndGgiLCJhY3Rpb25BcnJheSIsImN1clRpbWUiLCJpIiwicGxheVRpbWUiLCJkZWxheSIsImRlbGF5VGltZSIsInB1c2giLCJhY3Rpb24iLCJwb3MiLCJtb3ZlIiwibW92ZVRvIiwiQU5JVElNRSIsIlRPVUNIX01PVkUiLCJ2MiIsIkJJUkQiLCJCT01CX0JJUkRfREVMQVkiLCJjYWxsRnVuYyIsImRlc3Ryb3kiLCJpc1Zpc2libGUiLCJvcGFjaXR5Iiwicm90YXRlUmlnaHQiLCJyb3RhdGVCeSIsInJvdGF0ZUxlZnQiLCJyZXBlYXQiLCJzZXF1ZW5jZSIsImtlZXBUaW1lIiwicnVuQWN0aW9uIiwic2V0U2VsZWN0IiwiZmxhZyIsImJnIiwiZ2V0Q2hpbGRCeU5hbWUiLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsIkNMSUNLIiwiYWN0aXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxZQUFZLEVBQUM7QUFD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QUFXVyxNQUFYLElBQXFCQyx3QkFBWXFCLElBQTVDLEVBQWlEO0FBQ2xEekIsTUFBQUEsU0FBUyxDQUFDTyxJQUFWLENBQWVILHdCQUFZd0MsS0FBM0I7QUFDSDs7QUFDREosSUFBQUEsRUFBRSxDQUFDSyxNQUFILEdBQVlOLElBQVo7QUFDQSxTQUFLakQsUUFBTCxHQUFnQmlELElBQWhCO0FBQ0g7QUFySEksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDRUxMX1NUQVRVUywgQ0VMTF9XSURUSCwgQ0VMTF9IRUlHSFQsIEFOSVRJTUV9IGZyb20gJy4uL01vZGVsL0NvbnN0VmFsdWUnO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBkZWZhdWx0RnJhbWU6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vdGhpcy5tb2RlbCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNTZWxlY3QgPSBmYWxzZTtcbiAgICB9LFxuICAgIGluaXRXaXRoTW9kZWw6IGZ1bmN0aW9uKG1vZGVsKXtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB2YXIgeCA9IG1vZGVsLnN0YXJ0WDtcbiAgICAgICAgdmFyIHkgPSBtb2RlbC5zdGFydFk7XG4gICAgICAgIHRoaXMubm9kZS54ID0gQ0VMTF9XSURUSCAqICh4IC0gMC41KTtcbiAgICAgICAgdGhpcy5ub2RlLnkgPSBDRUxMX0hFSUdIVCAqICh5IC0gMC41KTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGlmIChtb2RlbC5zdGF0dXMgPT0gQ0VMTF9TVEFUVVMuQ09NTU9OKXtcbiAgICAgICAgICAgIGFuaW1hdGlvbi5zdG9wKCk7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBhbmltYXRpb24ucGxheShtb2RlbC5zdGF0dXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDmiafooYznp7vliqjliqjkvZxcbiAgICB1cGRhdGVWaWV3OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY21kID0gdGhpcy5tb2RlbC5jbWQ7XG4gICAgICAgIGlmKGNtZC5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhY3Rpb25BcnJheSA9IFtdO1xuICAgICAgICB2YXIgY3VyVGltZSA9IDA7XG4gICAgICAgIGZvcih2YXIgaSBpbiBjbWQpe1xuICAgICAgICAgICAgaWYoIGNtZFtpXS5wbGF5VGltZSA+IGN1clRpbWUpe1xuICAgICAgICAgICAgICAgIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZShjbWRbaV0ucGxheVRpbWUgLSBjdXJUaW1lKTtcbiAgICAgICAgICAgICAgICBhY3Rpb25BcnJheS5wdXNoKGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNtZFtpXS5hY3Rpb24gPT0gXCJtb3ZlVG9cIil7XG4gICAgICAgICAgICAgICAgdmFyIHggPSAoY21kW2ldLnBvcy54IC0gMC41KSAqIENFTExfV0lEVEg7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSAoY21kW2ldLnBvcy55IC0gMC41KSAqIENFTExfSEVJR0hUO1xuICAgICAgICAgICAgICAgIHZhciBtb3ZlID0gY2MubW92ZVRvKEFOSVRJTUUuVE9VQ0hfTU9WRSwgY2MudjIoeCx5KSk7XG4gICAgICAgICAgICAgICAgYWN0aW9uQXJyYXkucHVzaChtb3ZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoY21kW2ldLmFjdGlvbiA9PSBcInRvRGllXCIpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RhdHVzID09IENFTExfU1RBVFVTLkJJUkQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImVmZmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uQXJyYXkucHVzaChjYy5kZWxheVRpbWUoQU5JVElNRS5CT01CX0JJUkRfREVMQVkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxGdW5jID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9LHRoaXMpO1xuICAgICAgICAgICAgICAgIGFjdGlvbkFycmF5LnB1c2goY2FsbEZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihjbWRbaV0uYWN0aW9uID09IFwic2V0VmlzaWJsZVwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNWaXNpYmxlID0gY21kW2ldLmlzVmlzaWJsZTtcbiAgICAgICAgICAgICAgICBhY3Rpb25BcnJheS5wdXNoKGNjLmNhbGxGdW5jKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlzVmlzaWJsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSx0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGNtZFtpXS5hY3Rpb24gPT0gXCJ0b1NoYWtlXCIpe1xuICAgICAgICAgICAgICAgIGxldCByb3RhdGVSaWdodCA9IGNjLnJvdGF0ZUJ5KDAuMDYsMzApO1xuICAgICAgICAgICAgICAgIGxldCByb3RhdGVMZWZ0ID0gY2Mucm90YXRlQnkoMC4xMiwgLTYwKTtcbiAgICAgICAgICAgICAgICBhY3Rpb25BcnJheS5wdXNoKGNjLnJlcGVhdChjYy5zZXF1ZW5jZShyb3RhdGVSaWdodCwgcm90YXRlTGVmdCwgcm90YXRlUmlnaHQpLCAyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJUaW1lID0gY21kW2ldLnBsYXlUaW1lICsgY21kW2ldLmtlZXBUaW1lO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmbrpmpznmoTlvJXmk47orr7orqHvvIzkuIDnvqRTQlxuICAgICAgICAgKi9cbiAgICAgICAgaWYoYWN0aW9uQXJyYXkubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihhY3Rpb25BcnJheVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoLi4uYWN0aW9uQXJyYXkpKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuICAgIHNldFNlbGVjdDogZnVuY3Rpb24oZmxhZyl7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHZhciBiZyA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcInNlbGVjdFwiKTtcbiAgICAgICAgaWYoZmxhZyA9PSBmYWxzZSAmJiB0aGlzLmlzU2VsZWN0ICYmIHRoaXMubW9kZWwuc3RhdHVzID09IENFTExfU1RBVFVTLkNPTU1PTil7XG4gICAgICAgICAgICBhbmltYXRpb24uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5kZWZhdWx0RnJhbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihmbGFnICYmIHRoaXMubW9kZWwuc3RhdHVzID09IENFTExfU1RBVFVTLkNPTU1PTil7XG4gICAgICAgICAgICBhbmltYXRpb24ucGxheShDRUxMX1NUQVRVUy5DTElDSyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihmbGFnICYmIHRoaXMubW9kZWwuc3RhdHVzID09IENFTExfU1RBVFVTLkJJUkQpe1xuICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoQ0VMTF9TVEFUVVMuQ0xJQ0spO1xuICAgICAgICB9XG4gICAgICAgIGJnLmFjdGl2ZSA9IGZsYWc7IFxuICAgICAgICB0aGlzLmlzU2VsZWN0ID0gZmxhZztcbiAgICB9XG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------
