import { FaArrowRight, FaGithub, FaMagic } from "react-icons/fa";
import {Link} from "react-router-dom";

function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-20 bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm">
            <FaMagic className="text-cyan-300" />
            AI-powered writing assistant
          </div>
        </div>

        {/* Heading */}
        <div className="mt-10 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            Write Better <span className="text-cyan-400">with AI</span>
          </h1>

          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto">
            Correct spelling, grammar, and fluency instantly using advanced AI.
            Clean, professional, and natural writing in seconds.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
         <Link
  to="/workspace"
  className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold transition"
>
  Try FluentFix
</Link>
          <a
            href="https://github.com/ashutoshmaharaj021/FluentfixAI"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800 transition font-semibold flex items-center gap-2 inline-flex"
          >
            <FaGithub />
            View on GitHub
          </a>
        </div>

        {/* Workspace Card */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">AI Writing Workspace</h2>
                <p className="text-slate-400 mt-1">
                  Paste your text and let FluentFix polish it.
                </p>
              </div>

              <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition">
                Try a sample
              </button>
            </div>

            {/* Text Area */}
            <textarea
              placeholder="Type or paste your text here..."
              className="w-full h-64 rounded-2xl bg-[#0B1220] border border-slate-700 p-5 text-slate-200 placeholder-slate-500 outline-none resize-none focus:border-cyan-500 transition"
            />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>0 / 5000 characters</span>
            </div>

            {/* Button */}
            <button className="mt-6 w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold text-lg">
              Correct Text
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;