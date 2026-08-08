import { FaBolt, FaBrain, FaLock, FaLayerGroup } from "react-icons/fa";

const features = [
  {
    icon: <FaBolt className="text-cyan-400 text-2xl" />,
    title: "Lightning Fast",
    text: "Get spelling, grammar, and fluency fixes in seconds with minimal latency.",
  },
  {
    icon: <FaBrain className="text-cyan-400 text-2xl" />,
    title: "AI Powered",
    text: "Advanced language models understand context, tone, and intent naturally.",
  },
  {
    icon: <FaLock className="text-cyan-400 text-2xl" />,
    title: "Privacy First",
    text: "Your text is processed securely and never stored or shared.",
  },
  {
    icon: <FaLayerGroup className="text-cyan-400 text-2xl" />,
    title: "Multi-Sentence Support",
    text: "Correct entire paragraphs and long-form writing in a single request.",
  },
];

function Features() {
  return (
    <section className="bg-[#050816] py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Everything you need to write{" "}
            <span className="text-cyan-400">with confidence</span>
          </h2>

          <p className="mt-5 text-slate-400 max-w-2xl mx-auto text-lg">
            FluentFix AI combines speed, intelligence, and privacy into one
            seamless writing assistant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-7">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;