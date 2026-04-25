function Hero() {
  return (
    <section id="hero" className="section-wrap pt-24">
      <div className="animate-fadeInUp rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              Hello, I am
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl font-heading">
              Sarthak Jain Bajaj
            </h1>
            <h2 className="mt-5 text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-2xl font-heading">
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

          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-100 p-3 shadow-xl dark:border-slate-700/80 dark:bg-slate-900">
            <div className="absolute inset-0 rounded-[2rem] fire-bg opacity-30 pointer-events-none" />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-300 dark:bg-slate-800">
              <img
                src="/profile.jpeg"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-gold-500/80 dark:bg-slate-950/90 dark:text-gold-400 animate-badgeMove">
              Winter is Coming
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
