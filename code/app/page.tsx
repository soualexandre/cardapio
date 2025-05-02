"use client"
import { useState } from 'react';
import { Menu, X, Instagram, Facebook, Phone, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const categorias = [
  {
    id: 'comidas-tipicas',
    nome: 'Comidas Típicas',
    icone: '🌽',
    itens: [
      {
        id: 1,
        nome: 'Pamonha',
        descricao: 'Pasta de milho verde cozida na palha, doce ou salgada',
        preco: 'R$ 10,00',
        imagem: '/pamonha.jpg'
      },
      {
        id: 2,
        nome: 'Canjica',
        descricao: 'Milho branco cozido com leite, açúcar e canela',
        preco: 'R$ 8,00',
        imagem: '/canjica.jpg'
      },
      {
        id: 3,
        nome: 'Curau',
        descricao: 'Doce cremoso de milho com leite e açúcar, polvilhado com canela',
        preco: 'R$ 6,00',
        imagem: '/cural.jpg'
      }
    ]
  },
  {
    id: 'lanches-tipicos',
    nome: 'Lanches Típicos',
    icone: '🍩',
    itens: [
      {
        id: 4,
        nome: 'Bolo Frito',
        descricao: 'Bolo frito tradicional, crocante por fora e macio por dentro',
        preco: 'R$ 8,00',
        imagem: '/bolo-frito.png'
      }
    ]
  },
  {
    id: 'refeicoes',
    nome: 'Refeições',
    icone: '🍽️',
    itens: [
      {
        id: 5,
        nome: 'Jantinha',
        descricao: 'Espetinho, arroz, feijão tropeiro, mandioca e vinagrete',
        preco: 'R$ 25,00',
        imagem: '/jantinha.jpg'
      },
      {
        id: 6,
        nome: 'Caldo de Frango',
        descricao: 'Caldo quente feito com frango desfiado, batata e temperos',
        preco: 'R$ 10,00',
        imagem: '/caldo.jpg'
      }
    ]
  }
];


export default function Cardapio() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('lanches');
  const [menuAberto, setMenuAberto] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});

  const toggleCategoria = (id) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToCategoria = (id: any) => {
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
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
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
          
          {/* Menu para Mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              className="text-white p-2 rounded-md hover:bg-red-700"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Menu para Desktop */}
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
        
        {/* Menu Mobile Expandido */}
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

      {/* Banner Principal */}
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

      {/* Rodapé */}
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