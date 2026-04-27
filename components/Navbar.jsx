import { navLinks } from "../data";
import ThemeToggle from "./ThemeToggle";

function Navbar({ isDark, onToggle }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#hero" className="text-lg font-bold tracking-tight">
          Sarthak Jain Bajaj
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-brand-600 dark:text-slate-300"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle isDark={isDark} onToggle={onToggle} />
        </div>

        <div className="md:hidden">
          <ThemeToggle isDark={isDark} onToggle={onToggle} />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
