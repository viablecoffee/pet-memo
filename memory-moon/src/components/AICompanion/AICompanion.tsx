import React, { useState, useEffect, useRef } from 'react';
import './AICompanion.css';
import { useStore } from '../../store/useStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const formatMessage = (text: string): string => {
  if (!text) return '';
  let formatted = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/• /g, '<br/>• ')
    .replace(/\n/g, '<br/>');
  return formatted;
};

const AICompanion: React.FC = () => {
  const {
    pet,
    memories,
    apiKey,
    setApiKey,
    aiModel,
    setAiModel,
    aiInsights,
    lastInsightUpdate,
    setAiInsights,
    chatHistory,
    addChatMessage,
    clearChatHistory
  } = useStore();

  const [chatInput, setChatInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(aiModel);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentPet = pet;
  const petMemories = memories;

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isAiTyping]);

  // Initial Insight Generation Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (apiKey && lastInsightUpdate !== today && !isGeneratingInsights) {
      generateDailyInsights(today);
    }
  }, [apiKey, lastInsightUpdate]);

  const generateDailyInsights = async (today: string) => {
    if (!apiKey || !aiModel) return;
    setIsGeneratingInsights(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = `You are Echo, a data-driven pet care advisor. Generate practical, actionable insights based on pet data.`;

      const model = genAI.getGenerativeModel({
        model: aiModel,
        systemInstruction: systemInstruction
      });

      const prompt = `
        Based on this pet data, generate 3 practical care tips:
        Pet: ${currentPet.name}, ${currentPet.breed || 'breed unknown'}, Born: ${currentPet.birthDate || 'unknown'}, Gender: ${currentPet.gender || 'unknown'}, Weight: ${currentPet.weight || 'unknown'}.
        Recent memories: ${petMemories.slice(0, 5).map(m => `${m.title} (${m.date})`).join(', ')}.

        Generate a JSON array with 3 objects. Each object must have:
        - "label": one of "Health Tip", "Memory Suggestion", "Care Reminder"
        - "text": practical advice in 20-30 words, no poetry, no emojis

        Example: [{"label": "Health Tip", "text": "Regular brushing helps reduce shedding and improves coat health."}]
        Return ONLY the raw JSON array.
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const response = await result.response;
      const text = response.text();

      // Better JSON extraction using Regex
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No valid JSON array found in response");

      const parsed = JSON.parse(jsonMatch[0]);
      setAiInsights(parsed, today);
    } catch (error: any) {
      console.error("Failed to generate insights:", error);
      // Fallback to empty if critical fail
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !apiKey || !aiModel || isAiTyping) return;

    const userMsg = { role: 'user' as const, text: chatInput };
    addChatMessage(userMsg);
    setChatInput('');
    setIsAiTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = `You are Echo, a professional pet care advisor for ${currentPet.name}'s owner. Keep your responses brief and concise (2-4 sentences max). Use simple formatting with line breaks. Focus on being practical and actionable. You know ${currentPet.name}'s memories: ${petMemories.map(m => m.title).join(', ')}.`;

      const model = genAI.getGenerativeModel({
        model: aiModel,
        systemInstruction: systemInstruction
      });

      // Reference implementation uses model.generateContent directly for simple chat in some cases
      // but to maintain history we use startChat with refined mapping
      const chat = model.startChat({
        history: chatHistory.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      });

      const result = await chat.sendMessage(chatInput);
      const response = await result.response;
      const botMsg = { role: 'model' as const, text: response.text() };
      addChatMessage(botMsg);
    } catch (error: any) {
      console.error("AI Chat failed:", error);
      const errorMsg = error.message?.includes("API_KEY_INVALID")
        ? "Invalid API Key. Please check your settings!"
        : error.message?.includes("model not found")
          ? "Model not found. Please check the model name in settings!"
          : "Sorry, I lost my connection. Please check your API key and model name in settings.";
      addChatMessage({ role: 'model', text: errorMsg });
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSaveSettings = () => {
    setApiKey(tempApiKey);
    setAiModel(tempModel);
    setIsSettingsOpen(false);
    // Force a retry of insights if key/model changed
    const today = new Date().toISOString().split('T')[0];
    generateDailyInsights(today);
  };

  const avatarUrl = currentPet?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPet?.name || 'Milo'}`;

  return (
    <div className="ai-companion">
      <div className="ai-companion__frame">
        {/* Top Header */}
        <div className="ai-companion__header">
          <button
            className="ai-companion__settings-btn"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="AI Settings"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.3-.06.61-.06.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>
          </button>

          {isSettingsOpen && (
            <div className="ai-settings-panel">
              <h4>Gemini AI Settings</h4>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                Configure your Gemini API Key and Model to enable Echo's intelligence.
              </p>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '10px', color: 'var(--color-moon)', display: 'block', marginBottom: '4px' }}>API KEY</label>
                <input
                  type="password"
                  className="ai-settings-input"
                  placeholder="Paste API Key here..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  style={{ marginBottom: '0' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', color: 'var(--color-moon)', display: 'block', marginBottom: '4px' }}>MODEL NAME</label>
                <input
                  type="text"
                  className="ai-settings-input"
                  placeholder="e.g. gemini-2.5-flash"
                  value={tempModel}
                  onChange={(e) => setTempModel(e.target.value)}
                  style={{ marginBottom: '0' }}
                />
              </div>

              <button className="ai-settings-save-btn" onClick={handleSaveSettings}>Save & Initialize</button>
            </div>
          )}

          <img src="/assets/images/echo_avatar.png" alt="Echo AI Avatar" className="ai-companion__echo-avatar" />
          <div className="ai-companion__header-text">
            <h1 className="ai-companion__title">{currentPet?.name}'s AI Companion: Echo</h1>
            <p className="ai-companion__subtitle">Echo evolves daily based on your shared memories and pet profile.</p>
          </div>
        </div>

        <div className="ai-companion__grid">
          {/* Left Column: AI Insight Dashboard */}
          <div className="ai-column ai-insights">
            <h2 className="ai-column__title">AI Insight Dashboard</h2>
            <div className="ai-insights__list">
              {!apiKey ? (
                <div className="ai-insight-item" style={{ opacity: 0.6 }}>
                  <span>System</span>
                  Please configure your API Key in settings to receive daily insights.
                </div>
              ) : isGeneratingInsights ? (
                <div className="ai-insights-loading">
                  <div className="skeleton" style={{ height: '60px' }}></div>
                  <div className="skeleton" style={{ height: '60px' }}></div>
                  <div className="skeleton" style={{ height: '60px' }}></div>
                </div>
              ) : aiInsights.length > 0 ? (
                aiInsights.map((insight, idx) => (
                  <div key={idx} className="ai-insight-item">
                    <span>{insight.label}</span>
                    {insight.text}
                  </div>
                ))
              ) : (
                <div className="ai-insight-item">
                  <span>Echo</span>
                  Welcome! Once connected, I'll share special insights here every day.
                </div>
              )}
            </div>
          </div>

          {/* Center Column: Conversational Chat Interface */}
          <div className="ai-column ai-chat">
            <h2 className="ai-column__title" style={{ padding: '0 20px', marginBottom: 0 }}>Echo Chat</h2>
            <div className="ai-chat__messages" ref={chatScrollRef}>
              {chatHistory.length === 0 && (
                <div className="ai-msg ai-msg--echo">
                  <img src="/assets/images/echo_avatar.png" alt="Echo" className="ai-msg__avatar" />
                  <div className="ai-msg__bubble">
                    <span className="ai-msg__name">Echo</span>
                    <span>Hello! I'm Echo, your pet care advisor. I've been reviewing {currentPet?.name}'s memories.<br /><br />Feel free to ask me about pet care tips, or let's reminisce about the precious moments you shared together!</span>
                  </div>
                </div>
              )}

              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`ai-msg ai-msg--${msg.role === 'model' ? 'echo' : 'user'}`}>
                  <img
                    src={msg.role === 'model' ? "/assets/images/echo_avatar.png" : avatarUrl}
                    alt={msg.role}
                    className="ai-msg__avatar"
                  />
                  <div className="ai-msg__bubble">
                    <span className="ai-msg__name">{msg.role === 'model' ? 'Echo' : 'You'}</span>
                    <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="ai-msg ai-msg--echo">
                  <img src="/assets/images/echo_avatar.png" alt="Echo" className="ai-msg__avatar" />
                  <div className="ai-msg__bubble">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="ai-chat__input-area">
              <div className="ai-chat__input-wrapper">
                <input
                  type="text"
                  placeholder={apiKey ? "Message Echo..." : "Set API Key to start chatting..."}
                  className="ai-chat__input"
                  value={chatInput}
                  disabled={!apiKey || isAiTyping}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>
              <button
                className="ai-chat__send-btn"
                onClick={handleSendMessage}
                disabled={!apiKey || !chatInput.trim() || isAiTyping}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            {chatHistory.length > 0 && (
              <button
                onClick={clearChatHistory}
                style={{ fontSize: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '10px' }}
              >
                Clear Conversation
              </button>
            )}
          </div>

          {/* Right Column: Future Feature Suggestions (Placeholder) */}
          <div className="ai-column ai-suggestions">
            <h2 className="ai-column__title">Evolving Skills</h2>
            <div className="ai-suggestions__placeholder">
              <span className="ai-suggestions__icon">✨</span>
              <p>As you add more memories, Echo will learn new skills like "Memory Video Synthesis".</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
