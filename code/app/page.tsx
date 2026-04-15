"use client"
import { useState, useEffect } from 'react';
import { Instagram, Facebook, Phone, MapPin, Clock, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

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
      { id: 1, nome: 'Pamonha', descricao: '', preco: 'R$ 10', imagem: '/pamonha.jpg' },
      { id: 2, nome: 'Bolo Frito (4 Un)', descricao: '', preco: 'R$ 10', imagem: '/bolo-frito.png' },
      { id: 3, nome: 'Curau (200 ml)', descricao: '', preco: 'R$ 8', imagem: '/cural.jpg' },
      { id: 4, nome: 'Canjica (200 ml)', descricao: '', preco: 'R$ 8', imagem: '/canjica.jpg' },
      { id: 5, nome: 'Milho Cozido', descricao: '', preco: 'R$ 3', imagem: '/milho_cozido.jpg' },
      { id: 6, nome: 'Caldo de Frango (300 ml)', descricao: '', preco: 'R$ 10', imagem: '/caldo.jpg' },
      { id: 7, nome: 'Pipoca', descricao: '', preco: 'R$ 4', imagem: '/pipoca.jpg' },
      { id: 8, nome: 'Algodão Doce', descricao: '', preco: 'R$ 4', imagem: '/algodao.jpg' },
    ]
  },
  {
    id: 'jantas',
    nome: 'Jantas',
    icone: '🍽️',
    itens: [
      { id: 9, nome: 'Galinha Caipira', descricao: '', preco: 'R$ 22', imagem: '/caipira.jpg' },
      { id: 10, nome: 'Porco na Lata', descricao: '', preco: 'R$ 22', imagem: '/lata.jpg' },
      { id: 11, nome: 'Carne de Panela', descricao: '', preco: 'R$ 22', imagem: '/panela.jpg' },
    ]
  },
  {
    id: 'sobremesas',
    nome: 'Sobremesas',
    icone: '🍨',
    itens: [
      { id: 12, nome: 'Picolé Fruta', descricao: '', preco: 'R$ 5', imagem: '/picole.jpeg' },
      { id: 13, nome: 'Picolé Creme', descricao: '', preco: 'R$ 7', imagem: '/picole_creme.jpg' },
    ]
  },
  {
    id: 'bebidas',
    nome: 'Bebidas',
    icone: '🥤',
    itens: [
      { id: 14, nome: 'Água', descricao: '', preco: 'R$ 4', imagem: '/agua.jpg' },
      { id: 15, nome: 'Água com Gás', descricao: '', preco: 'R$ 5', imagem: '/com_gas.jpg' },
      { id: 16, nome: 'Coca-Cola (1 L)', descricao: '', preco: 'R$ 12', imagem: '/coca.jpg' },
      { id: 17, nome: 'Guaraná (1 L)', descricao: '', preco: 'R$ 10', imagem: '/guarana.jpg' },
      { id: 18, nome: 'Suco (400 ml)', descricao: '', preco: 'R$ 10', imagem: '/suco.jpg' },
      { id: 19, nome: 'Batida', descricao: '', preco: 'R$ 10', imagem: '/batida.jpg' },
    ]
  },
  {
    id: 'brincadeiras',
    nome: 'Brincadeiras',
    icone: '🎯',
    itens: [
      { id: 20, nome: 'Tiro ao Alvo', descricao: '', preco: 'R$ 5', imagem: '/alvo.jpg' },
      { id: 21, nome: 'Pescaria', descricao: '', preco: 'R$ 5', imagem: '/pesca.jpg' },
      { id: 22, nome: 'Giro da Fé', descricao: '', preco: 'R$ 5', imagem: '/sorte.jpeg' },
      { id: 23, nome: 'Brinquedos Infláveis', descricao: '', preco: 'R$ 5', imagem: '/inflavel.png' },
      { id: 24, nome: 'Touro Mecânico', descricao: '', preco: 'R$ 10', imagem: '/touro.jpg' },
    ]
  }
];

// Per-category visual config — all class strings are static so Tailwind picks them up
const categoryStyle: Record<string, {
  gradient: string;
  tabActive: string;
  tabInactive: string;
  badgeColor: string;
  badgeText: string;
  sectionBorder: string;
}> = {
  'comidas-tipicas': {
    gradient: 'from-amber-600 to-yellow-400',
    tabActive: 'bg-amber-500 text-white shadow-amber-200',
    tabInactive: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
    badgeColor: 'bg-amber-500',
    badgeText: 'text-white',
    sectionBorder: 'border-amber-200',
  },
  jantas: {
    gradient: 'from-orange-700 to-orange-400',
    tabActive: 'bg-orange-500 text-white shadow-orange-200',
    tabInactive: 'bg-orange-50 text-orange-800 hover:bg-orange-100',
    badgeColor: 'bg-orange-500',
    badgeText: 'text-white',
    sectionBorder: 'border-orange-200',
  },
  sobremesas: {
    gradient: 'from-pink-600 to-rose-400',
    tabActive: 'bg-pink-500 text-white shadow-pink-200',
    tabInactive: 'bg-pink-50 text-pink-800 hover:bg-pink-100',
    badgeColor: 'bg-pink-500',
    badgeText: 'text-white',
    sectionBorder: 'border-pink-200',
  },
  bebidas: {
    gradient: 'from-sky-600 to-cyan-400',
    tabActive: 'bg-sky-500 text-white shadow-sky-200',
    tabInactive: 'bg-sky-50 text-sky-800 hover:bg-sky-100',
    badgeColor: 'bg-sky-500',
    badgeText: 'text-white',
    sectionBorder: 'border-sky-200',
  },
  brincadeiras: {
    gradient: 'from-green-700 to-emerald-400',
    tabActive: 'bg-green-600 text-white shadow-green-200',
    tabInactive: 'bg-green-50 text-green-800 hover:bg-green-100',
    badgeColor: 'bg-green-600',
    badgeText: 'text-white',
    sectionBorder: 'border-green-200',
  },
};

export default function Cardapio() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('comidas-tipicas');
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<string, boolean>>(
    Object.fromEntries(categorias.map(c => [c.id, true]))
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCategoria = (id: string) => {
    setCategoriasExpandidas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToCategoria = (id: string) => {
    setCategoriaAtiva(id);
    setMenuAberto(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 148;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFFBEB' }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 corn-header transition-shadow duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
          {/* Logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/milhao.png"
              alt="Festa do Milhão"
              className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-white font-extrabold text-base leading-tight tracking-wide truncate">
                Festa do Milhão
              </p>
              <p className="text-amber-200 text-[11px] font-medium leading-tight">
                Festival Gastronômico Cristão
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollToSection('sobre-festa')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Sobre a Festa
            </button>
            <button
              onClick={() => scrollToSection('sobre-festa')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/15 text-white hover:bg-white/25 border border-white/30 transition-colors"
            >
              <MapPin size={14} /> Local & Data
            </button>
          </nav>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden flex-shrink-0 text-white p-2 rounded-xl hover:bg-white/20 transition-colors"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown — atalhos da página */}
        {menuAberto && (
          <div
            className="md:hidden border-t border-amber-600/30"
            style={{ background: 'rgba(146, 64, 14, 0.98)' }}
          >
            <button
              onClick={() => { scrollToSection('sobre-festa'); setMenuAberto(false); }}
              className="flex items-center gap-3 w-full py-4 px-5 text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-xl">✝️</span>
              <span className="font-semibold">Sobre a Festa</span>
            </button>
            <button
              onClick={() => { scrollToSection('sobre-festa'); setMenuAberto(false); }}
              className="flex items-center gap-3 w-full py-4 px-5 text-white hover:bg-white/10 transition-colors border-t border-white/10"
            >
              <MapPin size={20} className="text-yellow-300" />
              <div className="text-left">
                <p className="font-semibold">Local & Data</p>
                <p className="text-amber-200 text-xs">10 de Maio · 19h às 00h</p>
              </div>
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden hero-pattern"
        style={{
          background: 'linear-gradient(150deg, #7C2D12 0%, #92400E 20%, #B45309 45%, #D97706 70%, #F59E0B 100%)',
        }}
      >
        {/* Decorative corn emojis */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="absolute top-3 left-[5%] text-5xl opacity-10 rotate-12">🌽</span>
          <span className="absolute top-6 right-[8%] text-6xl opacity-10 -rotate-20">🌽</span>
          <span className="absolute bottom-4 left-[15%] text-4xl opacity-10 rotate-45">🌽</span>
          <span className="absolute bottom-3 right-[18%] text-5xl opacity-10 -rotate-12">🌽</span>
          <span className="absolute top-1/2 -translate-y-1/2 left-[2%] text-3xl opacity-8 rotate-90">🌽</span>
          <span className="absolute top-1/2 -translate-y-1/2 right-[2%] text-3xl opacity-8 -rotate-90">🌽</span>
        </div>

        <div className="relative container mx-auto px-4 py-10 text-center max-w-2xl">
          {/* Date badge */}
          <div className="inline-flex items-center gap-2 glass-pill text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <Clock size={13} />
            10 de Maio · Sábado · 19h às 00h
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-2 drop-shadow-lg">
            🌽 Festa do
          </h1>
          <h1
            className="text-5xl md:text-7xl font-black leading-none mb-5 drop-shadow-lg"
            style={{ color: '#FDE68A', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
            Milhão
          </h1>

          <p className="text-amber-100 text-base md:text-lg font-medium mb-1">
            Festival Gastronômico Cristão
          </p>
          <p className="text-amber-200/80 text-sm mb-8">
            UMADEP · Igreja Assembléia de Deus — CIADSETA · Paraíso do Tocantins
          </p>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="glass-pill rounded-2xl px-5 py-3 text-center min-w-[120px]">
              <MapPin size={18} className="mx-auto mb-1.5 text-yellow-300" />
              <p className="text-white text-xs font-semibold leading-tight">
                Tatersal<br />Sindicato Rural
              </p>
            </div>
            <div className="glass-pill rounded-2xl px-5 py-3 text-center min-w-[120px]">
              <Clock size={18} className="mx-auto mb-1.5 text-yellow-300" />
              <p className="text-white text-xs font-semibold leading-tight">
                19h às 00h<br />10 de Maio
              </p>
            </div>
            <div className="glass-pill rounded-2xl px-5 py-3 text-center min-w-[120px]">
              <span className="text-2xl block mb-1">✝️</span>
              <p className="text-white text-xs font-semibold leading-tight">
                Para toda<br />a família
              </p>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative h-8 overflow-hidden mt-2">
          <svg
            viewBox="0 0 1440 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40Z"
              fill="#FFFBEB"
            />
          </svg>
        </div>
      </section>

      {/* ── CATEGORY NAV ───────────────────────────────── */}
      <div
        className="sticky z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm"
        style={{ top: scrolled ? '64px' : '68px' }}
      >
        <div className="overflow-x-auto hide-scrollbar px-3 py-3">
          <div className="flex gap-2 min-w-max md:min-w-0 md:justify-center">
            {categorias.map(cat => {
              const s = categoryStyle[cat.id];
              const isActive = categoriaAtiva === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategoria(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-sm ${
                    isActive
                      ? `${s.tabActive} shadow-md scale-105`
                      : `${s.tabInactive}`
                  }`}
                >
                  <span className="text-base">{cat.icone}</span>
                  <span>{cat.nome}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MENU SECTIONS ──────────────────────────────── */}
      <main id="cardapio-anchor" className="container mx-auto px-3 py-6 max-w-5xl">
        {categorias.map(categoria => {
          const s = categoryStyle[categoria.id];
          const expanded = categoriasExpandidas[categoria.id] !== false;

          return (
            <section
              key={categoria.id}
              id={categoria.id}
              className="mb-8 scroll-mt-36 category-section"
            >
              {/* Section header */}
              <button
                onClick={() => toggleCategoria(categoria.id)}
                className={`flex items-center justify-between w-full bg-gradient-to-r ${s.gradient} text-white px-5 py-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 mb-3`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl drop-shadow-sm">{categoria.icone}</span>
                  <div className="text-left">
                    <h2 className="text-xl font-extrabold leading-tight">{categoria.nome}</h2>
                    <p className="text-white/75 text-xs font-medium">
                      {categoria.itens.length} {categoria.itens.length === 1 ? 'item' : 'itens'} disponíveis
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-1.5 flex-shrink-0">
                  {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Items grid */}
              {expanded && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoria.itens.map(item => (
                    <div
                      key={item.id}
                      className={`menu-card group bg-white rounded-2xl overflow-hidden border ${s.sectionBorder} cursor-default`}
                    >
                      {/* Image */}
                      <div className="relative h-36 overflow-hidden bg-amber-50">
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="card-img w-full h-full object-cover"
                        />
                        {/* Price badge */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`${s.badgeColor} ${s.badgeText} text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg`}
                          >
                            {item.preco}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-bold text-gray-800 leading-tight">
                          {item.nome}
                        </h3>
                        {item.descricao ? (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.descricao}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* ── EVENT INFO ─────────────────────────────────── */}
      <section id="sobre-festa" className="py-12 px-4" style={{ background: 'linear-gradient(180deg, #FFFBEB, #FEF3C7)' }}>
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-extrabold text-amber-900">Sobre o Evento</h2>
            <div className="w-16 h-1 rounded-full mx-auto mt-2" style={{ background: '#D97706' }} />
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
            {/* Top color bar */}
            <div
              className="h-2"
              style={{ background: 'linear-gradient(90deg, #D97706, #F59E0B, #FBBF24)' }}
            />

            <div className="p-6 md:p-8">
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                A <strong className="text-amber-700">Festa do Milhão</strong> é um festival gastronômico cristão
                organizado pela juventude UMADEP da Igreja Assembléia de Deus — CIADSETA,
                com o objetivo de promover adoração a Deus, comunhão e diversão para toda a família.
                O evento traz música ao vivo, brincadeiras, atividades para todas as idades
                e muitas comidas típicas deliciosas em um ambiente acolhedor e festivo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date card */}
                <div className="flex items-start gap-4 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <div
                    className="flex-shrink-0 p-2.5 rounded-xl text-white"
                    style={{ background: '#D97706' }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-0.5">Data e Horário</h4>
                    <p className="text-gray-700 text-sm font-semibold">Sábado, 10 de Maio</p>
                    <p className="text-gray-500 text-sm">Das 19h às 00h</p>
                  </div>
                </div>

                {/* Location card */}
                <div className="flex items-start gap-4 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <div
                    className="flex-shrink-0 p-2.5 rounded-xl text-white"
                    style={{ background: '#D97706' }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-0.5">Localização</h4>
                    <p className="text-gray-700 text-sm font-semibold">Tatersal do Sindicato Rural</p>
                    <p className="text-gray-500 text-sm">Parque de Exposições Agropecuária</p>
                    <p className="text-gray-500 text-sm">Bueno — Paraíso do Tocantins, TO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer
        className="text-white py-10 px-4"
        style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #92400E 40%, #B45309 100%)' }}
      >
        <div className="container mx-auto max-w-2xl text-center">
          <img
            src="/milhao.png"
            alt="Festa do Milhão"
            className="h-14 mx-auto mb-4 object-contain opacity-90 drop-shadow-md"
          />

          <h3 className="text-xl font-extrabold mb-1" style={{ color: '#FDE68A' }}>
            Festa do Milhão
          </h3>
          <p className="text-amber-200 text-sm mb-1">Festival Gastronômico Cristão</p>
          <p className="text-amber-300/70 text-xs mb-7">
            Igreja Assembléia de Deus — CIADSETA · Paraíso do Tocantins
          </p>

          {/* Social icons */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="#"
              aria-label="Instagram"
              className="p-3 rounded-2xl transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Instagram size={20} className="text-amber-100" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="p-3 rounded-2xl transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Facebook size={20} className="text-amber-100" />
            </a>
            <a
              href="#"
              aria-label="Telefone"
              className="p-3 rounded-2xl transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Phone size={20} className="text-amber-100" />
            </a>
          </div>

          <div
            className="border-t pt-5 text-xs"
            style={{ borderColor: 'rgba(180, 83, 9, 0.5)', color: 'rgba(253, 230, 138, 0.6)' }}
          >
            © Criado por Alexandre Souza dos Santos · Todos os direitos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}
