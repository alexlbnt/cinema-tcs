import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM", { locale: ptBR });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateStr;
  }
};

export const formatTime = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), 'HH:mm', { locale: ptBR });
  } catch {
    return dateStr;
  }
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

export const genreColors: Record<string, string> = {
  Ação: '#E50914',
  Terror: '#7C3AED',
  Comédia: '#F59E0B',
  Drama: '#3B82F6',
  Romance: '#EC4899',
  'Ficção Científica': '#06B6D4',
  Animação: '#22C55E',
  Aventura: '#F97316',
  Suspense: '#8B5CF6',
};

export const getGenreColor = (genre: string) =>
  genreColors[genre] || '#A0A0B8';
