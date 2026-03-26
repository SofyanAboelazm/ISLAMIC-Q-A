import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Results from './pages/Results';
import SourceDetails from './pages/SourceDetails';
import About from './pages/About';
import History from './pages/History';
import ChatPage from './chat-module/ChatPage';
import VoiceChatPage from './voice-chat-module/VoiceChatPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/source/:id" element={<SourceDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<History />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/voice-chat" element={<VoiceChatPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
