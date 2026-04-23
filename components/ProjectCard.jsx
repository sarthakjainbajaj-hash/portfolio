import { FaCode, FaExternalLinkAlt } from "react-icons/fa";

function ProjectCard({ project }) {
  return (
    <article className="glass-card group rounded-2xl p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-premium">
      <h4 className="text-xl font-semibold">{project.title}</h4>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition dark:bg-slate-800 dark:text-slate-200"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-brand-500"
          >
            <FaExternalLinkAlt size={12} />
            Live
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-100"
          >
            <FaCode size={12} />
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
