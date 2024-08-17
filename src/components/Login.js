import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('로그인:', { username, password });
      // 여기에 로그인 로직 구현
    } else {
      console.log('회원가입:', { username, password });
      // 여기에 회원가입 로직 구현
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? '로그인' : '회원가입'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
          <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '회원가입' : '로그인'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;