import { certifications } from "../data";

function Certifications() {
  return (
    <section id="certifications" className="section-wrap animate-fadeInUp">
      <p className="section-badge">Royal Archives</p>
      <h3 className="section-title">Certifications</h3>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
        Verified learning credentials across software engineering, data analysis, and
        competitive achievements.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {certifications.map((cert) => (
          <article
            key={`${cert.issuer}-${cert.title}`}
            className="platinum-card group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-premium"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-slate-900">{cert.title}</h4>
              <span className="rounded-full border border-slate-500/40 bg-slate-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                {cert.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{cert.issuer}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {cert.date}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {cert.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-slate-500/35 bg-white/70 px-3 py-1 text-xs text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Certifications;
