import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Report.css';

function Report({ ratings }) {
  const [processedRatings, setProcessedRatings] = useState([]);

  useEffect(() => {
    const processRatings = async () => {
      const processed = await Promise.all(ratings.map(async (rating) => {
        const keywords = await extractKeywords(rating.topic);
        return { ...rating, keywords };
      }));
      setProcessedRatings(processed);
    };

    processRatings();
  }, [ratings]);

  const extractKeywords = async (text) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {"role": "system", "content": "You are a helpful assistant that extracts key topics from text."},
          {"role": "user", "content": `Extract 1-3 key topics from the following text, separated by commas: "${text}"`}
        ],
        temperature: 0.3,
        max_tokens: 50
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.split(',').map(keyword => keyword.trim());
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return ['키워드 추출 실패'];
    }
  };

  return (
    <div className="report-container">
      <h2>채팅 리포트</h2>
      <div className="report-grid">
        {processedRatings.map((rating, index) => (
          <div key={index} className="report-card">
            <div className="report-date">{new Date(rating.date).toLocaleDateString()}</div>
            <div className="report-character">{rating.character}</div>
            <div className="report-topics">
              {rating.keywords.map((keyword, idx) => (
                <span key={idx} className="topic-tag">{keyword}</span>
              ))}
            </div>
            <div className="report-rating">
              평점: {rating.rating}/5
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= rating.rating ? 'star filled' : 'star'}>★</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Report;