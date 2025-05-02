import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const SnsCallback = () => {
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/check-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            snsId: cookies.SNS_ID,
            joinType: cookies.JOIN_TYPE
          })
        });

        const result = await response.json();

        if (result.info) {
          // 기존 회원 - 바로 메인 이동
          navigate('/main');
        } else {
          // 신규 회원 - SNS 회원가입 페이지로 이동
          navigate('/sns-sign-up');
        }
      } catch (error) {
        console.error('SNS 로그인 후 사용자 정보 조회 실패', error);
        navigate('/sign-in');
      }
    };

    fetchUserInfo();
  }, []);

  return;
};

export default SnsCallback;