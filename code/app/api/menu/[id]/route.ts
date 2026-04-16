import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const item = await prisma.menuItem.findUnique({
      where: { id: Number(id) },
      include: { categoria: true },
    })
    if (!item) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    return NextResponse.json(item)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nome, descricao, preco, imagem, categoriaId, ordem, ativo } = body

    const item = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: {
        ...(nome !== undefined && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(preco !== undefined && { preco }),
        ...(imagem !== undefined && { imagem }),
        ...(categoriaId !== undefined && { categoriaId }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
      include: { categoria: true },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao atualizar item' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.menuItem.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao deletar item' }, { status: 500 })
  }
}
