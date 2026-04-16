'use client'
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, LogOut, X, Upload, Search, ChevronDown } from 'lucide-react'

interface MenuItem {
  id: number
  nome: string
  descricao: string
  preco: string
  imagem: string
  ordem: number
  ativo: boolean
  categoriaId: string
}

interface Categoria {
  id: string
  nome: string
  icone: string
  ordem: number
  itens: MenuItem[]
}

const emptyForm = { nome: '', descricao: '', preco: '', imagem: '', categoriaId: '', ordem: 0, ativo: true }

export default function AdminPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [catAtiva, setCatAtiva] = useState<string>('')
  const [search, setSearch] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete confirm
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [catForm, setCatForm] = useState({ id: '', nome: '', icone: '' })
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState('')

  // Delete category — picker + confirm
  const [deleteCatModalOpen, setDeleteCatModalOpen] = useState(false)
  const [deleteCat, setDeleteCat] = useState<Categoria | null>(null)
  const [deletingCat, setDeletingCat] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch('/api/categorias')
      const data = await res.json()
      setCategorias(data)
      if (data.length > 0 && !catAtiva) setCatAtiva(data[0].id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // ── Item CRUD ─────────────────────────────────────────────────

  function openCreate() {
    setEditingItem(null)
    setForm({ ...emptyForm, categoriaId: catAtiva })
    setImagePreview('')
    setImageFile(null)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item)
    setForm({
      nome: item.nome, descricao: item.descricao, preco: item.preco,
      imagem: item.imagem, categoriaId: item.categoriaId,
      ordem: item.ordem, ativo: item.ativo,
    })
    setImagePreview(item.imagem)
    setImageFile(null)
    setFormError('')
    setModalOpen(true)
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setSaving(true)

    try {
      let imagemUrl = form.imagem

      // Upload image if new file selected
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!upRes.ok) {
          const err = await upRes.json()
          setFormError(err.error ?? 'Erro ao fazer upload da imagem')
          return
        }
        const { url } = await upRes.json()
        imagemUrl = url
      }

      const payload = { ...form, imagem: imagemUrl }

      const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        setFormError(err.error ?? 'Erro ao salvar item')
        return
      }

      setModalOpen(false)
      await loadData()
    } catch {
      setFormError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteItem) return
    setDeleting(true)
    try {
      await fetch(`/api/menu/${deleteItem.id}`, { method: 'DELETE' })
      setDeleteItem(null)
      await loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  // ── Category CRUD ─────────────────────────────────────────────

  async function handleCatSubmit(e: FormEvent) {
    e.preventDefault()
    setCatError('')
    setCatSaving(true)
    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...catForm, ordem: categorias.length }),
      })
      if (!res.ok) {
        const err = await res.json()
        setCatError(err.error ?? 'Erro ao criar categoria')
        return
      }
      setCatModalOpen(false)
      setCatForm({ id: '', nome: '', icone: '' })
      await loadData()
    } catch {
      setCatError('Erro de conexão')
    } finally {
      setCatSaving(false)
    }
  }

  function openDeleteCatModal() {
    setDeleteCat(null)
    setDeleteCatModalOpen(true)
  }

  async function handleDeleteCat() {
    if (!deleteCat) return
    setDeletingCat(true)
    try {
      await fetch(`/api/categorias/${deleteCat.id}`, { method: 'DELETE' })
      setDeleteCatModalOpen(false)
      setDeleteCat(null)
      const next = categorias.find(c => c.id !== deleteCat.id)
      setCatAtiva(next?.id ?? '')
      await loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingCat(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────

  const currentCat = categorias.find(c => c.id === catAtiva)
  const filteredItems = (currentCat?.itens ?? []).filter(item =>
    item.nome.toLowerCase().includes(search.toLowerCase()) ||
    item.preco.toLowerCase().includes(search.toLowerCase())
  )
  const totalItens = categorias.reduce((acc, c) => acc + c.itens.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 to-amber-500 shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/milhao.png" alt="Logo" className="h-9 w-9 object-contain" />
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Festa do Milhão</p>
              <p className="text-amber-200 text-[11px]">Gerenciamento de Cardápio</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-colors"
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Categorias', value: categorias.length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { label: 'Total de Itens', value: totalItens, color: 'bg-orange-50 border-orange-200 text-orange-700' },
            { label: 'Nesta categoria', value: currentCat?.itens.length ?? 0, color: 'bg-sky-50 border-sky-200 text-sky-700' },
            { label: 'Ativos', value: categorias.reduce((a, c) => a + c.itens.filter(i => i.ativo).length, 0), color: 'bg-green-50 border-green-200 text-green-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category tabs + actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 pt-4 pb-0 gap-3 flex-wrap">
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCatAtiva(cat.id); setSearch('') }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    catAtiva === cat.id
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icone}</span>
                  <span>{cat.nome}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${catAtiva === cat.id ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {cat.itens.length}
                  </span>
                </button>
              ))}
              <button
                onClick={() => { setCatForm({ id: '', nome: '', icone: '' }); setCatModalOpen(true) }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
              >
                <Plus size={14} /> Nova categoria
              </button>
              <button
                onClick={openDeleteCatModal}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border-2 border-dashed border-gray-300 text-red-400 hover:border-red-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} /> Excluir categoria
              </button>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex-shrink-0"
            >
              <Plus size={16} /> Novo Item
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-t border-gray-50 mt-3">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar item..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Carregando...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">{search ? 'Nenhum item encontrado.' : 'Nenhum item nesta categoria.'}</p>
            {!search && (
              <button onClick={openCreate} className="mt-3 text-amber-600 hover:text-amber-700 text-sm font-semibold underline">
                Criar primeiro item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!item.ativo ? 'opacity-50' : 'border-gray-100'}`}
              >
                {/* Image */}
                <div className="relative h-32 bg-gray-50 overflow-hidden">
                  {item.imagem ? (
                    <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {currentCat?.icone ?? '🍽️'}
                    </div>
                  )}
                  {!item.ativo && (
                    <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-gray-800/80 px-2 py-0.5 rounded-full">Inativo</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow">
                    {item.preco}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-800 leading-tight truncate">{item.nome}</p>
                  {item.descricao && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.descricao}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1.5 mt-2.5">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Pencil size={12} /> Editar
                    </button>
                    <button
                      onClick={() => setDeleteItem(item)}
                      className="flex items-center justify-center px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Item Modal ─────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagem</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-40 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-2xl cursor-pointer overflow-hidden transition-colors group"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={24} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                      <Upload size={28} />
                      <span className="text-sm font-medium">Clique para enviar imagem</span>
                      <span className="text-xs">JPG, PNG, WebP · máx 5MB</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {!imageFile && (
                  <input
                    type="text"
                    value={form.imagem}
                    onChange={e => { setForm(f => ({ ...f, imagem: e.target.value })); setImagePreview(e.target.value) }}
                    placeholder="Ou informe o caminho da imagem (ex: /pamonha.jpg)"
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                )}
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  required
                  placeholder="Ex: Pamonha"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  placeholder="Descrição opcional do item"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                />
              </div>

              {/* Preço + Categoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preço *</label>
                  <input
                    type="text"
                    value={form.preco}
                    onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
                    required
                    placeholder="R$ 10"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoria *</label>
                  <div className="relative">
                    <select
                      value={form.categoriaId}
                      onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
                    >
                      <option value="">Selecione</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icone} {cat.nome}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ordem + Ativo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ordem</label>
                  <input
                    type="number"
                    value={form.ordem}
                    onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))}
                    min={0}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="flex flex-col justify-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm(f => ({ ...f, ativo: !f.ativo }))}
                      className={`relative w-10 h-5.5 rounded-full transition-colors ${form.ativo ? 'bg-green-500' : 'bg-gray-300'}`}
                      style={{ height: '22px' }}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.ativo ? 'left-5' : 'left-0.5'}`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{form.ativo ? 'Ativo' : 'Inativo'}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {saving ? 'Salvando...' : editingItem ? 'Salvar alterações' : 'Criar item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ────────────────────── */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Excluir item?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja excluir <strong className="text-gray-700">{deleteItem.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteItem(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Category Modal (picker + confirm) ── */}
      {deleteCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Excluir categoria</h2>
                <p className="text-xs text-gray-400 mt-0.5">Selecione a categoria que deseja remover</p>
              </div>
              <button
                onClick={() => { setDeleteCatModalOpen(false); setDeleteCat(null) }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Category picker */}
            <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
              {categorias.map(cat => {
                const selected = deleteCat?.id === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setDeleteCat(selected ? null : cat)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                      selected
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icone}</span>
                      <div>
                        <p className={`text-sm font-bold ${selected ? 'text-red-700' : 'text-gray-700'}`}>
                          {cat.nome}
                        </p>
                        <p className="text-xs text-gray-400">
                          {cat.itens.length === 0
                            ? 'Nenhum item'
                            : `${cat.itens.length} ${cat.itens.length === 1 ? 'item' : 'itens'} serão excluídos`}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected ? 'border-red-500 bg-red-500' : 'border-gray-300'
                    }`}>
                      {selected && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Warning + confirm */}
            <div className="p-4 pt-0">
              {deleteCat && deleteCat.itens.length > 0 && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3 text-xs text-red-700">
                  <span className="mt-0.5">⚠️</span>
                  <span>
                    <strong>{deleteCat.itens.length} {deleteCat.itens.length === 1 ? 'item' : 'itens'}</strong> dentro desta categoria também serão excluídos permanentemente.
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteCatModalOpen(false); setDeleteCat(null) }}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteCat}
                  disabled={!deleteCat || deletingCat}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {deletingCat ? 'Excluindo...' : 'Excluir categoria'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Modal ──────────────────────────── */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Nova Categoria</h2>
              <button onClick={() => setCatModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCatSubmit} className="p-6 space-y-4">
              {catError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{catError}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ID (slug) *</label>
                <input
                  type="text"
                  value={catForm.id}
                  onChange={e => setCatForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  required
                  placeholder="ex: bebidas-especiais"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome *</label>
                <input
                  type="text"
                  value={catForm.nome}
                  onChange={e => setCatForm(f => ({ ...f, nome: e.target.value }))}
                  required
                  placeholder="ex: Bebidas Especiais"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ícone (emoji) *</label>
                <input
                  type="text"
                  value={catForm.icone}
                  onChange={e => setCatForm(f => ({ ...f, icone: e.target.value }))}
                  required
                  placeholder="🍹"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setCatModalOpen(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={catSaving} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm">
                  {catSaving ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
