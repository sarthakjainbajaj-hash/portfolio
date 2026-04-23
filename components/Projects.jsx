import { projects } from "../data";
import ProjectCard from "./ProjectCard";

function Projects() {
  return (
    <section id="projects" className="section-wrap animate-fadeInUp">
      <h3 className="section-title">Projects</h3>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Selected work across web platforms, machine learning solutions, and
        embedded hardware systems.
      </p>
      <div className="mt-10 grid gap-7 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
