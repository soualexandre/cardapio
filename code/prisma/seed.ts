import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Admin padrão
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@cardapio.com' },
    update: {},
    create: { email: 'admin@cardapio.com', password: hashedPassword },
  })
  console.log('✅ Admin criado: admin@cardapio.com / admin123')

  // Categorias
  const categorias = [
    { id: 'comidas-tipicas', nome: 'Comidas Típicas', icone: '🌽', ordem: 0 },
    { id: 'jantas',          nome: 'Jantas',          icone: '🍽️', ordem: 1 },
    { id: 'sobremesas',      nome: 'Sobremesas',      icone: '🍨', ordem: 2 },
    { id: 'bebidas',         nome: 'Bebidas',         icone: '🥤', ordem: 3 },
    { id: 'brincadeiras',    nome: 'Brincadeiras',    icone: '🎯', ordem: 4 },
  ]

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { id: cat.id },
      update: { nome: cat.nome, icone: cat.icone, ordem: cat.ordem },
      create: cat,
    })
  }
  console.log('✅ Categorias criadas:', categorias.length)

  // Itens do cardápio
  const itens = [
    // Comidas Típicas
    { id: 1,  nome: 'Pamonha',               descricao: '', preco: 'R$ 10', imagem: '/pamonha.jpg',      categoriaId: 'comidas-tipicas', ordem: 0 },
    { id: 2,  nome: 'Bolo Frito (4 Un)',     descricao: '', preco: 'R$ 10', imagem: '/bolo-frito.png',   categoriaId: 'comidas-tipicas', ordem: 1 },
    { id: 3,  nome: 'Curau (200 ml)',         descricao: '', preco: 'R$ 8',  imagem: '/cural.jpg',        categoriaId: 'comidas-tipicas', ordem: 2 },
    { id: 4,  nome: 'Canjica (200 ml)',       descricao: '', preco: 'R$ 8',  imagem: '/canjica.jpg',      categoriaId: 'comidas-tipicas', ordem: 3 },
    { id: 5,  nome: 'Milho Cozido',           descricao: '', preco: 'R$ 3',  imagem: '/milho_cozido.jpg', categoriaId: 'comidas-tipicas', ordem: 4 },
    { id: 6,  nome: 'Caldo de Frango (300 ml)', descricao: '', preco: 'R$ 10', imagem: '/caldo.jpg',     categoriaId: 'comidas-tipicas', ordem: 5 },
    { id: 7,  nome: 'Pipoca',                 descricao: '', preco: 'R$ 4',  imagem: '/pipoca.jpg',       categoriaId: 'comidas-tipicas', ordem: 6 },
    { id: 8,  nome: 'Algodão Doce',           descricao: '', preco: 'R$ 4',  imagem: '/algodao.jpg',      categoriaId: 'comidas-tipicas', ordem: 7 },
    // Jantas
    { id: 9,  nome: 'Galinha Caipira',        descricao: '', preco: 'R$ 22', imagem: '/caipira.jpg',      categoriaId: 'jantas',          ordem: 0 },
    { id: 10, nome: 'Porco na Lata',          descricao: '', preco: 'R$ 22', imagem: '/lata.jpg',         categoriaId: 'jantas',          ordem: 1 },
    { id: 11, nome: 'Carne de Panela',        descricao: '', preco: 'R$ 22', imagem: '/panela.jpg',       categoriaId: 'jantas',          ordem: 2 },
    // Sobremesas
    { id: 12, nome: 'Picolé Fruta',           descricao: '', preco: 'R$ 5',  imagem: '/picole.jpeg',      categoriaId: 'sobremesas',      ordem: 0 },
    { id: 13, nome: 'Picolé Creme',           descricao: '', preco: 'R$ 7',  imagem: '/picole_creme.jpg', categoriaId: 'sobremesas',      ordem: 1 },
    // Bebidas
    { id: 14, nome: 'Água',                   descricao: '', preco: 'R$ 4',  imagem: '/agua.jpg',         categoriaId: 'bebidas',         ordem: 0 },
    { id: 15, nome: 'Água com Gás',           descricao: '', preco: 'R$ 5',  imagem: '/com_gas.jpg',      categoriaId: 'bebidas',         ordem: 1 },
    { id: 16, nome: 'Coca-Cola (1 L)',         descricao: '', preco: 'R$ 12', imagem: '/coca.jpg',         categoriaId: 'bebidas',         ordem: 2 },
    { id: 17, nome: 'Guaraná (1 L)',           descricao: '', preco: 'R$ 10', imagem: '/guarana.jpg',      categoriaId: 'bebidas',         ordem: 3 },
    { id: 18, nome: 'Suco (400 ml)',           descricao: '', preco: 'R$ 10', imagem: '/suco.jpg',         categoriaId: 'bebidas',         ordem: 4 },
    { id: 19, nome: 'Batida',                  descricao: '', preco: 'R$ 10', imagem: '/batida.jpg',       categoriaId: 'bebidas',         ordem: 5 },
    // Brincadeiras
    { id: 20, nome: 'Tiro ao Alvo',           descricao: '', preco: 'R$ 5',  imagem: '/alvo.jpg',         categoriaId: 'brincadeiras',    ordem: 0 },
    { id: 21, nome: 'Pescaria',               descricao: '', preco: 'R$ 5',  imagem: '/pesca.jpg',        categoriaId: 'brincadeiras',    ordem: 1 },
    { id: 22, nome: 'Giro da Fé',             descricao: '', preco: 'R$ 5',  imagem: '/sorte.jpeg',       categoriaId: 'brincadeiras',    ordem: 2 },
    { id: 23, nome: 'Brinquedos Infláveis',   descricao: '', preco: 'R$ 5',  imagem: '/inflavel.png',     categoriaId: 'brincadeiras',    ordem: 3 },
    { id: 24, nome: 'Touro Mecânico',         descricao: '', preco: 'R$ 10', imagem: '/touro.jpg',        categoriaId: 'brincadeiras',    ordem: 4 },
  ]

  for (const item of itens) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: { nome: item.nome, descricao: item.descricao, preco: item.preco, imagem: item.imagem, ordem: item.ordem },
      create: item,
    })
  }
  console.log('✅ Itens criados:', itens.length)

  // Garante que a sequência de autoincremento do ID de MenuItem
  // fique posicionada depois do maior ID já existente, evitando P2002 em `id`
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"MenuItem"', 'id'),
      COALESCE((SELECT MAX(id) FROM "MenuItem"), 0) + 1,
      false
    );
  `)
  console.log('✅ Sequência de ID de MenuItem ajustada')
  console.log('🎉 Seed concluído com sucesso!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
