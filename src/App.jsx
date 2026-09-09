import { useEffect, useState } from "react";
import About from "./components/About";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Skills from "./components/Skills";
import ThreeBackground from "./components/ThreeBackground";
import ThreeGameView from "./components/Game3D/ThreeGameView";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [houseTheme, setHouseTheme] = useState("stark");
  // Start directly in Game Mode
  const [viewMode, setViewMode] = useState("game");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
    const savedHouse = localStorage.getItem("houseTheme");
    if (savedHouse) {
      setHouseTheme(savedHouse);
      document.documentElement.dataset.house = savedHouse;
    } else {
      document.documentElement.dataset.house = "stark";
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const nextTheme = !prev;
      document.documentElement.classList.toggle("dark", nextTheme);
      localStorage.setItem("theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  const changeHouseTheme = (house) => {
    setHouseTheme(house);
    localStorage.setItem("houseTheme", house);
    document.documentElement.dataset.house = house;
  };

  // 1. FULLSCREEN IMMERSIVE RPG 3D GAME VIEW
  if (viewMode === "game") {
    return (
      <ThreeGameView
        onToggleViewMode={() => setViewMode("website")}
        houseTheme={houseTheme}
        isFullscreen={true}
      />
    );
  }

  // 2. WEBSITE VIEW (Contains embedded Playable Game Arena + full scrollable sections)
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl dark:bg-brand-500/35" />
      <div className="pointer-events-none absolute right-0 top-[28rem] h-72 w-72 rounded-full bg-gold-500/25 blur-3xl dark:bg-gold-500/20" />
      <div className="pointer-events-none absolute inset-0 fire-bg opacity-10 dark:opacity-20" />
      <ThreeBackground houseTheme={houseTheme} isDark={isDark} />

      <Navbar
        isDark={isDark}
        onToggle={toggleTheme}
        houseTheme={houseTheme}
        onHouseChange={changeHouseTheme}
        onPlayGame={() => setViewMode("game")}
      />

      <main className="relative z-10">
        <Hero
          houseTheme={houseTheme}
          onPlayGame={() => setViewMode("game")}
        />

        {/* Embedded Playable Game Arena Section */}
        <section id="game-arena" className="section-wrap pt-4 pb-12">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="section-badge">Live Interactive Game</p>
              <h3 className="section-title">The Citadel Adventure Realm</h3>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("game")}
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-gradient-to-r from-brand-600 to-gold-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition"
            >
              <span>🎮</span> Play Fullscreen Mode
            </button>
          </div>

          <ThreeGameView
            isEmbedded={true}
            onOpenFullscreen={() => setViewMode("game")}
            houseTheme={houseTheme}
          />
        </section>

        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Resume />
        <Contact />
      </main>

      <Footer />

      {/* Floating Action Button for Fullscreen Game */}
      <button
        type="button"
        onClick={() => setViewMode("game")}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border-2 border-gold-500/80 bg-gradient-to-r from-brand-600 to-gold-600 px-5 py-3 text-xs font-extrabold text-white shadow-2xl transition duration-300 hover:scale-110 hover:shadow-gold-500/35 animate-bounce"
      >
        <span>🎮</span> Fullscreen Game
      </button>
    </div>
  );
}

export default App;
