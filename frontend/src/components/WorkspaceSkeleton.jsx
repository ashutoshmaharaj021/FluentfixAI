function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#060B16] text-white flex animate-pulse">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0B1220] p-6 hidden md:flex flex-col">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/10" />
            <div className="h-5 w-28 bg-white/10 rounded" />
          </div>

          {/* New Document */}
          <div className="w-full h-12 bg-white/10 rounded-xl mb-8" />

          {/* Current Draft */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-5 h-5 bg-white/10 rounded" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>

          {/* Documents */}
          <div className="mt-6">
            <div className="h-4 w-24 bg-white/10 rounded mb-4" />

            <div className="space-y-2">
              <div className="h-16 bg-white/5 border border-white/10 rounded-lg" />
              <div className="h-16 bg-white/5 border border-white/10 rounded-lg" />
              <div className="h-16 bg-white/5 border border-white/10 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="h-3 w-32 bg-white/10 rounded mt-auto" />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8">
          <div>
            <div className="h-5 w-48 bg-white/10 rounded mb-2" />
            <div className="h-3 w-64 bg-white/5 rounded" />
          </div>

          <div className="h-9 w-20 bg-white/10 rounded-lg" />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">

          {/* Editor Cards */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Input Skeleton */}
            <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6">
              <div className="h-6 w-32 bg-white/10 rounded mb-3" />
              <div className="h-4 w-52 bg-white/5 rounded mb-5" />

              <div className="h-[420px] bg-white/5 border border-white/10 rounded-xl" />

              <div className="mt-4 flex justify-between">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-4 w-12 bg-white/10 rounded" />
              </div>
            </div>

            {/* Output Skeleton */}
            <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6">
              <div className="h-6 w-40 bg-white/10 rounded mb-3" />
              <div className="h-4 w-56 bg-white/5 rounded mb-5" />

              <div className="h-[420px] bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="h-4 w-20 bg-white/10 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-11/12 bg-white/5 rounded" />
                  <div className="h-3 w-4/5 bg-white/5 rounded" />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <div className="h-10 w-28 bg-white/10 rounded-lg" />
                <div className="h-10 w-24 bg-white/10 rounded-lg" />
              </div>
            </div>

          </div>

          {/* Correction Mode Skeleton */}
          <div className="mt-8 bg-[#0B1220] border border-white/10 rounded-2xl p-6">
            <div className="h-5 w-36 bg-white/10 rounded mb-5" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-14 bg-white/5 border border-white/10 rounded-xl" />
              <div className="h-14 bg-white/5 border border-white/10 rounded-xl" />
              <div className="h-14 bg-white/5 border border-white/10 rounded-xl" />
              <div className="h-14 bg-white/10 rounded-xl" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default WorkspaceSkeleton;