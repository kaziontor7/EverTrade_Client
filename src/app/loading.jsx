export default function Loading() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-2 border-zinc-900 dark:border-white border-t-transparent animate-spin"></div>
        
        {/* Inner static dot */}
        <div className="w-2 h-2 bg-zinc-900 dark:bg-white rounded-full animate-pulse"></div>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-wider uppercase animate-pulse">Loading</p>
    </div>
  );
}
