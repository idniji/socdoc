import React from 'react';
import './Home.css'; // 홈 컴포넌트를 위한 별도의 CSS 파일

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">나만의 AI친구, 속닥이!</h1>
      <p className="home-subtitle">ChatGPT 기반의 챗봇 서비스입니다.</p>
      <div className="feature-container">
        <div className="feature-item">
          <i className="fas fa-comments"></i>
          <h3>4가지 감정 캐릭터와 대화</h3>
          <p>AI와 실시간으로 대화를 나눠보세요.</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-chart-bar"></i>
          <h3>상세한 리포트</h3>
          <p>대화 내역과 통계를 확인할 수 있습니다.</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-lock"></i>
          <h3>안전한 로그인</h3>
          <p>개인정보를 안전하게 보호합니다.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;