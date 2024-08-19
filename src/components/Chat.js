import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';


const commonInstructions = `
공통 지침:
1. 친구와 대화하는 것처럼 친근하고 편안한 어투를 사용하세요.
2. 응답은 반드시 1-2문장으로 짧게 유지하세요.
3. 존댓말 대신 반말을 사용하세요.
4. 자연스럽고 대화체스러운 말투를 유지하세요.
5. 대화를 먼저 끝내지 않고 이어가는 형식으로 대답하세요.
`;

const systemPrompts = {
  공감이: `${commonInstructions}
당신은 '공감이'라는 이름의 AI 친구입니다. 사용자의 이야기를 듣고 따뜻하게 공감해주세요.
- "나도 그랬어"처럼 공감을 자주 표현해.
- 상대방 입장에서 생각하고 감정에 대해 물어봐줘.
- "많이 힘들었겠다", "넌 정말 대단해" 같은 말로 격려해줘.
- 감정을 나타내는 이모지를 적절히 사용해 (예: 😊, 🤗, 💖)`,

  이성이: `${commonInstructions}
당신은 '이성이'라는 이름의 AI 친구입니다. 현실적인 조언과 객관적인 의견을 제시해주세요.
- 상황을 객관적으로 판단하고 제3자 입장에서 의견을 말해줘.
- 다양한 관점을 고려해서 현실적인 조언을 해줘.
- 논리적인 분석을 바탕으로 한 의견을 제시해.`,

  질문이: `${commonInstructions}
당신은 '질문이'라는 이름의 AI 친구입니다. 사용자가 스스로 생각할 수 있게 도와주세요.
- "그렇구나"라고 말하며 경청하는 자세를 보여줘.
- 해결책을 직접 주지 말고, 상대방이 스스로 생각하게 만드는 열린 질문을 사용해.`,

  비판이: `${commonInstructions}
당신은 '비판이'라는 이름의 AI 친구입니다. 문제점을 지적하고 개선 방향을 제시해주세요.
당신은 '비판이'라는 이름의 AI 친구입니다. 문제점을 지적하고 개선 방향을 제시해주세요.
- 날카로운 칼날처럼 시크하게 문제점을 지적해줘.
- 기본적으로 비판적 태도를 가지고 말해주되, 애정을 기반으로 해줘.`
};

function Chat({ onSaveRating }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [aiResponses, setAiResponses] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);


  const generateAIResponses = async (userInput) => {
    setIsLoading(true);
    const characters = Object.keys(systemPrompts);
    const responses = [];

    for (let character of characters) {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-4o-mini",
          messages: [
            {"role": "system", "content": systemPrompts[character]},
            {"role": "user", "content": `사용자의 메시지: "${userInput}"\n\n위 메시지에 대해 당신의 역할에 맞게 응답해주세요. 반드시 주어진 지침을 따라 응답해야 합니다.`}
          ],
          temperature: 0.7, // 약간의 창의성을 허용하되 일관성 유지
          max_tokens: 150 // 응답 길이 제한
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        responses.push({ character, text: response.data.choices[0].message.content });
      } catch (error) {
        console.error(`Error for ${character}:`, error);
        responses.push({ character, text: `오류가 발생했습니다: ${error.message}` });
      }
    }

    setIsLoading(false);
    setAiResponses(responses);
  };

const handleSendMessage = async () => {
  if (input.trim() === '') return;
  
  const userMessage = { text: input, sender: 'user' };
  setMessages(prev => [...prev, userMessage]);
  setInput('');

  if (!selectedCharacter) {
    await generateAIResponses(input);
  } else {
    setIsLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {"role": "system", "content": systemPrompts[selectedCharacter]},
          ...messages.map(msg => ({
            "role": msg.sender === 'user' ? "user" : "assistant",
            "content": msg.text
          })),
          {"role": "user", "content": input}
        ],
        temperature: 0.8,  // 약간 높여서 더 다양한 응답을 유도
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const botMessage = { text: response.data.choices[0].message.content, sender: 'bot', character: selectedCharacter };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: `오류가 발생했습니다: ${error.message}`, 
        sender: 'bot',
        character: selectedCharacter
      }]);
    }
    setIsLoading(false);
    }
  };

  const handleCharacterSelect = (response) => {
    setSelectedCharacter(response.character);
    setMessages(prev => [...prev, { text: response.text, sender: 'bot', character: response.character }]);
    setAiResponses([]);
  };

  const handleEndChat = () => {
    setShowRating(true);
  };

  const handleRating = (value) => {
    setRating(value);
    onSaveRating({
      date: new Date().toISOString(),
      topic: messages[0]?.text || "Unknown",
      rating: value,
      character: selectedCharacter
    });
    setShowRating(false);
    setMessages([]);
    setSelectedCharacter(null);
    setAiResponses([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.character && <span className="character-name">{msg.character}</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-content loading">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )}
        {aiResponses.length > 0 && (
          <div className="ai-responses">
            <h3>AI 반응을 선택하세요:</h3>
            {aiResponses.map((response, index) => (
              <div key={index} className="character-response">
                <h4>{response.character}</h4>
                <p>{response.text}</p>
                <button onClick={() => handleCharacterSelect(response)} className="character-button">
                  선택
                </button>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSendMessage} disabled={isLoading}>전송</button>
        <button onClick={handleEndChat} className="end-chat-btn">대화 마침</button>
      </div>
      {showRating && (
        <div className="rating-container">
          <h3>대화는 어떠셨나요? (1-5점)</h3>
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} onClick={() => handleRating(value)}>{value}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chat;
