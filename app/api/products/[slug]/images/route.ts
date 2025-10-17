import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: productSlug } = await params

    // Extract game and product name from slug
    // Format: "gaming-[GAME]-[PRODUCT]" -> /[GAME]/[PRODUCT]/
    const parts = productSlug.split('-')
    let gameFolder = ''
    let productFolder = ''

    if (parts[0] === 'gaming' && parts.length >= 3) {
      gameFolder = parts[1] // overwatch, warzone, valorant, etc.
      productFolder = parts.slice(2).join('-') // dominion, phantom, godmode, etc.
    } else {
      return NextResponse.json({ images: [] })
    }

    const imagesDir = path.join(process.cwd(), 'public', 'images', 'products', gameFolder, productFolder)

    try {
      const files = await fs.readdir(imagesDir)

      // Filter for image files only
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
      })

      // Sort images: main.* first, then others
      const sortedFiles = imageFiles.sort((a, b) => {
        const aIsMain = path.parse(a).name.toLowerCase() === 'main'
        const bIsMain = path.parse(b).name.toLowerCase() === 'main'

        if (aIsMain && !bIsMain) return -1
        if (!aIsMain && bIsMain) return 1
        return a.localeCompare(b)
      })

      // Create full paths for the images
      const imagePaths = sortedFiles.map(file => `/images/products/${gameFolder}/${productFolder}/${file}`)

      return NextResponse.json({ images: imagePaths })
    } catch (error) {
      // Directory doesn't exist or can't be read
      return NextResponse.json({ images: [] })
    }
  } catch (error) {
    console.error('Error fetching product images:', error)
    return NextResponse.json({ images: [] }, { status: 500 })
  }
}