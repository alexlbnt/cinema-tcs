import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SnackItem {
  id: number;
  nome: string;
  preco: number;
}

export interface TicketLocal {
  id: string; // UUID local
  pedidoId: number;
  filmeNome: string;
  sessaoData: string;
  salaNumero: number;
  assentos: string[];
  tipo: string;
  snacks: SnackItem[];
  valorTotal: number;
  dataCompra: string;
  qrCode: string; // string encodada para QR
  status: 'ativo' | 'utilizado' | 'cancelado';
}

interface TicketsState {
  tickets: TicketLocal[];
  isLoading: boolean;

  loadTickets: () => Promise<void>;
  addTicket: (ticket: Omit<TicketLocal, 'id' | 'dataCompra' | 'status'>) => Promise<TicketLocal>;
  markAsUsed: (id: string) => Promise<void>;
  syncWithServer: (serverTickets: any[]) => Promise<void>;
}

const STORAGE_KEY = '@cinema:tickets';

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useTicketsStore = create<TicketsState>((set, get) => ({
  tickets: [],
  isLoading: false,

  loadTickets: async () => {
    set({ isLoading: true });
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const tickets: TicketLocal[] = raw ? JSON.parse(raw) : [];
      set({ tickets });
    } finally {
      set({ isLoading: false });
    }
  },

  addTicket: async (ticketData) => {
    const newTicket: TicketLocal = {
      ...ticketData,
      id: generateId(),
      dataCompra: new Date().toISOString(),
      status: 'ativo',
    };

    const updated = [newTicket, ...get().tickets];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ tickets: updated });
    return newTicket;
  },

  markAsUsed: async (id) => {
    const updated = get().tickets.map((t) =>
      t.id === id ? { ...t, status: 'utilizado' as const } : t
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ tickets: updated });
  },

  // Sincroniza ingressos do servidor com o storage local
  syncWithServer: async (serverPedidos) => {
    const existing = get().tickets;
    const serverIds = serverPedidos.map((p: any) => p.id);

    // Remove locais que não existem mais no servidor
    const synced = existing.filter(
      (t) => !serverIds.includes(t.pedidoId) || true // mantém todos por enquanto
    );

    // Adiciona novos do servidor que ainda não estão local
    for (const pedido of serverPedidos) {
      const exists = synced.find((t) => t.pedidoId === pedido.id);
      if (!exists && pedido.ingressos?.length > 0) {
        const firstIngresso = pedido.ingressos[0];
        synced.unshift({
          id: generateId(),
          pedidoId: pedido.id,
          filmeNome: firstIngresso?.sessao?.filme?.titulo || 'Filme',
          sessaoData: firstIngresso?.sessao?.dataHorario || '',
          salaNumero: firstIngresso?.sessao?.sala?.numero || 0,
          assentos: pedido.ingressos.map((i: any) => i.assento || ''),
          tipo: firstIngresso?.tipo || 'Inteira',
          snacks: pedido.snacks || [],
          valorTotal: pedido.valorTotal,
          dataCompra: pedido.dataHora,
          qrCode: `CINEMA-${pedido.id}-${Date.now()}`,
          status: 'ativo',
        });
      }
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
    set({ tickets: synced });
  },
}));
