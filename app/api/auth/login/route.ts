import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Incorrect email or password' },
        { status: 401 }
      )
    }

    if (password.length < 1) {
      return NextResponse.json(
        { error: 'Incorrect email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Incorrect email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
