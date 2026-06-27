export default function Loading() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500/20"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-[3px] border-lime-400/20"></div>
        <div className="absolute inset-2 rounded-full border-[3px] border-lime-400 border-b-transparent animate-spin direction-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
    </div>
  );
}
