'use client'

export default function MorphingShape() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl motion-safe:animate-[about-blob-a_24s_ease-in-out_infinite] motion-reduce:hidden"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)',
          top: '20%',
          left: '10%',
        }}
      />

      <div
        className="absolute w-96 h-96 rounded-full blur-3xl motion-safe:animate-[about-blob-b_26s_ease-in-out_infinite] motion-reduce:hidden"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent)',
          bottom: '30%',
          right: '15%',
        }}
      />

      <div
        className="absolute w-96 h-96 rounded-full blur-3xl motion-safe:animate-[about-blob-c_22s_ease-in-out_infinite] motion-reduce:hidden"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent)',
          top: '50%',
          left: '50%',
        }}
      />
    </div>
  )
}
