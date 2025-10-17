import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          style={{ position: 'absolute' }}
        >
          <defs>
            <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path
            d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
            stroke="url(#iconGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M11 9 L11 23 M21 9 L21 23 M11 16 L21 16"
            stroke="url(#iconGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}