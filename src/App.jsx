import React from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';



function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="App">
      <ParticleBackground />
      <Cursor />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
