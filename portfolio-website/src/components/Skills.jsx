import { skills } from "../data";

function Skills() {
  return (
    <section id="skills" className="section-wrap animate-fadeInUp">
      <p className="section-badge">Arsenal</p>
      <h3 className="section-title">Skills</h3>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill) => (
          <div
            key={skill}
            className="glass-card rounded-xl px-4 py-4 text-center text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-md"
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
