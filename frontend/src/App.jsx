import { useState, useRef, useEffect } from 'react'
import './App.css'

/* ═══════════════ TRANSLATIONS ═══════════════ */
const t = {
  en: {
    movies: {
      title: 'Movies',
      subtitle: 'Voice Movie Booking',
      howToStart: 'How to Start',
      steps: [
        'Click the mic to begin.',
        'Speak your movie preference.',
        'AI finds the best options.',
        'Book your tickets instantly.'
      ],
      micHintReady: 'Tap to speak',
      micHintListening: 'Listening...',
      placeholder: 'Voice input will appear here...',
      aiResponseLabel: 'AI Response',
      aiSampleResponse: '🎬 Options:\n\n1. PVR Cinemas — 7:00 PM\n2. INOX — 7:30 PM\n\nBook tickets?'
    },
    rides: {
      title: 'Rides',
      subtitle: 'Uber & Ola Booking',
      howToStart: 'How to Start',
      steps: [
        'Click the mic to begin.',
        'Speak your destination.',
        'AI compares prices.',
        'Confirm your ride.'
      ],
      micHintReady: 'Tap to speak',
      micHintListening: 'Listening...',
      placeholder: 'Voice input will appear here...',
      aiResponseLabel: 'AI Response',
      aiSampleResponse: '🚗 Options:\n\n1. Uber Go — ₹450\n2. Ola Mini — ₹430\n\nBook the cheapest?'
    },
    ambulance: {
      title: 'Medical',
      subtitle: 'Fast Ambulance Dispatch',
      howToStart: 'Instructions',
      steps: [
        'Click the mic immediately.',
        'Speak your location.',
        'AI alerts the hospital.',
        'Ambulance dispatched.'
      ],
      micHintReady: 'Tap to report emergency',
      micHintListening: 'Listening...',
      placeholder: 'Voice input will appear here...',
      aiResponseLabel: 'AI Response',
      aiSampleResponse: '🚨 EMERGENCY REGISTERED:\n\nAmbulance dispatched.\nETA: 4 Minutes.\n\nStay calm.'
    }
  },
  hi: {
    movies: {
      title: 'मूवीज़',
      subtitle: 'वॉइस मूवी बुकिंग',
      howToStart: 'कैसे शुरू करें',
      steps: [
        'माइक पर क्लिक करें।',
        'अपनी पसंद बोलें।',
        'AI विकल्प ढूंढेगा।',
        'तुरंत टिकट बुक करें।'
      ],
      micHintReady: 'बोलने के लिए टैप करें',
      micHintListening: 'सुन रहा हूँ...',
      placeholder: 'आवाज़ यहाँ दिखेगी...',
      aiResponseLabel: 'AI जवाब',
      aiSampleResponse: '🎬 विकल्प:\n\n1. PVR सिनेमाज़ — शाम 7:00\n2. INOX — शाम 7:30\n\nटिकट बुक करूँ?'
    },
    rides: {
      title: 'राइड्स',
      subtitle: 'ऊबर और ओला बुकिंग',
      howToStart: 'कैसे शुरू करें',
      steps: [
        'माइक पर क्लिक करें।',
        'अपनी मंज़िल बोलें।',
        'AI कीमतें मिलाएगा।',
        'कैब कन्फर्म करें।'
      ],
      micHintReady: 'बोलने के लिए टैप करें',
      micHintListening: 'सुन रहा हूँ...',
      placeholder: 'आवाज़ यहाँ दिखेगी...',
      aiResponseLabel: 'AI जवाब',
      aiSampleResponse: '🚗 विकल्प:\n\n1. Uber Go — ₹450\n2. Ola Mini — ₹430\n\nसबसे सस्ता बुक करूँ?'
    },
    ambulance: {
      title: 'मेडिकल',
      subtitle: 'एम्बुलेंस डिस्पैच',
      howToStart: 'निर्देश',
      steps: [
        'तुरंत माइक पर क्लिक करें।',
        'लोकेशन बताएं।',
        'अस्पताल को अलर्ट जाएगा।',
        'एम्बुलेंस भेज दी जाएगी।'
      ],
      micHintReady: 'इमरजेंसी बताने के लिए टैप करें',
      micHintListening: 'सुन रहा हूँ...',
      placeholder: 'आवाज़ यहाँ दिखेगी...',
      aiResponseLabel: 'AI जवाब',
      aiSampleResponse: '🚨 इमरजेंसी दर्ज:\n\nएम्बुलेंस भेज दी गई है।\nETA: 4 मिनट।\n\nशांत रहें।'
    }
  }
}


/* ═══════════════ MAIN UI ═══════════════ */
function MainApp({ lang, setLang, activeService, setActiveService }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const recRef = useRef(null)
  
  const strings = t[lang][activeService]

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
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
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
          setResponse(strings.aiSampleResponse)
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
    setTranscript('')
  }

  // Bottom Nav items
  const navItems = [
    { id: 'movies', icon: '🎬', label: lang === 'en' ? 'Movies' : 'मूवीज़' },
    { id: 'rides', icon: '🚗', label: lang === 'en' ? 'Rides' : 'राइड्स' },
    { id: 'ambulance', icon: '🚑', label: lang === 'en' ? 'Medic' : 'मेडिकल' }
  ]

  return (
    <div className="app-container">
      <div className={`mobile-frame ${activeService}`}>
        
        {/* Top Header */}
        <header className="header">
          <div className="logo-badge">
            <div className="logo-badge-inner">🎙️</div>
          </div>
          <h1 className="header-title">{lang === 'en' ? 'VOBO' : 'वोबो'}</h1>
          <button 
            className="lang-toggle-neu" 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
        </header>

        {/* Title Area */}
        <div className="title-area">
          <h2>{strings.title}</h2>
          <p>{strings.subtitle}</p>
        </div>

        <div className="parallel-layout">
          {/* Left Column: Content & Responses */}
          <div className="layout-left">
            <div className="content-area">
              {(!transcript && !response) && (
                <div className="neu-inset-card">
                  <h3 className="inset-title">{strings.howToStart}</h3>
                  <ul className="neu-list">
                    {strings.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {(transcript || response) && (
                <div className="neu-inset-card transcript">
                  <p>{transcript || strings.placeholder}</p>
                </div>
              )}

              {response && (
                <div className="neu-inset-card response">
                  <h3 className="inset-title">{strings.aiResponseLabel}</h3>
                  <p>{response}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Microphone */}
          <div className="layout-right">
            <div className="mic-showcase">
              <div className="mic-ring">
                <button
                  className={`neu-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                >
                  <div className="mic-inner">
                    {isListening ? '⏹️' : '🎙️'}
                  </div>
                </button>
              </div>
              <p className="mic-hint">{isListening ? strings.micHintListening : strings.micHintReady}</p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activeService === item.id ? 'active' : ''}`}
              onClick={() => setActiveService(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  )
}

/* ═══════════════ MAIN APP ═══════════════ */
function App() {
  const [lang, setLang] = useState('en')
  const [activeService, setActiveService] = useState('movies')

  return (
    <MainApp 
      lang={lang} 
      setLang={setLang} 
      activeService={activeService} 
      setActiveService={setActiveService} 
    />
  )
}

export default App
