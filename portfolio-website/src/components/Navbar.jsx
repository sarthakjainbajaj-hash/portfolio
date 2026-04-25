import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { navLinks } from "../data";
import ThemeToggle from "./ThemeToggle";

function Navbar({ isDark, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-gold-500/50 dark:bg-slate-950/80">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#hero" className="text-lg font-bold tracking-tight">
          Sarthak Jain Bajaj
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-gold-600 dark:text-slate-300"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle isDark={isDark} onToggle={onToggle} />
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </nav>

      {isOpen && (
        <div id="mobile-menu" className="border-t border-slate-200/70 bg-white/90 px-5 py-4 backdrop-blur-xl dark:border-gold-500/50 dark:bg-slate-950/90 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:bg-gold-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle isDark={isDark} onToggle={onToggle} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
