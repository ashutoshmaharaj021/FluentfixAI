function About() {
  return (
    <section className="bg-[#050816] py-24 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm">
                About FluentFix AI
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                A writing assistant that helps you sound
                <span className="text-cyan-400"> clear, natural, and confident</span>
              </h2>


            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6">
                <div className="text-4xl font-bold text-cyan-400">3-in-1</div>
                <div className="mt-2 text-slate-300 font-semibold">
                  Writing pipeline
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Spelling, grammar, and fluency correction in one request.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6">
                <div className="text-4xl font-bold text-cyan-400">&lt;5s</div>
                <div className="mt-2 text-slate-300 font-semibold">
                  Fast responses
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Optimized for quick feedback while you’re writing.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6">
                <div className="text-4xl font-bold text-cyan-400">5000</div>
                <div className="mt-2 text-slate-300 font-semibold">
                  Characters supported
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Handle short notes, emails, and longer documents comfortably.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6">
                <div className="text-4xl font-bold text-cyan-400">Secure</div>
                <div className="mt-2 text-slate-300 font-semibold">
                  Privacy focused
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Your writing stays protected while being processed.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400">
              Built with <span className="text-white font-semibold">FastAPI</span>,
              <span className="text-white font-semibold"> React</span>, and modern AI models.
            </div>

            <button className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold">
              Explore the Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;