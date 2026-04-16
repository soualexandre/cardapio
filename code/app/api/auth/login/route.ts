import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

function withCors(response: NextResponse) {
  // Se quiser restringir, troque '*' pelo domínio do seu frontend
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PUT, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Vary', 'Origin')
  return response
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API /api/auth/login][POST] Iniciando login', {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
    })
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    console.log('[API /api/auth/login][POST] Body recebido', { email })

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      console.log('[API /api/auth/login][POST] Admin não encontrado', { email })
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      console.log('[API /api/auth/login][POST] Senha inválida', { email })
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = await signToken({ id: admin.id, email: admin.email })

    const response = withCors(NextResponse.json({ success: true, email: admin.email }))
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[API /api/auth/login][POST] Login error:', error)
    return withCors(NextResponse.json({ error: 'Erro interno' }, { status: 500 }))
  }
}
