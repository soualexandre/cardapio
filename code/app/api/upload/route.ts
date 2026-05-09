import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { createAdminClient } from '@/lib/supabase'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
])

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

function useSupabaseStorage(): boolean {
  return !!(process.env.SUPABASE_SECRET_KEY && process.env.SUPABASE_STORAGE_BUCKET)
}

function isVercel(): boolean {
  return process.env.VERCEL === '1'
}

async function uploadToSupabase(buffer: Buffer, contentType: string, originalName: string): Promise<string> {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET!
  const ext =
    MIME_EXT[contentType] ||
    path.extname(originalName).replace(/[^\w.-]/g, '') ||
    '.jpg'
  const objectPath = `menu/${Date.now()}-${Math.random().toString(36).slice(2, 11)}${ext}`

  const supabase = createAdminClient()

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    throw error
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(objectPath)

  return publicUrl
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (useSupabaseStorage()) {
      try {
        const url = await uploadToSupabase(buffer, file.type, file.name)
        return NextResponse.json({ url })
      } catch (e) {
        console.error('Upload Supabase:', e)
        return NextResponse.json(
          {
            error:
              'Erro ao enviar ao armazenamento. Confira o bucket SUPABASE_STORAGE_BUCKET no Supabase (nome e bucket público).',
          },
          { status: 500 },
        )
      }
    }

    if (isVercel()) {
      return NextResponse.json(
        {
          error:
            'Upload na Vercel exige Storage no Supabase. Crie um bucket público e defina SUPABASE_STORAGE_BUCKET nas variáveis de ambiente.',
        },
        { status: 503 },
      )
    }

    const ext =
      MIME_EXT[file.type] ||
      path.extname(file.name).replace(/[^\w.-]/g, '') ||
      '.jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}${ext}`
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
