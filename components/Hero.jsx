function Hero() {
  return (
    <section id="hero" className="section-wrap pt-24">
      <div className="max-w-4xl animate-fadeInUp">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Hello, I am
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Sarthak Jain Bajaj
        </h1>
        <h2 className="mt-5 text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-2xl">
          Web Developer | AI & Data Science Student | Embedded Systems
        </h2>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
          I build scalable web applications and real-time systems with a focus
          on practical problem solving and clean user experiences.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-premium transition duration-300 hover:-translate-y-1 hover:bg-brand-500"
          >
            View Projects
          </a>
          <a
            href="/resume.pdf"
            className="glass-card rounded-xl px-7 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:text-brand-600 dark:text-slate-100"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
