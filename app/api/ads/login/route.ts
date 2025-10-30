import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface AdsUser {
  id: string
  username: string
  passwordHash: string
  role: string
  permissions: string[]
  createdAt: string
}

const JWT_SECRET = process.env.ADS_JWT_SECRET || 'hackboot-ads-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const usersPath = join(process.cwd(), 'data', 'ads-users.json')
    const usersData = readFileSync(usersPath, 'utf-8')
    const users: AdsUser[] = JSON.parse(usersData)

    const user = users.find((u) => u.username === username)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
    })
  } catch (error) {
    console.error('ADS login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
