export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-accent rounded-full animate-spin border-t-transparent" />
        </div>
        <span className="text-white/70 text-sm font-medium">Chargement...</span>
      </div>
    </div>
  )
}