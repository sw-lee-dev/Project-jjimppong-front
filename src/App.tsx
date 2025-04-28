import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import Layout from './layouts/Layout';
import Main from './views/Main';

import NaverMap from './map/NaverMap';
import { AUTH_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_VIEW_PATH, BOARD_WRITE_PATH, MAIN_PATH, MAP_PATH, MY_PAGE_MAIN_PATH, MY_PAGE_PATH, OTHERS_PATH } from './constants';
import Auth from './views/Auth';
import BoardMain from './views/Board';
import BoardWrite from './views/Board/Write';
import BoardDetail from './views/Board/Detail';
import BoardUpdate from './views/Board/Update';
import MyPagePasswordCheck from './views/MyPage/PasswordCheck';
import MyPageMain from './views/MyPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
      <Route index element={<Main />} />
        <Route path={MAIN_PATH} element={<Main />} />
        <Route path={MAP_PATH} element={<NaverMap />} />
        <Route path={AUTH_PATH} element={<Auth />} />

        <Route path={BOARD_PATH}>
          <Route index element={<BoardMain />} />
          <Route path={BOARD_WRITE_PATH} element={<BoardWrite />} />
          <Route path={BOARD_VIEW_PATH}>
            <Route index element={<BoardDetail />} />
            <Route path={BOARD_UPDATE_PATH} element={<BoardUpdate />} />
          </Route>
        </Route>

        <Route path={MY_PAGE_PATH}>
          <Route index element={<MyPagePasswordCheck />} />
          <Route path={MY_PAGE_MAIN_PATH} element={<MyPageMain />} />
        </Route>

        <Route path={OTHERS_PATH} element={<>404 페이지</>} />
      </Route>
    </Routes>
  );
}

export default App;
