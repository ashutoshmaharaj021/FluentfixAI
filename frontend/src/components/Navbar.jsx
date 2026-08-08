import { FaGithub } from "react-icons/fa";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0B0F17]/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">

        {/* Logo */}

        <h1 className="text-2xl font-bold tracking-tight">
          FluentFix
          <span className="text-cyan-400"> AI</span>
        </h1>

        {/* Navigation */}

        <nav className="hidden md:flex items-center gap-10 text-slate-300">

          <a href="#" className="hover:text-white transition">
            Home
          </a>

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#docs" className="hover:text-white transition">
            Docs
          </a>

          <a
            href="https://github.com/ashutoshmaharaj021/FluentfixAI"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <FaGithub />
            GitHub
          </a>

        </nav>

        {/* CTA */}

        <button className="rounded-full bg-cyan-400 px-6 py-3 text-black font-semibold hover:bg-cyan-300 transition">
          Try AI
        </button>

      </div>
    </header>
  );
}

export default Navbar;