import React, { useState, useRef, useEffect } from 'react';
import WobbleSphere from './WobbleSphere'; // Ensure the path is correct

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

function App() {
  const [input, setInput] = useState('');
  const [inputExpanded, setInputExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiTyping, setAiTyping] = useState('');
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [pendingReply, setPendingReply] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput('');
    setAiTyping('');
    setShowTypewriter(false);
    setPendingReply('');
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const reply = data.reply || 'No response from AI.';
      setPendingReply(reply);
      setTimeout(() => {
        setShowTypewriter(true);
        setLoading(false);
      }, 1200); // Show spinner for 1.2s before typewriter
    } catch (err) {
      console.error("Error sending message:", err); // Log the actual error
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to server.' } as Message
      ]);
      setAiTyping('');
      setShowTypewriter(false);
      setLoading(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (showTypewriter && pendingReply) {
      let i = 0;
      const typeLine = () => {
        if (i <= pendingReply.length) {
          setAiTyping(pendingReply.slice(0, i));
          i++;
          setTimeout(typeLine, 20);
        } else {
          setMessages(prev => [...prev, { sender: 'ai', text: pendingReply }]);
          setAiTyping('');
          setShowTypewriter(false);
          setPendingReply('');
        }
      };
      typeLine();
    }
  }, [showTypewriter, pendingReply]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex h-screen w-screen bg-[#0000008e] text-white  font-[Inter]">
        <aside className="fixed top-0 left-0 w-[250px] h-screen bg-[#20232a] flex flex-col items-center z-10 shadow-lg mobile-hide">
          <button
            className="w-[30px] h-[48px] bg-transparent border-none text-[#3c3b3d] text-[1.5rem] cursor-pointer mt-3 flex items-center justify-center transition-colors rounded-lg hover:bg-[#23272f]"
            title="New Chat"
            onClick={handleNewChat}
          >
            <span className="text-[1.6rem] leading-none">＋</span>
          </button>
        </aside>
        <main className="ml-[250px] flex flex-col items-center justify-center h-screen w-[calc(100vw-250px)] relative mobile-main">
          <div className="flex flex-col items-center justify-end h-full w-full max-w-[800px] mx-auto relative pb-32">
            {/* Conditional rendering of WobbleSphere when no messages are present */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center w-full h-[320px]">
                <div className="w-full flex items-center justify-center relative h-[220px]">
                  <div className="absolute left-1/2 top-30 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] transition-opacity duration-700 mobile-wobble" style={{ opacity: loading ? 0.15 : 1 }}>
                    <WobbleSphere />
                  </div>
                </div>
              </div>
            )}
            {/* Chat history/answers above input */}
            {messages.length > 0 && (
              <div className="flex-1 w-full overflow-y-auto flex flex-col gap-4 pb-4 pt-8 pr-2 mobile-chat" style={{maxHeight: 'calc(100vh - 180px)'}}>
                {messages.map((msg, idx) =>
                  msg.sender === 'user' ? (
                    <div
                      key={idx}
                      className="self-end max-w-[60%] px-4 py-2 rounded-2xl text-base leading-relaxed bg-[#23272f] text-white mb-1"
                      style={{wordBreak: 'break-word'}}
                    >
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="self-start w-full max-w-[95%] px-0 py-0 rounded-2xl text-base leading-relaxed bg-transparent text-[#e3e3e3] mb-1 flex flex-col gap-0"
                      style={{wordBreak: 'break-word'}}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <span className={`text-[#e06c88] text-[2.2rem] -mt-2 ${loading && idx === messages.length-1 && !aiTyping ? 'animate-spin-slow' : ''}`}>✦</span>
                        <span className="text-[#e3e3e3] bg-transparent px-0 py-0 w-full whitespace-pre-line" style={{fontWeight: 400, fontSize: '1.08rem', lineHeight: '1.7'}}>{msg.text}</span>
                      </div>
                      {/* Action buttons row */}
                      <div className="flex items-center gap-3 mt-2 ml-8">
                        {/* Thumbs up */}
                        <button className="hover:bg-white/10 rounded p-1" title="Like">
                          <svg width="20" height="20" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 12v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7"/><path d="M12 19V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                        {/* Thumbs down */}
                        <button className="hover:bg-white/10 rounded p-1" title="Dislike">
                          <svg width="20" height="20" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 12v-7a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7"/><path d="M12 5v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2"/></svg>
                        </button>
                        {/* Copy */}
                        <button className="hover:bg-white/10 rounded p-1" title="Copy">
                          <svg width="20" height="20" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>
                        </button>
                        {/* Share */}
                        <button className="hover:bg-white/10 rounded p-1" title="Share">
                          <svg width="20" height="20" fill="none" stroke="#bdbdbd" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51l-6.82 3.98"/></svg>
                        </button>
                        {/* 3 Dots */}
                        <button className="hover:bg-white/10 rounded p-1" title="More">
                          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                        </button>
                      </div>
                    </div>
                  )
                )}
                {loading && !showTypewriter && (
                  <div className="self-start w-full max-w-[95%] px-0 py-0 rounded-2xl text-base leading-relaxed bg-transparent text-[#e3e3e3] mb-1 flex flex-col gap-0">
                    <div className="flex items-start gap-3 w-full">
                      <span className="text-[#e06c88] text-[2.2rem] -mt-2 animate-spin-slow">✦</span>
                      <span className="text-[#e3e3e3] bg-transparent px-0 py-0 w-full whitespace-pre-line" style={{fontWeight: 400, fontSize: '1.08rem', lineHeight: '1.7'}}>Thinking...</span>
                    </div>
                  </div>
                )}
                {aiTyping && (
                  <div className="self-start w-full max-w-[95%] px-0 py-0 rounded-2xl text-base leading-relaxed bg-transparent text-[#e3e3e3] mb-1 flex flex-col gap-0">
                    <div className="flex items-start gap-3 w-full">
                      <span className="text-[#e06c88] text-[2.2rem] -mt-2">✦</span>
                      <span className="text-[#e3e3e3] bg-transparent px-0 py-0 w-full whitespace-pre-line" style={{fontWeight: 400, fontSize: '1.08rem', lineHeight: '1.7'}}>{aiTyping}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
            {/* Input/question container centered at bottom */}
            <div className="w-full flex items-center justify-center absolute left-1/2 bottom-8 -translate-x-1/2 z-10 mobile-input">
              <div className="flex flex-col items-center w-[420px] max-w-[90vw]">
                <button
                  className="self-end mb-1 px-2 py-1 text-xs rounded bg-[#23272f] text-white hover:bg-[#353945] border border-[#353945]"
                  onClick={() => setInputExpanded(e => !e)}
                  title={inputExpanded ? 'Shrink input' : 'Expand input'}
                >
                  {inputExpanded ? '− ' : '+ '}
                </button>
                <div className={`flex items-center bg-[#23272f] rounded-[24px] shadow-lg px-4 py-2 w-full transition-all duration-200 ${inputExpanded ? 'h-32' : 'h-14'}`}
                  style={{ minHeight: inputExpanded ? 96 : 56, maxHeight: 190 }}>
                  <textarea
                    className="flex-1 bg-transparent border-none outline-none text-white text-[1.1rem] px-3 py-2 resize-none max-h-32 min-h-[2.5rem] overflow-y-auto"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    disabled={loading}
                    autoFocus
                    rows={inputExpanded ? 4 : 1}
                    style={{height: inputExpanded ? '5.5rem' : '2.5rem'}}
                  />
                  <button
                    className="bg-gradient-to-r from-[#5b7fff] to-[#e06c88] text-white font-semibold rounded-[20px] px-5 py-2 ml-2 text-base cursor-pointer transition-all hover:from-[#e06c88] hover:to-[#5b7fff]"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="absolute right-0 top-0 h-full w-[25vw] pointer-events-none z-0 overflow-hidden">
          {/* <WobbleSphere /> removed from here, as it's now in the center when messages.length === 0 */}
        </div>
      </div>
    </div>
  );
}

export default App;