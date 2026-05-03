function Hero() {
  return (
    <section id="hero" className="section-wrap pt-24">
      <div className="animate-fadeInUp rounded-[2rem] border border-brand-700/40 bg-slate-950/70 p-8 shadow-xl backdrop-blur-xl dark:border-gold-500/35 dark:bg-slate-950/75">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              The North Remembers
            </p>
            <div className="house-words mb-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
              <span>Honor</span>
              <span>Fire</span>
              <span>Gold</span>
              <span>Blood</span>
              <span>Winter</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-100 sm:text-6xl md:text-7xl font-heading">
              Sarthak Jain Bajaj
            </h1>
            <h2 className="mt-5 text-lg font-medium text-gold-200 sm:text-2xl font-heading">
              Web Developer | AI & Data Science Student | Embedded Systems
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              I forge scalable web applications and real-time systems with discipline,
              precision, and a builder's oath to clean user experience.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-premium transition duration-300 hover:-translate-y-1 hover:bg-brand-500"
              >
                Enter the Realm
              </a>
              <a
                href="#contact"
                className="glass-card rounded-xl px-7 py-3 text-sm font-semibold text-gold-200 transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:text-gold-300"
              >
                Request the Scroll
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-brand-700/40 bg-slate-900 p-3 shadow-xl dark:border-gold-500/35 dark:bg-slate-900">
            <div className="absolute inset-0 rounded-[2rem] fire-bg opacity-30 pointer-events-none" />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-300 dark:bg-slate-800">
              <img
                src="/sarthak-photo.png"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute left-5 top-5 rounded-full border border-gold-500/70 bg-slate-950/90 px-3 py-1 text-xs font-semibold text-gold-400 shadow-sm animate-badgeMove">
              Winter is Coming
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
