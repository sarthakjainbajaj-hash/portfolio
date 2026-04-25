import { FaBriefcase } from "react-icons/fa";

function Experience() {
  const experiences = [
    {
      title: "Software Engineer Intern",
      company: "Yuga Yatra",
      icon: "💼",
      description: "Gained hands-on experience in software development and engineering practices.",
    },
    {
      title: "Data Analyst Intern",
      company: "Bluestock",
      icon: "💼",
      description: "Received an offer for a data analyst internship position.",
    },
  ];

  return (
    <section id="experience" className="section-wrap animate-fadeInUp">
      <h3 className="section-title">Experience</h3>
      <div className="mt-10 space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-7 shadow-sm flex items-start gap-4"
          >
            <div className="text-2xl">{exp.icon}</div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold">{exp.title}</h4>
              <p className="text-sm font-medium text-brand-600 mt-1">{exp.company}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;