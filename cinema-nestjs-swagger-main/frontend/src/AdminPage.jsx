import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminPage.css'
import {
  fetchFilmes, criarFilme, editarFilme, excluirFilme,
  fetchSalas, criarSala, editarSala, excluirSala,
  fetchSessoes, criarSessao, editarSessao, excluirSessao,
  fetchSnacks, criarSnack, editarSnack, excluirSnack,
  loginAdmin,
} from './api'

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginAdmin(email, senha)
      if (data.user?.role !== 'ADMIN') throw new Error('Acesso restrito a administradores')
      onLogin(data.access_token, data.user)
    } catch (err) {
      setError(err.message || 'Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0c10' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 40, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#fff', fontSize: 24 }}>🎬 Cinema Admin</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 32, fontSize: 14 }}>Faça login para acessar o painel</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#aaa', fontSize: 13 }}>E-mail</label>
            <input
              type="email" placeholder="admin@cinema.com" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 15, boxSizing: 'border-box', WebkitTextFillColor: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#aaa', fontSize: 13 }}>Senha</label>
            <input
              type="password" placeholder="••••••••" value={senha}
              onChange={e => setSenha(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 15, boxSizing: 'border-box', WebkitTextFillColor: '#fff' }}
            />
          </div>
          {error && (
            <p style={{ color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</p>
          )}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 12, background: '#5c3ce6', border: 'none', color: '#fff', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#666', fontSize: 12, marginTop: 20 }}>
          Conta de teste: <strong style={{ color: '#aaa' }}>admin@cinema.com</strong> / <strong style={{ color: '#aaa' }}>senha123</strong>
        </p>
      </div>
    </div>
  )
}

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null)
  const [adminUser, setAdminUser] = useState(() => {
    const u = localStorage.getItem('admin_user')
    return u ? JSON.parse(u) : null
  })
  const [activeTab, setActiveTab] = useState('filmes')
  const [loading, setLoading] = useState(true)
  const [filmes, setFilmes] = useState([])
  const [salas, setSalas] = useState([])
  const [sessoes, setSessoes] = useState([])
  const [snacks, setSnacks] = useState([])
  const [modalType, setModalType] = useState(null)
  const [editingItemId, setEditingItemId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({})

  const handleLogin = (accessToken, user) => {
    localStorage.setItem('admin_token', accessToken)
    localStorage.setItem('admin_user', JSON.stringify(user))
    setToken(accessToken)
    setAdminUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setAdminUser(null)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [fData, saData, seData, snData] = await Promise.all([fetchFilmes(), fetchSalas(), fetchSessoes(), fetchSnacks()])
      setFilmes(fData); setSalas(saData); setSessoes(seData); setSnacks(snData)
    } catch (e) { console.error('Erro ao carregar dados:', e) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (token) loadData() }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openModal = (type, itemToEdit = null) => {
    setModalType(type)
    if (itemToEdit) {
      setEditingItemId(itemToEdit.id)
      let d = { ...itemToEdit }
      if (type === 'sessao' && d.dataHorario) d.dataHorario = new Date(d.dataHorario).toISOString().slice(0, 16)
      setFormData(d)
    } else { setEditingItemId(null); setFormData({}) }
  }

  const handleDelete = async (type, id, nome) => {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return
    try {
      if (type === 'filme') await excluirFilme(id, token)
      else if (type === 'sala') await excluirSala(id, token)
      else if (type === 'sessao') await excluirSessao(id, token)
      else if (type === 'snack') await excluirSnack(id, token)
      await loadData()
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) { alert('Sessão expirada.'); handleLogout() }
      else alert(`Erro ao excluir: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true)
    try {
      if (modalType === 'filme') {
        const p = { titulo: formData.titulo, genero: formData.genero, duracao: Number(formData.duracao), classificacaoEtaria: Number(formData.classificacaoEtaria) }
        if (editingItemId) await editarFilme(editingItemId, p, token); else await criarFilme(p, token)
      } else if (modalType === 'sala') {
        const p = { numero: Number(formData.numero), capacidade: Number(formData.capacidade) }
        if (editingItemId) await editarSala(editingItemId, p, token); else await criarSala(p, token)
      } else if (modalType === 'sessao') {
        const p = { filmeId: Number(formData.filmeId), salaId: Number(formData.salaId), dataHorario: new Date(formData.dataHorario).toISOString(), valorIngresso: Number(formData.valorIngresso) }
        if (editingItemId) await editarSessao(editingItemId, p, token); else await criarSessao(p, token)
      } else if (modalType === 'snack') {
        const p = { nome: formData.nome, preco: Number(formData.preco) }
        if (editingItemId) await editarSnack(editingItemId, p, token); else await criarSnack(p, token)
      }
      setModalType(null); setEditingItemId(null); await loadData()
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) { alert('Sessão expirada.'); handleLogout() }
      else alert(`Erro: ${error.message}`)
    } finally { setIsSubmitting(false) }
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />

  return (
    <div className="app-container">
      <header className="header" style={{ flexWrap: 'wrap', gap: '15px' }}>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>Cinema Admin</h1>
          <Link to="/" className="nav-button" style={{ fontSize: '13px', padding: '6px 14px', textDecoration: 'none' }}>🎬 Vitrine</Link>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['filmes', 'salas', 'sessoes', 'snacks'].map(tab => (
            <button key={tab} className="nav-button" style={activeTab === tab ? { borderColor: '#fff' } : {}} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <span style={{ color: 'var(--text-alt)', fontSize: 13 }}>👤 {adminUser?.nome}</span>
          <button className="nav-button" style={{ fontSize: '13px', padding: '6px 14px', borderColor: 'rgba(220,50,50,0.5)', color: '#ff6b6b' }} onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section" style={{ marginBottom: '40px' }}>
          <h2>Gestão do <span className="gradient-text">Cinema</span></h2>
          <p>Plataforma administrativa para gerenciar Filmes, Salas, Sessões e Bombonière.</p>
        </section>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div><p>Sincronizando Banco de Dados...</p></div>
        ) : (
          <>
            {activeTab === 'filmes' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h3 className="section-title" style={{ margin: 0, border: 0 }}>Filmes em Cartaz</h3>
                  <button className="nav-button" style={{ background: 'var(--accent-color)' }} onClick={() => openModal('filme')}>+ Novo Filme</button>
                </div>
                <div className="movies-grid">
                  {filmes.length === 0 ? <p style={{ color: 'var(--text-alt)' }}>Nenhum filme cadastrado.</p> : filmes.map(filme => (
                    <div key={filme.id} className="glass-card">
                      <div className="movie-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span>{filme.titulo}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-edit" onClick={() => openModal('filme', filme)}>⚙️</button>
                          <button className="btn-edit" style={{ borderColor: 'rgba(220,50,50,0.3)', color: '#ff6b6b' }} onClick={() => handleDelete('filme', filme.id, filme.titulo)}>🗑️</button>
                        </div>
                      </div>
                      <div className="card-content"><div className="metadata">
                        <div className="metadata-item"><span className="metadata-label">Gênero</span><span className="metadata-val">{filme.genero}</span></div>
                        <div className="metadata-item"><span className="metadata-label">Duração</span><span className="metadata-val">{filme.duracao} min</span></div>
                        <div className="metadata-item"><span className="metadata-label">Classificação</span><span className="metadata-val">{filme.classificacaoEtaria === 0 ? 'Livre' : `+${filme.classificacaoEtaria}`}</span></div>
                      </div></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'salas' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h3 className="section-title" style={{ margin: 0, border: 0 }}>Salas de Cinema</h3>
                  <button className="nav-button" style={{ background: 'var(--accent-color)' }} onClick={() => openModal('sala')}>+ Nova Sala</button>
                </div>
                <div className="movies-grid">
                  {salas.length === 0 ? <p style={{ color: 'var(--text-alt)' }}>Nenhuma sala cadastrada.</p> : salas.map(sala => (
                    <div key={sala.id} className="glass-card">
                      <div className="movie-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span>Sala {sala.numero}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-edit" onClick={() => openModal('sala', sala)}>⚙️</button>
                          <button className="btn-edit" style={{ borderColor: 'rgba(220,50,50,0.3)', color: '#ff6b6b' }} onClick={() => handleDelete('sala', sala.id, `Sala ${sala.numero}`)}>🗑️</button>
                        </div>
                      </div>
                      <div className="card-content"><div className="metadata">
                        <div className="metadata-item"><span className="metadata-label">Capacidade</span><span className="metadata-val">{sala.capacidade} lugares</span></div>
                      </div></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'sessoes' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h3 className="section-title" style={{ margin: 0, border: 0 }}>Sessões Agendadas</h3>
                  <button className="nav-button" style={{ background: 'var(--accent-color)' }} onClick={() => openModal('sessao')}>+ Agendar Sessão</button>
                </div>
                <div className="movies-grid">
                  {sessoes.length === 0 ? <p style={{ color: 'var(--text-alt)' }}>Nenhuma sessão cadastrada.</p> : sessoes.map(sessao => (
                    <div key={sessao.id} className="glass-card">
                      <div className="movie-title" style={{ color: 'var(--accent-color-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span>{new Date(sessao.dataHorario).toLocaleDateString()} às {new Date(sessao.dataHorario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-edit" onClick={() => openModal('sessao', sessao)}>⚙️</button>
                          <button className="btn-edit" style={{ borderColor: 'rgba(220,50,50,0.3)', color: '#ff6b6b' }} onClick={() => handleDelete('sessao', sessao.id, `Sessão de ${sessao.filme?.titulo || sessao.filmeId}`)}>🗑️</button>
                        </div>
                      </div>
                      <div className="card-content"><div className="metadata">
                        <div className="metadata-item"><span className="metadata-label">Filme</span><span className="metadata-val">{sessao.filme?.titulo || `Filme #${sessao.filmeId}`}</span></div>
                        <div className="metadata-item"><span className="metadata-label">Sala</span><span className="metadata-val">Sala {sessao.sala?.numero || sessao.salaId}</span></div>
                        <div className="metadata-item"><span className="metadata-label">Preço</span><span className="metadata-val">R$ {sessao.valorIngresso?.toFixed(2)}</span></div>
                      </div></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'snacks' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h3 className="section-title" style={{ margin: 0, border: 0 }}>Bombonière</h3>
                  <button className="nav-button" style={{ background: 'var(--accent-color)' }} onClick={() => openModal('snack')}>+ Adicionar Snack</button>
                </div>
                <div className="movies-grid">
                  {snacks.length === 0 ? <p style={{ color: 'var(--text-alt)' }}>Nenhum snack cadastrado.</p> : snacks.map(snack => (
                    <div key={snack.id} className="glass-card">
                      <div className="movie-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span>{snack.nome}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-edit" onClick={() => openModal('snack', snack)}>⚙️</button>
                          <button className="btn-edit" style={{ borderColor: 'rgba(220,50,50,0.3)', color: '#ff6b6b' }} onClick={() => handleDelete('snack', snack.id, snack.nome)}>🗑️</button>
                        </div>
                      </div>
                      <div className="card-content"><div className="metadata">
                        <div className="metadata-item"><span className="metadata-label">Preço</span><span className="metadata-val">R$ {snack.preco?.toFixed(2)}</span></div>
                      </div></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {modalType === 'filme' && (editingItemId ? 'Editar Filme' : 'Novo Filme')}
                {modalType === 'sala' && (editingItemId ? 'Editar Sala' : 'Nova Sala')}
                {modalType === 'sessao' && (editingItemId ? 'Remarcar Sessão' : 'Agendar Sessão')}
                {modalType === 'snack' && (editingItemId ? 'Editar Produto' : 'Cadastrar Snack')}
              </h3>
              <button type="button" className="close-button" onClick={() => { setModalType(null); setEditingItemId(null) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {modalType === 'filme' && (<>
                <div className="form-group"><label>Título</label><input type="text" name="titulo" className="form-input" value={formData.titulo || ''} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Gênero</label><input type="text" name="genero" className="form-input" placeholder="Ex: Terror, Ação" value={formData.genero || ''} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Duração (min)</label><input type="number" name="duracao" className="form-input" min="1" value={formData.duracao || ''} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Faixa Etária (0 = Livre)</label><input type="number" name="classificacaoEtaria" className="form-input" min="0" value={formData.classificacaoEtaria || ''} onChange={handleInputChange} required /></div>
              </>)}
              {modalType === 'sala' && (<>
                <div className="form-group"><label>Número da Sala</label><input type="number" name="numero" className="form-input" min="1" value={formData.numero || ''} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Capacidade Total</label><input type="number" name="capacidade" className="form-input" min="1" value={formData.capacidade || ''} onChange={handleInputChange} required /></div>
              </>)}
              {modalType === 'sessao' && (<>
                <div className="form-group"><label>Filme</label>
                  <select name="filmeId" className="form-input" value={formData.filmeId || ''} onChange={handleInputChange} required>
                    <option value="" disabled>Selecione um filme</option>
                    {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Sala</label>
                  <select name="salaId" className="form-input" value={formData.salaId || ''} onChange={handleInputChange} required>
                    <option value="" disabled>Selecione uma sala</option>
                    {salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero} ({s.capacidade} lugares)</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Data e Horário</label><input type="datetime-local" name="dataHorario" className="form-input" value={formData.dataHorario || ''} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Valor do Ingresso (R$)</label><input type="number" step="0.01" name="valorIngresso" className="form-input" min="0" value={formData.valorIngresso || ''} onChange={handleInputChange} required /></div>
              </>)}
              {modalType === 'snack' && (<>
                <div className="form-group"><label>Nome do Produto</label><input type="text" name="nome" className="form-input" placeholder="Ex: Pipoca M" value={formData.nome || ''} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Preço (R$)</label><input type="number" step="0.01" name="preco" className="form-input" min="0" value={formData.preco || ''} onChange={handleInputChange} required /></div>
              </>)}
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (editingItemId ? 'Atualizando...' : 'Salvando...') : (editingItemId ? 'Salvar Alterações' : 'Finalizar Cadastro')}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer><p>Projeto de Interface para a Cinema API Rest</p></footer>
    </div>
  )
}

export default AdminPage
