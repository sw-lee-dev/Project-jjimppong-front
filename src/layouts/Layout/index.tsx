import React, { useEffect, useRef, useState } from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router';
import NavLogo from 'src/assets/images/small_logo.png'

import './style.css';
import { ACCESS_TOKEN, AUTH_ABSOLUTE_PATH, JOIN_TYPE, MAIN_ABSOLUTE_PATH, MAP_ABSOLUTE_PATH, MY_PAGE_ABSOLUTE_PATH, MY_PAGE_MAIN_ABSOLUTE_PATH, ROOT_PATH, SNS_ID } from 'src/constants';
import { useCookies } from 'react-cookie';
import { useSignInUser } from 'src/hooks';

import { useSignInUserStore } from 'src/stores';
import { usePasswordReCheckStore } from 'src/stores';


// component : 공통 레이아웃 컴포넌트 //
export default function Layout() {

    // state: 경로 상태 //
    const location = useLocation();
    // state: 로그인 사용자 비밀번호 재확인 상태 - 마이페이지로 이동시 //
    const { isVerified, verify, resetVerify } = usePasswordReCheckStore();

    const { joinType } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies, _, removeCookie] = useCookies();

    const navigator = useNavigate();

    // state: My Content 드롭다운 상태 //
    const [showMyContent, setShowMyContent] = useState<boolean>(false);

    // function: 로그인 유저 정보 불러오기 함수 //
    const getSignInUser = useSignInUser();

    const { resetSignInUser } = useSignInUserStore();

    // event handler: 홈 클릭 이벤트 처리 //
    const onHomeClickHandler = () => {
        removeCookie(JOIN_TYPE, { path: '/' });
        removeCookie(SNS_ID, { path: '/' });
        navigator(MAIN_ABSOLUTE_PATH);
    };

    // event handler: 지도 클릭 이벤트 처리 //
    const onMapClickHandler = () => {
        removeCookie(JOIN_TYPE, { path: '/' });
        removeCookie(SNS_ID, { path: '/' });
        navigator(MAP_ABSOLUTE_PATH);
    }

    // event handler: My Content 클릭 이벤트 처리 //
    const onMyContentClickHandler = () => {
        setShowMyContent(!showMyContent);
    };

    // event handler: 마이페이지 클릭 이벤트 처리 //
    const onMyPageClickHandler = () => {
        if (!isVerified) navigator(MY_PAGE_ABSOLUTE_PATH, {replace: true});
        else navigator(MY_PAGE_MAIN_ABSOLUTE_PATH);
    }

    // event handler : 로그아웃 클릭 이벤트 처리 //
    const onSignOutClickHandler = () => {
        removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
        resetSignInUser();
    }

    // event handler : 로그인 이벤트 처리 //
    const onSignInClickHandler = () => {
        navigator(AUTH_ABSOLUTE_PATH);
    }

    const isMapPage = location.pathname.startsWith('/map')
    const isNotMapPage = !location.pathname.startsWith('/map');


    // effect: cookie의 accessToken이 변경될 시 실행할 함수 //
    useEffect(() => {
        if(!cookies[ACCESS_TOKEN]) return;
        getSignInUser();
    }, [cookies[ACCESS_TOKEN]]);

    // effect: 경로가 /my-page가 아닌 곳에서는 비밀번호 재확인 인증 리셋 실행할 함수 //
    useEffect(() => {
        if (cookies[ACCESS_TOKEN] && joinType !== 'NORMAL') {
            verify();
        } else {
            if (!location.pathname.startsWith('/my-page')) resetVerify();
        }
    }, [cookies, joinType, location.pathname, resetVerify]);

    // state: My Content List 요소 참조 //
    const myContentListRef = useRef<HTMLDivElement | null>(null);

    // Top 버튼 //
    useEffect(() => {
        const topButton = document.getElementById('go-top-btn') as HTMLButtonElement | null;

        if (!topButton) return;

        const windowScroll = () => {
            if (window.scrollY > 100) {
                topButton.classList.add('visible');
            } else {
                topButton.classList.remove('visible');
            }
        };

        const handleClick = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        topButton.addEventListener('click', handleClick);
        window.addEventListener('scroll', windowScroll);

        // cleanup
        return () => {
            topButton.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', windowScroll);
        };
    }, []);

    // useEffect(() => {
    //         let prevX = 0;
    //         let prevY = 0;
        
    //         const handleMouseMove = (e: MouseEvent) => {
    //         const dx = e.clientX - prevX;
    //         const dy = e.clientY - prevY;
        
    //         const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    //         prevX = e.clientX;
    //         prevY = e.clientY;
        
    //         const footprint = document.createElement("div");
    //         footprint.className = "footprint";
    //         footprint.style.left = `${e.clientX}px`;
    //         footprint.style.top = `${e.clientY}px`;
    //         footprint.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            
    //         document.body.appendChild(footprint);
        
    //         setTimeout(() => {
    //             footprint.remove(); // 일정 시간 후 사라지게
    //         }, 1000);
    //         };
        
    //         window.addEventListener("mousemove", handleMouseMove);
    //         return () => window.removeEventListener("mousemove", handleMouseMove);
    //     }, []);

    useEffect(() => {
        const topBar = document.getElementById('top-bar');
        const handleScroll = () => {
            if (!topBar) return;
        
            if (window.scrollY >= window.innerHeight) {
                topBar.classList.add('scrolled');
            } else {
                topBar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div id='layout-wrapper'>
            <div id='top-bar'>
                <div className='navigation'>
                    <div className='navigation-list'>
                        <img className='nav-logo' src={NavLogo} width='50px' onClick={onHomeClickHandler}/>
                        
                                { cookies[ACCESS_TOKEN] ? 
                                    <div className='nav-right-content'>
                                        <div className='map-logo' onClick={onMapClickHandler}>Map</div>
                                        <div className='my-content' onClick={onMyContentClickHandler}>
                                        {showMyContent &&
                                            <div ref={myContentListRef} className='my-content-list'>
                                                <div className='my-content-item' onClick={onMyPageClickHandler}>마이페이지</div>
                                                <div className='my-content-item' onClick={onSignOutClickHandler}>로그아웃</div>
                                            </div>
                                        }
                                        </div>
                                        
                                    </div>
                                    :
                                    <div className='nav-right-content'>

                                        <div className='map-logo' onClick={onMapClickHandler}>Map</div>
                                        <div className='login' onClick={onSignInClickHandler}>Login</div>

                                    </div>
                            }
                    </div>
                </div>
            </div>
            <div id='main'>
                <Outlet />
            </div>
            <div id='go-top-btn'><div>TOP</div></div>
            <div id='footer' className={ isMapPage ? 'fixed-footer' : 'default-footer' } >
                <div>
                👣 Copyright 2025 © 찜뽕! All Rights Reserved.
                </div>
            </div>
        </div>
    )
}
