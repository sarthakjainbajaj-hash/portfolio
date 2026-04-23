import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-slate-200/80 py-10 dark:border-slate-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-slate-600 md:flex-row md:px-8 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Sarthak Jain Bajaj</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/sarthak-jain-bajaj-2550a63a2"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 p-2 transition duration-300 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="https://github.com/sarthakjainbajaj-hash"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 p-2 transition duration-300 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-600 dark:border-slate-700"
          >
            <FaGithub size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
