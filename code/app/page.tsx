"use client"
import { useState } from 'react';
import { Menu, X, Instagram, Facebook, Phone, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  imagem: string;
}

interface Categoria {
  id: string;
  nome: string;
  icone: string;
  itens: MenuItem[];
}

const categorias: Categoria[] = [
  {
    id: 'comidas-tipicas',
    nome: 'Comidas Típicas',
    icone: '🌽',
    itens: [
      { id: 1, nome: 'Pamonha', descricao: '', preco: 'R$ 10,00', imagem: '/pamonha.jpg' },
      { id: 2, nome: 'Bolo Frito (4 Un)', descricao: '', preco: 'R$ 10,00', imagem: '/bolo-frito.png' },
      { id: 3, nome: 'Curau (200 Ml)', descricao: '', preco: 'R$ 8,00', imagem: '/cural.jpg' },
      { id: 4, nome: 'Canjica (200 Ml)', descricao: '', preco: 'R$ 8,00', imagem: '/canjica.jpg' },
      { id: 5, nome: 'Milho Cozido', descricao: '', preco: 'R$ 3,00', imagem: '/milho_cozido.jpg' },
      { id: 6, nome: 'Caldo de Frango (300 Ml)', descricao: '', preco: 'R$ 10,00', imagem: '/caldo.jpg' },
      { id: 7, nome: 'Pipoca', descricao: '', preco: 'R$ 4,00', imagem: '/pipoca.jpg' },
      { id: 8, nome: 'Algodão Doce', descricao: '', preco: 'R$ 4,00', imagem: '/algodao.jpg' }
    ]
  },
  {
    id: 'jantas',
    nome: 'Jantas',
    icone: '🍽️',
    itens: [
      { id: 9, nome: 'Galinha Caipira', descricao: '', preco: 'R$ 22,00', imagem: '/caipira.jpg' },
      { id: 10, nome: 'Porco na Lata', descricao: '', preco: 'R$ 22,00', imagem: '/lata.jpg' },
      { id: 10, nome: 'Carne de Panela', descricao: '', preco: 'R$ 22,00', imagem: '/panela.jpg' },
    ]
  },
  {
    id: 'sobremesas',
    nome: 'Sobremesas',
    icone: '🍨',
    itens: [
      { id: 12, nome: 'Picolé Fruta', descricao: '', preco: 'R$ 5,00', imagem: '/picole.jpeg' },
      { id: 13, nome: 'Picolé Creme', descricao: '', preco: 'R$ 7,00', imagem: '/picole_creme.jpg' }
    ]
  },
  {
    id: 'bebidas',
    nome: 'Bebidas',
    icone: '🥤',
    itens: [
      { id: 14, nome: 'Água', descricao: '', preco: 'R$ 4,00', imagem: '/agua.jpg' },
      { id: 15, nome: 'Água com Gás', descricao: '', preco: 'R$ 5,00', imagem: '/com_gas.jpg' },
      { id: 16, nome: 'Coca-cola (1 L)', descricao: '', preco: 'R$ 12,00', imagem: '/coca.jpg' },
      { id: 17, nome: 'Guaraná (1 L)', descricao: '', preco: 'R$ 10,00', imagem: '/guarana.jpg' },
      { id: 18, nome: 'Suco (400 Ml)', descricao: '', preco: 'R$ 8,00', imagem: '/suco.jpg' },
      { id: 19, nome: 'Batida', descricao: '', preco: 'R$ 10,00', imagem: '/batida.jpg' }
    ]
  },
  {
    id: 'brincadeiras',
    nome: 'Brincadeiras',
    icone: '🎯',
    itens: [
      { id: 20, nome: 'Tiro ao Alvo', descricao: '', preco: 'R$ 5,00', imagem: '/alvo.jpg' },
      { id: 21, nome: 'Pescaria', descricao: '', preco: 'R$ 5,00', imagem: '/pesca.jpg' },
      { id: 22, nome: 'Giro da fé', descricao: '', preco: 'R$ 5,00', imagem: '/sorte.jpeg' },
      { id: 23, nome: 'Brinquedos Infláveis', descricao: '', preco: 'R$ 5,00', imagem: '/inflavel.png' },
      { id: 24, nome: 'Touro Mecânico', descricao: '', preco: 'R$ 10,00', imagem: '/touro.jpg' }
    ]
  }
];


export default function Cardapio() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('lanches-tipicos');
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<string, boolean>>({});

  const toggleCategoria = (id: string) => {
    setCategoriasExpandidas((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToCategoria = (id: string) => {
    setCategoriaAtiva(id);
    setMenuAberto(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 180; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Elemento com id ${id} não encontrado!`);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-red-600 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/milhao.png"  
              alt="Festa do Milhão Logo"  
              width={60}  
              height={20}  
            />
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              className="text-white p-2 rounded-md hover:bg-red-700"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => scrollToCategoria(categoria.id)}
                className={`text-white px-3 py-2 rounded-md transition-all duration-200 ${
                  categoriaAtiva === categoria.id ? 'bg-red-700 font-medium' : 'hover:bg-red-700/50'
                }`}
              >
                <span className="mr-1">{categoria.icone}</span> {categoria.nome}
              </button>
            ))}
          </nav>
        </div>
        
        {menuAberto && (
          <div className="md:hidden bg-red-700 py-1 shadow-lg">
            <div className="container mx-auto">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => scrollToCategoria(categoria.id)}
                  className={`flex items-center w-full py-3 px-4 text-white ${
                    categoriaAtiva === categoria.id ? 'bg-red-800 font-medium' : ''
                  }`}
                >
                  <span className="mr-2">{categoria.icone}</span> {categoria.nome}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="bg-gradient-to-b from-red-600 to-red-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Festa do Milhão</h1>
          <p className="text-lg text-yellow-100 max-w-2xl mx-auto mb-4">
            Festival Gastronômico Cristão
          </p>
          <p className="text-sm text-white/80">
            Realização: Igreja Assembléia de Deus - CIADSETA<br />
            Paraíso do Tocantins
          </p>
        </div>
      </section>

      <div className="sticky top-19 z-40 bg-white shadow-md overflow-x-auto py-6 px-1">
        <div className="flex space-x-2 md:container md:mx-auto md:justify-center">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => scrollToCategoria(categoria.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                categoriaAtiva === categoria.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{categoria.icone}</span> {categoria.nome}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {categorias.map((categoria) => {
          const expanded = categoriasExpandidas[categoria.id] !== false;
          
          return (
            <section 
              id={categoria.id} 
              key={categoria.id}
              className="mb-8 scroll-mt-32"
            >
              <button 
                onClick={() => toggleCategoria(categoria.id)}
                className="flex items-center justify-between w-full bg-red-600 text-white px-4 py-3 rounded-t-lg"
              >
                <h2 className="text-xl font-bold flex items-center">
                  <span className="mr-2">{categoria.icone}</span> {categoria.nome}
                </h2>
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {expanded && (
                <div className="bg-white rounded-b-lg shadow-md p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categoria.itens.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="h-28 overflow-hidden">
                          <img 
                            src={item.imagem} 
                            alt={item.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-bold text-gray-800 leading-tight">{item.nome}</h3>
                            <span className="text-sm font-bold text-red-600 ml-1">{item.preco}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </main>

      <section className="bg-yellow-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">Informações do Evento</h2>
          
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre o Festival</h3>
                <p className="text-gray-600 text-sm">
                A <b>Festa do Milhão</b> é um festival gastronômico cristão organizado pela juventude UMADEP da Igreja Assembléia de Deus - CIADSETA, com o objetivo de promover um momento de adoração a Deus, comunhão e diversão para toda a família. O evento oferece uma combinação única de música ao vivo, com apresentações de bandas que louvam e exaltam o nome de Deus, além de muitas brincadeiras e atividades recreativas para todas as idades. Comidas típicas e deliciosas também fazem parte dessa grande celebração, criando um ambiente acolhedor e festivo. A Festa do Milhão é uma oportunidade para estreitar laços de amizade e fé, enquanto vivenciamos a alegria de servir ao Senhor em união e celebração.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2 flex items-center">
                    <Clock size={18} className="mr-2" /> Data e Hora
                  </h4>
                  <p className="text-sm text-gray-700">
                    Dia 10 de maio<br />
                    Sábado: das 19h às 00hrs<br />
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2 flex items-center">
                    <MapPin size={18} className="mr-2" /> Localização
                  </h4>
                  <p className="text-sm text-gray-700">
                    Tatersal do Sindicato Rural - Parque de Exposições Agropecuária<br />
                    Bueno - Paraíso do Tocantins<br />
                    Tocantins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-red-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2 text-yellow-300">Festa do Milhão</h3>
              <p className="text-xs mt-1 text-white/70">Igreja Assembléia de Deus - CIADSETA</p>
            </div>
            
            <div className="flex space-x-6 items-center">
              <a href="#" aria-label="Instagram" className="text-white hover:text-yellow-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="text-white hover:text-yellow-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Telefone" className="text-white hover:text-yellow-300 transition-colors">
                <Phone size={20} />
              </a>
            </div>
          </div>
          
          <div className="border-t border-red-700 mt-6 pt-6 text-center text-sm">
            <p>&copy; Criado por Alexandre Souza dos Santos - Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}