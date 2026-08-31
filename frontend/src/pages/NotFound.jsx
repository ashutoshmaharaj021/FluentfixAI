import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-xl">

        {/* Branding */}
        <h1 className="text-2xl font-bold tracking-tight mb-12">
          FluentFix
          <span className="text-cyan-400"> AI</span>
        </h1>

        {/* 404 */}
        <div className="mb-8">
          <h2 className="text-8xl md:text-9xl font-bold text-cyan-400 tracking-tight">
            404
          </h2>
        </div>

        {/* Message */}
        <h3 className="text-3xl md:text-4xl font-semibold mb-4">
          Page Not Found
        </h3>

        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Looks like this page wandered off somewhere.
          Let's get you back to FluentFix AI.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default NotFound;