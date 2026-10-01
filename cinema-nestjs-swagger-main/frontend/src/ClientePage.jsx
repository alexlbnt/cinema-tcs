import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './ClientePage.css'
import { fetchFilmes, fetchSessoes, fetchSnacks, criarIngresso, criarPedido } from './api'

const GENERO_EMOJIS = {
  'ação': '💥', 'terror': '👻', 'comédia': '😂', 'drama': '🎭',
  'romance': '💕', 'ficção': '🚀', 'animação': '🎨', 'aventura': '⚔️',
  'suspense': '🔍', 'fantasia': '🧙', 'documentário': '📽️',
}

function getFilmeEmoji(genero) {
  if (!genero) return '🎬'
  const lower = genero.toLowerCase()
  for (const [key, emoji] of Object.entries(GENERO_EMOJIS)) {
    if (lower.includes(key)) return emoji
  }
  return '🎬'
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const COLS = 8

// Gera mapa de assentos ocupados de forma determinística por sessão
function gerarAssentosOcupados(sessaoId, capacidade, totalIngressos) {
  const ocupados = new Set()
  const seed = sessaoId * 31
  let n = totalIngressos
  let i = 0
  while (n > 0 && i < ROWS.length * COLS) {
    const hash = (seed + i * 17) % (ROWS.length * COLS)
    const row = ROWS[Math.floor(hash / COLS)]
    const col = (hash % COLS) + 1
    ocupados.add(`${row}${col}`)
    n--
    i++
  }
  return ocupados
}

function SeatMap({ sessao, selectedSeats, onToggleSeat }) {
  const totalIngressos = sessao.ingressos?.length || 0
  const ocupados = gerarAssentosOcupados(sessao.id, sessao.sala?.capacidade || 64, totalIngressos)

  return (
    <div className="seat-map-wrapper">
      <div className="screen-area">
        <div className="screen-bar" />
        <span className="screen-label">TELA</span>
      </div>

      <div className="seat-grid">
        {ROWS.map(row => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            {Array.from({ length: COLS }, (_, i) => {
              const key = `${row}${i + 1}`
              const isOcupado = ocupados.has(key)
              const isSelected = selectedSeats.includes(key)
              return (
                <button
                  key={key}
                  className={`seat ${isOcupado ? 'ocupado' : isSelected ? 'selecionado' : 'livre'}`}
                  onClick={() => !isOcupado && onToggleSeat(key)}
                  disabled={isOcupado}
                  title={isOcupado ? 'Ocupado' : key}
                >
                  {i + 1}
                </button>
              )
            })}
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <span><span className="legend-dot livre" />Livre</span>
        <span><span className="legend-dot selecionado" />Selecionado</span>
        <span><span className="legend-dot ocupado" />Ocupado</span>
      </div>

      <p className="seat-count">
        {selectedSeats.length} assento(s) selecionado(s)
        {selectedSeats.length > 0 && `: ${selectedSeats.join(', ')}`}
      </p>
    </div>
  )
}

function ClientePage() {
  const [filmes, setFilmes] = useState([])
  const [sessoes, setSessoes] = useState([])
  const [snacks, setSnacks] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedFilmeId, setSelectedFilmeId] = useState(null)
  const [selectedSessao, setSelectedSessao] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  const [qtyInteira, setQtyInteira] = useState(0)
  const [qtyMeia, setQtyMeia] = useState(0)
  const [cartSnacks, setCartSnacks] = useState({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationData, setConfirmationData] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [f, se, sn] = await Promise.all([fetchFilmes(), fetchSessoes(), fetchSnacks()])
        setFilmes(f)
        setSessoes(se)
        setSnacks(sn)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const selectedFilme = filmes.find(f => f.id === selectedFilmeId)
  const filteredSessoes = sessoes.filter(s => s.filmeId === selectedFilmeId)

  const handleSelectFilme = (filme) => {
    setSelectedFilmeId(filme.id === selectedFilmeId ? null : filme.id)
    setSelectedSessao(null)
    setSelectedSeats([])
    setQtyInteira(0)
    setQtyMeia(0)
    setCartSnacks({})
  }

  const handleSelectSessao = (sessao) => {
    setSelectedSessao(sessao.id === selectedSessao?.id ? null : sessao)
    setSelectedSeats([])
    setQtyInteira(0)
    setQtyMeia(0)
    setCartSnacks({})
  }

  const handleToggleSeat = (key) => {
    setSelectedSeats(prev => {
      if (prev.includes(key)) return prev.filter(s => s !== key)
      return [...prev, key]
    })
  }

  // Sincroniza qty de ingressos com assentos selecionados
  const totalSeats = selectedSeats.length
  const totalTickets = qtyInteira + qtyMeia

  const toggleSnack = (snackId) => {
    setCartSnacks(prev => {
      const copy = { ...prev }
      if (copy[snackId]) delete copy[snackId]
      else copy[snackId] = 1
      return copy
    })
  }

  const addSnackQty = (snackId, delta) => {
    setCartSnacks(prev => {
      const copy = { ...prev }
      const newQty = (copy[snackId] || 0) + delta
      if (newQty <= 0) delete copy[snackId]
      else copy[snackId] = newQty
      return copy
    })
  }

  const precoInteira = selectedSessao?.valorIngresso || 0
  const precoMeia = precoInteira * 0.5

  const totalIngressos = (qtyInteira * precoInteira) + (qtyMeia * precoMeia)
  const totalSnacks = Object.entries(cartSnacks).reduce((sum, [id, qty]) => {
    const snack = snacks.find(s => s.id === Number(id))
    return sum + (snack ? snack.preco * qty : 0)
  }, 0)
  const totalGeral = totalIngressos + totalSnacks

  // Valida: assentos selecionados = ingressos
  const assentosOk = totalSeats > 0 && totalSeats === totalTickets

  const handleFinalizar = async () => {
    if (totalTickets === 0) {
      alert('Selecione ao menos 1 ingresso.')
      return
    }
    if (totalSeats !== totalTickets) {
      alert(`Você escolheu ${totalTickets} ingresso(s) mas selecionou ${totalSeats} assento(s). Ajuste para continuar.`)
      return
    }

    setIsSubmitting(true)
    try {
      const ingressosCriados = []
      const inteiraSeats = selectedSeats.slice(0, qtyInteira)
      const meiaSeats = selectedSeats.slice(qtyInteira)

      for (const assento of inteiraSeats) {
        const ing = await criarIngresso({
          sessaoId: selectedSessao.id,
          tipo: 'Inteira',
          valorPago: precoInteira,
          assento,
        })
        ingressosCriados.push(ing)
      }

      for (const assento of meiaSeats) {
        const ing = await criarIngresso({
          sessaoId: selectedSessao.id,
          tipo: 'Meia',
          valorPago: precoMeia,
          assento,
        })
        ingressosCriados.push(ing)
      }

      const snackIds = []
      for (const [id, qty] of Object.entries(cartSnacks)) {
        for (let i = 0; i < qty; i++) snackIds.push(Number(id))
      }

      const pedido = await criarPedido({
        ingressoIds: ingressosCriados.map(i => i.id),
        snackIds,
        valorTotal: totalGeral,
      })

      setConfirmationData({
        pedido,
        filme: selectedFilme,
        sessao: selectedSessao,
        assentos: selectedSeats,
        qtyInteira,
        qtyMeia,
        snacksComprados: Object.entries(cartSnacks).map(([id, qty]) => ({
          ...snacks.find(s => s.id === Number(id)),
          qty,
        })),
        totalGeral,
      })

      setSelectedFilmeId(null)
      setSelectedSessao(null)
      setSelectedSeats([])
      setQtyInteira(0)
      setQtyMeia(0)
      setCartSnacks({})
    } catch (error) {
      alert(`Erro no pedido: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="cliente-container">
      <header className="cliente-header">
        <div className="logo">🎬 CineMax</div>
        <nav>
          <Link to="/admin" className="header-link">⚙️ Gestão</Link>
        </nav>
      </header>

      <section className="cliente-hero">
        <h1>Escolha seu <span className="highlight">Filme</span></h1>
        <p>Selecione um filme, horário, seus assentos e garanta seus snacks favoritos!</p>
      </section>

      <main className="cliente-main">
        {loading ? (
          <div className="empty-state">
            <span className="icon">⏳</span>
            <p>Carregando programação...</p>
          </div>
        ) : filmes.length === 0 ? (
          <div className="empty-state">
            <span className="icon">🎞️</span>
            <p>Nenhum filme em cartaz no momento. Volte em breve!</p>
          </div>
        ) : (
          <>
            {/* STEP 1: Filmes */}
            <h2 className="section-heading">🍿 Em Cartaz</h2>
            <div className="films-showcase">
              {filmes.map(filme => (
                <div
                  key={filme.id}
                  className={`film-card ${selectedFilmeId === filme.id ? 'selected' : ''}`}
                  onClick={() => handleSelectFilme(filme)}
                >
                  <div className="film-poster">{getFilmeEmoji(filme.genero)}</div>
                  <div className="film-info">
                    <h3>{filme.titulo}</h3>
                    <div className="film-tags">
                      <span className="film-tag">{filme.genero}</span>
                      <span className="film-tag">{filme.duracao}min</span>
                      <span className="film-tag age">{filme.classificacaoEtaria === 0 ? 'Livre' : `+${filme.classificacaoEtaria}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* STEP 2: Sessões */}
            {selectedFilmeId && (
              <div className="sessions-panel">
                <h3>Sessões de <span>{selectedFilme?.titulo}</span></h3>
                {filteredSessoes.length === 0 ? (
                  <div className="empty-state">
                    <span className="icon">📅</span>
                    <p>Nenhuma sessão agendada para este filme.</p>
                  </div>
                ) : (
                  <div className="sessions-grid">
                    {filteredSessoes.map(sessao => (
                      <div
                        key={sessao.id}
                        className={`session-card ${selectedSessao?.id === sessao.id ? 'selected' : ''}`}
                        onClick={() => handleSelectSessao(sessao)}
                      >
                        <div className="session-date">
                          {new Date(sessao.dataHorario).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                          {' · '}
                          {new Date(sessao.dataHorario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="session-meta">
                          <span>Sala <strong>{sessao.sala?.numero || sessao.salaId}</strong></span>
                          <span>Ingresso <strong>R$ {sessao.valorIngresso?.toFixed(2)}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Mapa de Assentos */}
            {selectedSessao && (
              <div className="checkout-panel">
                <h3>🪑 Escolha seus Assentos</h3>
                <SeatMap
                  sessao={selectedSessao}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />
              </div>
            )}

            {/* STEP 4: Carrinho */}
            {selectedSessao && selectedSeats.length > 0 && (
              <div className="checkout-panel">
                <h3>🎟️ Monte seu Pedido</h3>

                <div className="checkout-section">
                  <h4>Ingressos
                    <span className="seats-hint">
                      {` — distribua entre os ${selectedSeats.length} assento(s): ${selectedSeats.join(', ')}`}
                    </span>
                  </h4>

                  <div className="ticket-row">
                    <span className="ticket-type-label">Inteira</span>
                    <span className="ticket-price">R$ {precoInteira.toFixed(2)}</span>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => setQtyInteira(Math.max(0, qtyInteira - 1))}>−</button>
                      <span className="qty-value">{qtyInteira}</span>
                      <button
                        className="qty-btn"
                        onClick={() => totalTickets < totalSeats && setQtyInteira(qtyInteira + 1)}
                        disabled={totalTickets >= totalSeats}
                      >+</button>
                    </div>
                  </div>

                  <div className="ticket-row">
                    <span className="ticket-type-label">Meia-entrada <span style={{ fontSize: '12px', color: 'var(--text-alt)' }}>(-50%)</span></span>
                    <span className="ticket-price">R$ {precoMeia.toFixed(2)}</span>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => setQtyMeia(Math.max(0, qtyMeia - 1))}>−</button>
                      <span className="qty-value">{qtyMeia}</span>
                      <button
                        className="qty-btn"
                        onClick={() => totalTickets < totalSeats && setQtyMeia(qtyMeia + 1)}
                        disabled={totalTickets >= totalSeats}
                      >+</button>
                    </div>
                  </div>

                  {totalSeats > 0 && totalTickets !== totalSeats && (
                    <p className="seats-warning">
                      ⚠️ Você selecionou {totalSeats} assento(s) mas definiu {totalTickets} ingresso(s). Ajuste para continuar.
                    </p>
                  )}
                </div>

                {snacks.length > 0 && (
                  <div className="checkout-section">
                    <h4>🍿 Bombonière (opcional)</h4>
                    <div className="snacks-list">
                      {snacks.map(snack => {
                        const inCart = cartSnacks[snack.id]
                        return (
                          <div key={snack.id} className={`snack-item ${inCart ? 'in-cart' : ''}`}>
                            <span className="snack-emoji">🍿</span>
                            <div className="snack-details" onClick={() => { if (!inCart) toggleSnack(snack.id) }}>
                              <div className="snack-name">{snack.nome}</div>
                              <div className="snack-price">R$ {snack.preco?.toFixed(2)}</div>
                            </div>
                            {inCart ? (
                              <div className="qty-control">
                                <button className="qty-btn" onClick={() => addSnackQty(snack.id, -1)}>−</button>
                                <span className="qty-value">{cartSnacks[snack.id]}</span>
                                <button className="qty-btn" onClick={() => addSnackQty(snack.id, 1)}>+</button>
                              </div>
                            ) : (
                              <span className="snack-badge" onClick={() => toggleSnack(snack.id)}>ADD</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="total-bar">
                  <span className="total-label">Total</span>
                  <span className="total-value">R$ {totalGeral.toFixed(2)}</span>
                </div>

                <button
                  className="btn-finalizar"
                  onClick={handleFinalizar}
                  disabled={totalTickets === 0 || !assentosOk || isSubmitting}
                >
                  {isSubmitting
                    ? 'Processando Pedido...'
                    : assentosOk
                      ? `Finalizar Pedido (${totalTickets} ingresso${totalTickets !== 1 ? 's' : ''})`
                      : `Defina ${totalSeats} ingresso(s) para continuar`}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Confirmation Overlay */}
      {confirmationData && (
        <div className="confirmation-overlay">
          <div className="confirmation-card">
            <span className="check-icon">✅</span>
            <h2>Pedido Confirmado!</h2>
            <p className="subtitle">Seu pedido #{confirmationData.pedido.id} foi registrado com sucesso.</p>

            <div className="receipt">
              <div className="receipt-row">
                <span>Filme</span>
                <span className="val">{confirmationData.filme?.titulo}</span>
              </div>
              <div className="receipt-row">
                <span>Sessão</span>
                <span className="val">
                  {new Date(confirmationData.sessao.dataHorario).toLocaleDateString('pt-BR')}
                  {' · '}
                  {new Date(confirmationData.sessao.dataHorario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="receipt-row">
                <span>Sala</span>
                <span className="val">{confirmationData.sessao.sala?.numero || confirmationData.sessao.salaId}</span>
              </div>
              <div className="receipt-row">
                <span>Assentos</span>
                <span className="val">{confirmationData.assentos.join(', ')}</span>
              </div>
              {confirmationData.qtyInteira > 0 && (
                <div className="receipt-row">
                  <span>{confirmationData.qtyInteira}x Inteira</span>
                  <span className="val">R$ {(confirmationData.qtyInteira * confirmationData.sessao.valorIngresso).toFixed(2)}</span>
                </div>
              )}
              {confirmationData.qtyMeia > 0 && (
                <div className="receipt-row">
                  <span>{confirmationData.qtyMeia}x Meia</span>
                  <span className="val">R$ {(confirmationData.qtyMeia * confirmationData.sessao.valorIngresso * 0.5).toFixed(2)}</span>
                </div>
              )}
              {confirmationData.snacksComprados.map((s, i) => (
                <div key={i} className="receipt-row">
                  <span>{s.qty}x {s.nome}</span>
                  <span className="val">R$ {(s.preco * s.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="receipt-row total">
                <span>Total Pago</span>
                <span className="val">R$ {confirmationData.totalGeral.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-close-confirm" onClick={() => setConfirmationData(null)}>
              Voltar à Programação
            </button>
          </div>
        </div>
      )}

      <footer className="cliente-footer">
        <p>CineMax &copy; 2026 · <Link to="/admin">Painel Administrativo</Link></p>
      </footer>
    </div>
  )
}

export default ClientePage
