import React, { useState, useMemo } from 'react';
import './AICompanion.css';
import { useStore } from '../../store/useStore';

const AICompanion: React.FC = () => {
  const { pet, memories } = useStore();
  const [chatInput, setChatInput] = useState('');

  const currentPet = pet;
  const petMemories = memories;

  // Mock Gemini Flash personalized suggestions
  const personalizedInsights = useMemo(() => {
    if (!currentPet) return [];

    const insights = [
      {
        label: "Wellness Tip",
        text: `Based on ${currentPet.name}'s breed (${currentPet.breed || 'Dog'}), regular joint supplements might be beneficial as they age.`
      },
      {
        label: "Memory Insight",
        text: petMemories.length > 0
          ? `You've captured ${petMemories.length} memories! Echo notes that ${currentPet.name} seems happiest during outdoor adventures.`
          : `Echo suggests starting your first memory together! Recording small moments helps build a deeper connection.`
      },
      {
        label: "Daily Suggestion",
        text: `The weather looks perfect for a walk. Why not recreate the joy of your "${petMemories[0]?.title || 'first walk'}" today?`
      }
    ];
    return insights;
  }, [currentPet, petMemories]);

  const avatarUrl = currentPet?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPet?.name || 'Milo'}`;

  return (
    <div className="ai-companion">
      <div className="ai-companion__frame">
        {/* Top Header */}
        <div className="ai-companion__header">
          <img src="/assets/images/echo_avatar.png" alt="Echo AI Avatar" className="ai-companion__echo-avatar" />
          <h1 className="ai-companion__title">{currentPet?.name}'s AI Companion: Echo</h1>
          <p className="ai-companion__subtitle">
            A friendly guide through {currentPet?.name}'s joyful real-life memories and your new adventures together.
          </p>
        </div>

        <div className="ai-companion__grid">
          {/* Left Column: AI Insight Dashboard */}
          <div className="ai-column ai-insights">
            <h2 className="ai-column__title">AI Insight Dashboard</h2>
            <div className="ai-insights__list">
              {personalizedInsights.map((insight, idx) => (
                <div key={idx} className="ai-insight-item">
                  <span>{insight.label}</span>
                  {insight.text}
                </div>
              ))}
            </div>
          </div>

          {/* Center Column: Conversational Chat Interface */}
          <div className="ai-column ai-chat">
            <h2 className="ai-column__title" style={{ padding: '0 20px', marginBottom: 0 }}>Conversational Chat Interface</h2>
            <div className="ai-chat__messages">
              {/* Message from Echo */}
              <div className="ai-msg ai-msg--echo">
                <img src="/assets/images/echo_avatar.png" alt="Echo" className="ai-msg__avatar" />
                <div className="ai-msg__bubble">
                  <span className="ai-msg__name">Echo</span>
                  {currentPet?.name}, your story about the {petMemories[0]?.title || 'adoption day'} is so heartwarming. Want to talk more about it?
                </div>
              </div>

              {/* Message from User */}
              <div className="ai-msg ai-msg--user">
                <img src={avatarUrl} alt="User" className="ai-msg__avatar" />
                <div className="ai-msg__bubble">
                  <span className="ai-msg__name">You</span>
                  Echo, can you tell me more about {currentPet?.name}'s favorite activities?
                </div>
              </div>

              <div className="ai-msg ai-msg--echo">
                <img src="/assets/images/echo_avatar.png" alt="Echo" className="ai-msg__avatar" />
                <div className="ai-msg__bubble">
                  <span className="ai-msg__name">Echo</span>
                  Certainly! Based on your memories, {currentPet?.name} loves playing in the snow and long summer walks.
                </div>
              </div>
            </div>

            <div className="ai-chat__input-area">
              <div className="ai-chat__input-wrapper">
                <input
                  type="text"
                  placeholder="Message Echo..."
                  className="ai-chat__input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
              </div>
              <button className="ai-chat__send-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Future Feature Suggestions (Placeholder) */}
          <div className="ai-column ai-suggestions">
            <h2 className="ai-column__title">Future Feature Suggestions</h2>
            <div className="ai-suggestions__placeholder">
              <span className="ai-suggestions__icon">✨</span>
              <p>New AI features like "Memory Video Synthesis" and "Predictive Health Alerts" are coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
