// variable: 상대 path 상수 //
export const ROOT_PATH = '/';
export const AUTH_PATH = 'auth';
export const MAIN_PATH = 'main';
export const MAP_PATH = 'map';
export const BOARD_PATH = 'board';
export const BOARD_WRITE_PATH = 'write';
export const BOARD_VIEW_PATH = ':boardNumber';
export const BOARD_UPDATE_PATH = 'update';
export const MY_PAGE_PATH = 'my-page';
export const MY_PAGE_MAIN_PATH = 'my-main';
export const OTHERS_PATH = '*';

// variable: 절대 path 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;
export const AUTH_ABSOLUTE_PATH = `${ROOT_PATH}${AUTH_PATH}`;
export const MAIN_ABSOLUTE_PATH = `${ROOT_PATH}${MAIN_PATH}`;
export const MAP_ABSOLUTE_PATH = `${ROOT_PATH}${MAP_PATH}`;
export const BOARD_ABSOLUTE_PATH = `${ROOT_PATH}${BOARD_PATH}`;
export const BOARD_WRITE_ABSOLUTE_PATH = `${ROOT_PATH}${BOARD_PATH}/${BOARD_WRITE_PATH}`;
export const BOARD_VIEW_ABSOLUTE_PATH = (boardNumber: number | string) => `${ROOT_PATH}${BOARD_PATH}/${boardNumber}`;
export const BOARD_UPDATE_ABSOLUTE_PATH = (boardNumber: number | string) => `${ROOT_PATH}${BOARD_PATH}/${boardNumber}/${BOARD_UPDATE_PATH}`;
export const MY_PAGE_ABSOLUTE_PATH = `${ROOT_PATH}${MY_PAGE_PATH}`;
export const MY_PAGE_MAIN_ABSOLUTE_PATH = `${ROOT_PATH}${MY_PAGE_PATH}/${MY_PAGE_MAIN_PATH}`;

// variable: access token 속성명 //
export const ACCESS_TOKEN = 'accessToken';

// variable: join type 속성명 //
export const JOIN_TYPE = 'joinType';

// variable: sns id 속성명 //
export const SNS_ID = 'snsId';