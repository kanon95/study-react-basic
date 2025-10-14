import React, { useState } from 'react';
import LoginView from '../view/LoginView';

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: 실제 로그인 API 호출
      // const response = await loginAPI(email, password);

      // 임시 로그인 로직 (테스트용)
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('로그인 시도:', { email, password });

      // 성공 시 처리
      // 예: 토큰 저장, 리다이렉트 등
      alert('로그인 성공!');

    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('로그인 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
};

export default LoginContainer;