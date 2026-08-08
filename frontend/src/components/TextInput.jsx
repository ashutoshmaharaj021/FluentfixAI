function TextInput() {
  return (
    <div className="mt-16 flex flex-col items-center">

      <textarea
        placeholder="Type your sentence here..."
        className="
        w-3/4
        h-56
        bg-slate-800
        text-white
        rounded-xl
        border
        border-slate-700
        p-5
        text-lg
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400
        "
      />

      <button
        className="
        mt-8
        px-8
        py-4
        bg-cyan-500
        rounded-xl
        text-white
        font-semibold
        hover:bg-cyan-600
        transition
        "
      >
        ✨ Correct Text
      </button>

    </div>
  );
}

export default TextInput;