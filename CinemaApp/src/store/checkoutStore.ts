import { create } from 'zustand';
import { SnackItem } from './ticketsStore';

export interface SeatSelection {
  assento: string;
  tipo: 'Inteira' | 'Meia';
}

interface CheckoutState {
  sessaoId: number | null;
  sessaoInfo: any | null;
  seats: SeatSelection[];
  snacks: SnackItem[];
  step: 'sessao' | 'assentos' | 'snacks' | 'pagamento' | 'comprovante';

  setSessao: (sessaoId: number, info: any) => void;
  addSeat: (seat: SeatSelection) => void;
  removeSeat: (assento: string) => void;
  toggleSnack: (snack: SnackItem) => void;
  setStep: (step: CheckoutState['step']) => void;
  getTotalValue: () => number;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  sessaoId: null,
  sessaoInfo: null,
  seats: [],
  snacks: [],
  step: 'sessao',

  setSessao: (sessaoId, info) => set({ sessaoId, sessaoInfo: info, seats: [], snacks: [] }),

  addSeat: (seat) => {
    const { seats } = get();
    if (!seats.find((s) => s.assento === seat.assento)) {
      set({ seats: [...seats, seat] });
    }
  },

  removeSeat: (assento) =>
    set({ seats: get().seats.filter((s) => s.assento !== assento) }),

  toggleSnack: (snack) => {
    const { snacks } = get();
    const exists = snacks.find((s) => s.id === snack.id);
    if (exists) {
      set({ snacks: snacks.filter((s) => s.id !== snack.id) });
    } else {
      set({ snacks: [...snacks, snack] });
    }
  },

  setStep: (step) => set({ step }),

  getTotalValue: () => {
    const { seats, snacks, sessaoInfo } = get();
    const valorIngresso = sessaoInfo?.valorIngresso || 0;
    const totalIngressos = seats.reduce(
      (sum, seat) =>
        sum + (seat.tipo === 'Meia' ? valorIngresso / 2 : valorIngresso),
      0
    );
    const totalSnacks = snacks.reduce((sum, s) => sum + s.preco, 0);
    return totalIngressos + totalSnacks;
  },

  reset: () =>
    set({
      sessaoId: null,
      sessaoInfo: null,
      seats: [],
      snacks: [],
      step: 'sessao',
    }),
}));
