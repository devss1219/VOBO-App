import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'

/* ═══════════════ NAVBAR ═══════════════ */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">🎙️</div>
        <span className="navbar-title">
          VOICE AI <span className="dot">·</span> VOLIOD
        </span>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="#voice-tool" onClick={() => setMenuOpen(false)}>Voice Tool</a></li>
        <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
        <li><a href="#problem-solution" onClick={() => setMenuOpen(false)}>Why VOLIOD</a></li>
        <li><a href="#architecture" onClick={() => setMenuOpen(false)}>Architecture</a></li>
        <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>Workflow</a></li>
        <li>
          <a href="#voice-tool" className="navbar-cta" onClick={() => setMenuOpen(false)}>
            Try Now
          </a>
        </li>
      </ul>

      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  )
}

/* ═══════════════ VOICE TOOL (Main Feature) ═══════════════ */
function VoiceTool() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const recRef = useRef(null)

  const toggleListening = () => {
    if (isListening) {
      recRef.current?.stop()
      setIsListening(false)
      return
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setTranscript('Speech recognition not supported in this browser.')
      return
    }

    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = true

    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
    }

    rec.onend = () => {
      setIsListening(false)
      if (transcript) {
        setTimeout(() => {
          setResponse(
            `🎬 Based on "${transcript}", here are your options:\n\n` +
            `1. PVR Cinemas, CP — 7:00 PM\n` +
            `2. INOX, Nehru Place — 7:30 PM\n` +
            `3. Cinepolis, DLF Mall — 8:15 PM\n\n` +
            `Shall I book tickets for you?`
          )
        }, 600)
      }
    }

    rec.onerror = () => {
      setIsListening(false)
      setTranscript('Could not capture audio. Try again.')
    }

    recRef.current = rec
    rec.start()
    setIsListening(true)
    setResponse('')
  }

  return (
    <div className="voice-tool" id="voice-tool">
      <div className="voice-tool-header">
        <div className="voice-tool-title">
          <span className="tool-icon">🎙️</span>
          Voice Concierge
        </div>
        <div className="status-badge">
          <span className="dot"></span>
          Ready
        </div>
      </div>

      <div className="mic-area">
        <button
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          id="mic-button"
          aria-label={isListening ? 'Stop' : 'Start listening'}
        >
          {isListening ? '⏹️' : '🎙️'}
          {isListening && (
            <>
              <div className="rip-1"></div>
              <div className="rip-2"></div>
              <div className="rip-3"></div>
            </>
          )}
        </button>
        <p className="mic-hint">
          {isListening ? '🔴 Listening...' : 'Tap to speak your movie preference'}
        </p>
      </div>

      <div className="transcript-box">
        <p>{transcript || 'Voice input will appear here...'}</p>
      </div>

      {response && (
        <div className="ai-response">
          <p className="resp-label">🤖 AI Response</p>
          <p style={{ whiteSpace: 'pre-line' }}>{response}</p>
        </div>
      )}
    </div>
  )
}

/* ═══════════════ HERO + VOICE TOOL (Parallel) ═══════════════ */
function HeroSection() {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left: Text */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Voice-First AI Movie Concierge
            </div>

            <h1 className="hero-heading">
              <span className="highlight">Voice-First AI</span>
              <br />
              VOLIOD
            </h1>

            <p className="hero-subtitle">
              Zero Typing. Zero Scrolling.<br />
              Pure Hands-Free Booking.
            </p>

            <div className="hero-team">
              <span className="team-label">Team:</span>
              <span className="team-member">Shobhit Saxena (BCS2023036)</span>
              <span className="team-sep">·</span>
              <span className="team-member">Ridhima (BCS2023059)</span>
              <span className="team-sep">·</span>
              <span className="team-member">Sneha Gade (BCS2023040)</span>
            </div>

            <div className="hero-quick-actions">
              <a href="#voice-tool" className="hero-quick-btn primary">🎙️ Start Speaking</a>
              <a href="#features" className="hero-quick-btn secondary">Explore Features</a>
            </div>
          </div>

          {/* Right: Voice Tool */}
          <VoiceTool />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ FEATURES — 3×2 Grid ═══════════════ */
const FEATURES = [
  { icon: '🎤', title: 'Voice Input', desc: 'Speak naturally — AI understands your movie mood, genre & preferences.' },
  { icon: '🧠', title: 'AI Mood Analysis', desc: 'GPT-4o & Claude analyze mood to recommend the perfect movie.' },
  { icon: '📍', title: 'Location Filter', desc: 'Finds nearby theaters with real-time showtime availability.' },
  { icon: '⚡', title: 'Live Streaming', desc: 'Whisper/Deepgram for instant voice-to-text transcription.' },
  { icon: '📲', title: 'QR Payment', desc: 'Instant UPI QR code — book & pay in seconds.' },
  { icon: '🎯', title: 'Smart Picks', desc: 'Personalized suggestions based on mood & viewing history.' }
]

function FeaturesSection() {
  return (
    <section className="section section--alt" id="features">
      <div className="container">
        <div className="section-label">✦ Core Features</div>
        <h2 className="section-heading">Everything You Need</h2>
        <p className="section-desc">
          Seamless voice-driven experience from discovery to booking.
        </p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ PROBLEM & SOLUTION — Side by Side ═══════════════ */
function ProblemSolutionSection() {
  return (
    <section className="section" id="problem-solution">
      <div className="container">
        <div className="section-label">✦ Why VOLIOD?</div>
        <h2 className="section-heading">Problem & Solution</h2>
        <p className="section-desc">
          Why existing booking flows fail — and how voice changes that.
        </p>

        <div className="ps-grid">
          <div className="ps-card problem">
            <div className="ps-header">
              <div className="ps-icon">⚠️</div>
              <h3 className="ps-title">The Problem</h3>
            </div>
            <ul className="ps-list">
              <li>Users lack time for scrolling and typing</li>
              <li>No personalized, mood-based recommendations</li>
              <li>Fragmented booking experience</li>
            </ul>
          </div>

          <div className="ps-card solution">
            <div className="ps-header">
              <div className="ps-icon">✅</div>
              <h3 className="ps-title">The Solution</h3>
            </div>
            <ul className="ps-list">
              <li>Voice-first: just speak your preference</li>
              <li>AI-powered mood analysis + location filtering</li>
              <li>Instant UPI QR payment — book in seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ ARCHITECTURE — Parallel ═══════════════ */
function ArchitectureSection() {
  return (
    <section className="section section--alt" id="architecture">
      <div className="container">
        <div className="section-label">✦ System Architecture</div>
        <h2 className="section-heading">Two Coordinated Layers</h2>
        <p className="section-desc">
          Powering every voice-driven booking with React + Python.
        </p>

        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-header">
              <div className="arch-icon">🖥️</div>
              <h3 className="arch-title">Frontend (React + Tailwind)</h3>
            </div>
            <ul className="arch-list">
              <li>Voice input interface</li>
              <li>Real-time audio streaming</li>
              <li>QR code display</li>
              <li>Responsive UI components</li>
              <li>Payment status tracking</li>
            </ul>
          </div>

          <div className="arch-card backend">
            <div className="arch-header">
              <div className="arch-icon">⚙️</div>
              <h3 className="arch-title">Backend (Python)</h3>
            </div>
            <ul className="arch-list">
              <li>Speech-to-Text API (Whisper / Deepgram)</li>
              <li>LLM processing (GPT-4o / Claude)</li>
              <li>Movie / showtime aggregation</li>
              <li>Dynamic QR generation</li>
              <li>Payment gateway integration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ HOW IT WORKS — 4 Horizontal Steps ═══════════════ */
const STEPS = [
  { n: 1, title: 'Speak', desc: 'Tell VOLIOD what you want — mood, genre, or a specific title.' },
  { n: 2, title: 'Discover', desc: 'AI processes voice, finds matching movies & showtimes.' },
  { n: 3, title: 'Book', desc: 'Select seats, scan QR code, pay via UPI instantly.' },
  { n: 4, title: 'Enjoy', desc: 'Get e-ticket confirmation. Head to theater. Done!' }
]

function WorkflowSection() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-label">✦ Workflow</div>
        <h2 className="section-heading">How It Works</h2>
        <p className="section-desc">
          Four steps from voice command to movie ticket.
        </p>

        <div className="steps-row">
          {STEPS.map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">🎙️</div>
            <span className="footer-name">VOLIOD</span>
            <span className="footer-tag">Voice-First AI Movie Concierge</span>
          </div>

          <ul className="footer-links">
            <li><a href="#voice-tool">Voice Tool</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#how-it-works">Workflow</a></li>
          </ul>

          <p className="footer-copy">
            © 2026 VOLIOD · Shobhit · Ridhima · Sneha
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════ SCROLL TO TOP ═══════════════ */
function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <button
      className={`scroll-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >↑</button>
  )
}

/* ═══════════════ BUBBLES ═══════════════ */
function Bubbles() {
  const bubbles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 50 + 12,
      left: Math.random() * 100,
      duration: Math.random() * 14 + 12,
      delay: Math.random() * 18,
      opacity: Math.random() * 0.25 + 0.05,
    })), []
  )

  return (
    <div className="bubbles-container" aria-hidden="true">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════ MAIN APP ═══════════════ */
function App() {
  return (
    <>
      <Bubbles />
      <div className="app-container">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ProblemSolutionSection />
        <ArchitectureSection />
        <WorkflowSection />
        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}

export default App
