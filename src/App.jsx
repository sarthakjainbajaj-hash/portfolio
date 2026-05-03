import { useEffect, useState } from "react";
import About from "./components/About";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [houseTheme, setHouseTheme] = useState("stark");

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

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl dark:bg-brand-500/35" />
      <div className="pointer-events-none absolute right-0 top-[28rem] h-72 w-72 rounded-full bg-gold-500/25 blur-3xl dark:bg-gold-500/20" />
      <div className="pointer-events-none absolute inset-0 fire-bg opacity-10 dark:opacity-20" />
      <Navbar
        isDark={isDark}
        onToggle={toggleTheme}
        houseTheme={houseTheme}
        onHouseChange={changeHouseTheme}
      />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
