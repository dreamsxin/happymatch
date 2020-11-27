
export const CELL_TYPE = {
    EMPTY : 0,
    A : 1,
    B : 2,
    C : 3,
    D : 4,
    E : 5,
    F : 6,
    BIRD : 7
}
export const CELL_BASENUM = 6;
export const CELL_STATUS = {
    COMMON: 0 ,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "bird"
}

export const GRID_WIDTH = 9;
export const GRID_HEIGHT = 9;

export const CELL_WIDTH = 70;
export const CELL_HEIGHT = 70;

export const GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
export const GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;

// ********************   时间表  animation time **************************
export const ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.3,
    DOWN: 0.5,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 4.58,
    DIE_SHAKE: 0.4, // 死前抖动
    TIPS:0.4,
    TIPS_ACTION_TAG:10000,
    SHOW:0.2,
    WARAP_TOTAL:0.7
}

window.GAME_SAVE_HANDLER = 'handler_data';
window.INIT_GAME_SAVE_DATA = {
    top_score: 0,
    gold_num: 0,
    top_level: 0,
    login_time: "",
    steps:5,
    items_refresh: 13,
    items_back: 15,
    items_change: 12, 
    items_force:15,
    items_line: 12,
    items_column: 12,
    items_hammer: 13,
    items_magic: 11,
    items_steps: 15
};

window.ITEMS_ADD_STEPS_CONDITION = 6;

