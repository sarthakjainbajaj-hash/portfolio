import { FaCode, FaExternalLinkAlt } from "react-icons/fa";

function ProjectCard({ project }) {
  const hasLinks = project.liveUrl || project.githubUrl;

  return (
    <article className="parchment-card group rounded-2xl p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-premium">
      <h4 className="text-xl font-semibold text-slate-900">{project.title}</h4>
      <p className="mt-4 text-sm leading-relaxed text-amber-900/80">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-amber-100/80 px-3 py-1 text-xs font-medium text-amber-900 transition dark:bg-amber-100/80 dark:text-amber-900"
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
            className="inline-flex items-center gap-2 rounded-lg border border-amber-900/30 px-4 py-2 text-sm font-semibold text-amber-900 transition duration-300 hover:-translate-y-0.5 hover:border-amber-700 hover:text-amber-700"
          >
            <FaCode size={12} />
            GitHub
          </a>
        )}
        {!hasLinks && (
          <span className="rounded-lg border border-amber-900/20 px-4 py-2 text-xs font-semibold text-amber-900/70">
            Links coming soon
          </span>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
