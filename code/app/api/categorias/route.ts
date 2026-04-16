import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        itens: { orderBy: { ordem: 'asc' } },
      },
      orderBy: { ordem: 'asc' },
    })
    return NextResponse.json(categorias)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, nome, icone, ordem } = await request.json()
    const cat = await prisma.categoria.create({
      data: { id, nome, icone, ordem: ordem ?? 0 },
    })
    return NextResponse.json(cat, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}
