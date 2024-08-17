import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Chat from './components/Chat';
import Report from './components/Report';
import Login from './components/Login';



function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [chatRatings, setChatRatings] = useState([]);

  const handleSaveRating = (ratingData) => {
    setChatRatings(prev => [...prev, ratingData]);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home />;
      case 'chat': return <Chat onSaveRating={handleSaveRating} />;
      case 'report': return <Report ratings={chatRatings} />;
      case 'login': return <Login />;
      default: return <Home />;
    }
  };

 
  return (
    <div className="app-container">
      <main className="app-main">
        {renderPage()}
      </main>
      <nav className="app-nav">
        <button 
          onClick={() => setCurrentPage('home')}
          className={currentPage === 'home' ? 'active' : ''}
        >
          홈
        </button>
        <button 
          onClick={() => setCurrentPage('chat')}
          className={currentPage === 'chat' ? 'active' : ''}
        >
          채팅
        </button>
        <button 
          onClick={() => setCurrentPage('report')}
          className={currentPage === 'report' ? 'active' : ''}
        >
          리포트
        </button>
        <button 
          onClick={() => setCurrentPage('login')}
          className={currentPage === 'login' ? 'active' : ''}
        >
          로그인
        </button>
      </nav>
    </div>
  );
}

export default App;