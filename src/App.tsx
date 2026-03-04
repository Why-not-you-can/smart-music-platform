import React, { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './router'
import AppHeader from './components/app-header'
import AppFooter from './components/app-footer'
import AppPlayerBar from './views/player/app-player-bar'
import OllamaChat from './views/ollama-chat'
import { UserProvider } from './context/user-context'
import AudioVisualizer from './components/audio-visualizer'

function App() {
  return (
    <UserProvider>
      <div className="App">
        <AppHeader />
        <Suspense fallback="">
          <div className="main">{useRoutes(routes)}</div>
        </Suspense>
        <AppFooter />
        <AudioVisualizer />
        <AppPlayerBar />
        <OllamaChat />
      </div>
    </UserProvider>
  )
}

export default App
