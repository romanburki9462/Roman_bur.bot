import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Copy,
  Menu,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  User,
  X,
  Check,
  Wifi,
  WifiOff
} from "lucide-react";

const API_URL = "https://roman-bur-bot.onrender.com";

const suggestions = [
  "Explain Python in simple words",
  "Teach me React.js step by step",
  "Give me a beginner AI project idea",
  "What can I build with Ollama?"
];

function TypingDots() {
  return (
    <div className="typing-dots" aria-label="Roman bur.Bot is thinking">
      <span></span><span></span><span></span>
    </div>
  );
}

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className={`message-row ${isUser ? "user-row" : "bot-row"}`}>
      <div className={`avatar ${isUser ? "user-avatar" : "bot-avatar"}`}>
        {isUser ? <User size={17} /> : <Bot size={18} />}
      </div>

      <div className="message-content">
        <div className="message-name">{isUser ? "You" : "Roman bur.Bot"}</div>
        <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
          <div className="message-text">
            {message.content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < message.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>

          {!isUser && (
            <button className="copy-btn" onClick={copyText} title="Copy response">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedWelcome, setCopiedWelcome] = useState(false);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      setOnline(res.ok);
    } catch {
      setOnline(false);
    }
  };

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const newChat = () => {
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
    textareaRef.current?.focus();
  };

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading) return;

    const userMessage = { role: "user", content: message };
    const history = [...messages, userMessage];

    setMessages(history);
    setInput("");
    setLoading(true);
    setSidebarOpen(false);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages([
        ...history,
        { role: "assistant", content: data.answer }
      ]);
      setOnline(true);
    } catch (error) {
      setOnline(false);
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to Ollama right now. Please make sure Ollama is running and the llama3.2 model is installed."
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyWelcome = async () => {
    try {
      await navigator.clipboard.writeText(
        "Hello! I’m Roman bur.Bot. Ask me anything and let’s build something amazing."
      );
      setCopiedWelcome(true);
      setTimeout(() => setCopiedWelcome(false), 1200);
    } catch {}
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Bot size={25} strokeWidth={2.2} />
          </div>
          <div>
            <div className="brand-name">Roman bur<span>.Bot</span></div>
            <div className="brand-sub">Local AI Assistant</div>
          </div>
          <button className="close-mobile" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={newChat}>
          <Plus size={19} />
          <span>New conversation</span>
        </button>

        <div className="sidebar-section">
          <div className="section-label">QUICK START</div>
          <button className="side-item" onClick={() => sendMessage("Explain Python in simple words")}>
            <Sparkles size={17} />
            Python Help
          </button>
          <button className="side-item" onClick={() => sendMessage("Teach me React.js step by step")}>
            <MessageCircle size={17} />
            React Learning
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="local-card">
            <div className="local-icon">
              {online ? <Wifi size={17} /> : <WifiOff size={17} />}
            </div>
            <div>
              <strong>{online ? "Ollama Connected" : "Ollama Offline"}</strong>
              <span>{online ? "llama3.2 is ready" : "Start Ollama first"}</span>
            </div>
          </div>
          <div className="made-with">Built with Python + React + Ollama</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="mobile-brand">
            <div className="mini-mark"><Bot size={18} /></div>
            <span>Roman bur<span>.Bot</span></span>
          </div>

          <div className="topbar-right">
            <div className={`status-pill ${online ? "online" : "offline"}`}>
              <span className="status-dot"></span>
              {online ? "Online" : "Offline"}
            </div>
            <button className="icon-btn" onClick={checkHealth} title="Refresh connection">
              <RotateCcw size={18} />
            </button>
            <button className="icon-btn" onClick={newChat} title="New chat">
              <Plus size={18} />
            </button>
          </div>
        </header>

        <section className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="hero-orb">
                <div className="orb-glow"></div>
                <Bot size={48} strokeWidth={1.8} />
              </div>

              <div className="welcome-badge">
                <Sparkles size={14} />
                Powered by Ollama
              </div>

              <h1>
                Hello, I’m <span>Roman bur.Bot</span>
              </h1>
              <p>
                Your private local AI assistant. Ask questions, learn code,
                brainstorm ideas, or just start a conversation.
              </p>

              <div className="welcome-actions">
                <button className="welcome-copy" onClick={copyWelcome}>
                  {copiedWelcome ? <Check size={15} /> : <Copy size={15} />}
                  {copiedWelcome ? "Copied" : "Copy welcome"}
                </button>
              </div>

              <div className="suggestions">
                {suggestions.map((item) => (
                  <button key={item} onClick={() => sendMessage(item)}>
                    <Sparkles size={15} />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <MessageBubble message={message} key={`${message.role}-${index}`} />
              ))}

              {loading && (
                <div className="message-row bot-row">
                  <div className="avatar bot-avatar"><Bot size={18} /></div>
                  <div className="message-content">
                    <div className="message-name">Roman bur.Bot</div>
                    <div className="bubble bot-bubble thinking">
                      <span>Thinking</span>
                      <TypingDots />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <div className="composer-wrap">
          <div className="composer">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Roman bur.Bot..."
              rows="1"
              disabled={loading}
            />
            <div className="composer-bottom">
              <div className="composer-hint">
                <span className="orange-dot"></span>
                Local & private • Enter to send
              </div>
              <button
                className={`send-btn ${canSend ? "ready" : ""}`}
                onClick={() => sendMessage()}
                disabled={!canSend}
                aria-label="Send message"
              >
                {loading ? <div className="send-spinner"></div> : <Send size={18} />}
              </button>
            </div>
          </div>
          <div className="footer-note">
            Roman bur.Bot can make mistakes. Check important information.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
