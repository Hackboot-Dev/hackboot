import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// SECURITY NOTE: This is a server-side only route
// - The 'fs' module only works on the server (Node.js)
// - The users.json file is NEVER sent to the client
// - Only authentication success/failure is returned
// - All credential verification happens server-side

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json(
        { message: 'Identifiant et mot de passe requis' },
        { status: 400 }
      )
    }

    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')

    try {
      const usersData = await fs.readFile(usersFilePath, 'utf-8')
      const users = JSON.parse(usersData)

      const user = users.find(
        (u: { id: string; password: string }) =>
          u.id === userId && u.password === password
      )

      if (user) {
        return NextResponse.json(
          {
            success: true,
            message: 'Authentification réussie',
            user: { id: user.id }
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { message: 'Identifiants invalides' },
          { status: 401 }
        )
      }
    } catch (fileError) {
      console.error('Error reading users file:', fileError)
      return NextResponse.json(
        { message: 'Erreur lors de la lecture des utilisateurs' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
