const BASE_URL = window.location.port === '5173' ? 'http://localhost:3000' : '';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
})

// ==================== AUTH ====================
export async function loginAdmin(email, senha) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Credenciais inválidas')
  }
  return response.json()
}

// ==================== FILMES ====================
export async function fetchFilmes() {
  try {
    const response = await fetch(`${BASE_URL}/filme`)
    if (!response.ok) throw new Error('Erro ao buscar filmes')
    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function criarFilme(dadosFilme, token) {
  const response = await fetch(`${BASE_URL}/filme`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dadosFilme),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao criar filme')
  }
  return response.json()
}

export async function excluirFilme(id, token) {
  const response = await fetch(`${BASE_URL}/filme/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao excluir filme')
  }
  return response.json()
}

export async function editarFilme(id, dadosFilme, token) {
  const response = await fetch(`${BASE_URL}/filme/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(dadosFilme),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao editar filme')
  }
  return response.json()
}

// ==================== SALAS ====================
export async function fetchSalas() {
  try {
    const response = await fetch(`${BASE_URL}/sala`)
    if (!response.ok) throw new Error('Erro ao buscar salas')
    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function criarSala(dadosSala, token) {
  const response = await fetch(`${BASE_URL}/sala`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dadosSala),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao criar sala')
  }
  return response.json()
}

export async function editarSala(id, dadosSala, token) {
  const response = await fetch(`${BASE_URL}/sala/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(dadosSala),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao editar sala')
  }
  return response.json()
}

export async function excluirSala(id, token) {
  const response = await fetch(`${BASE_URL}/sala/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao excluir sala')
  }
  return response.json()
}

// ==================== SESSÕES ====================
export async function fetchSessoes() {
  try {
    const response = await fetch(`${BASE_URL}/sessao`)
    if (!response.ok) throw new Error('Erro ao buscar sessões')
    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function criarSessao(dadosSessao, token) {
  const response = await fetch(`${BASE_URL}/sessao`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dadosSessao),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao criar sessão')
  }
  return response.json()
}

export async function editarSessao(id, dadosSessao, token) {
  const response = await fetch(`${BASE_URL}/sessao/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(dadosSessao),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao editar sessão')
  }
  return response.json()
}

export async function excluirSessao(id, token) {
  const response = await fetch(`${BASE_URL}/sessao/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao excluir sessão')
  }
  return response.json()
}

// ==================== SNACKS ====================
export async function fetchSnacks() {
  try {
    const response = await fetch(`${BASE_URL}/snack`)
    if (!response.ok) throw new Error('Erro ao buscar snacks')
    return response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function criarSnack(dadosSnack, token) {
  const response = await fetch(`${BASE_URL}/snack`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dadosSnack),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao criar snack')
  }
  return response.json()
}

export async function editarSnack(id, dadosSnack, token) {
  const response = await fetch(`${BASE_URL}/snack/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(dadosSnack),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao editar snack')
  }
  return response.json()
}

export async function excluirSnack(id, token) {
  const response = await fetch(`${BASE_URL}/snack/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao excluir snack')
  }
  return response.json()
}

// ==================== INGRESSOS ====================
export async function criarIngresso(dadosIngresso, token) {
  const response = await fetch(`${BASE_URL}/ingresso`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dadosIngresso),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao criar ingresso')
  }
  return response.json()
}

// ==================== PEDIDOS ====================
export async function criarPedido(dadosPedido, token) {
  const response = await fetch(`${BASE_URL}/pedido`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dadosPedido),
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erro ao criar pedido')
  }
  return response.json()
}
