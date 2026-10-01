import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { sessoesApi } from '../../src/api';
import { useCheckoutStore } from '../../src/store/checkoutStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatDateTime, formatCurrency } from '../../src/utils/format';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = 8;

function generateSeats(capacidade: number, ocupados: number) {
  // Distribui assentos ocupados aleatoriamente (seed fixo por sessão)
  const seats: Record<string, 'livre' | 'ocupado'> = {};
  let count = 0;
  for (const row of ROWS) {
    for (let c = 1; c <= COLS; c++) {
      const key = `${row}${c}`;
      if (count < capacidade) {
        // Simula ocupação com base no número (para demo)
        const hash = (row.charCodeAt(0) + c * 7) % 10;
        seats[key] = hash < (ocupados / capacidade) * 10 ? 'ocupado' : 'livre';
        count++;
      }
    }
  }
  return seats;
}

export default function AssentosScreen() {
  const { sessaoId, filmeNome } = useLocalSearchParams<{ sessaoId: string; filmeNome: string }>();
  const router = useRouter();
  const { setSessao, addSeat, removeSeat, seats, sessaoInfo } = useCheckoutStore();
  const [loading, setLoading] = useState(true);
  const [sessao, setSessaoData] = useState<any>(null);
  const [seatMap, setSeatMap] = useState<Record<string, 'livre' | 'ocupado'>>({});
  const [selectedTipo, setSelectedTipo] = useState<'Inteira' | 'Meia'>('Inteira');

  useEffect(() => {
    if (!sessaoId) return;
    sessoesApi.getOne(Number(sessaoId))
      .then(({ data }) => {
        setSessaoData(data);
        setSessao(Number(sessaoId), data);
        const ocupados = data.ingressos?.length || 0;
        setSeatMap(generateSeats(data.sala.capacidade, ocupados));
      })
      .finally(() => setLoading(false));
  }, [sessaoId]);

  const toggleSeat = (key: string) => {
    if (seatMap[key] === 'ocupado') return;
    const already = seats.find((s) => s.assento === key);
    if (already) {
      removeSeat(key);
    } else {
      addSeat({ assento: key, tipo: selectedTipo });
    }
  };

  const getSeatStatus = (key: string) => {
    if (seatMap[key] === 'ocupado') return 'ocupado';
    const sel = seats.find((s) => s.assento === key);
    if (sel) return sel.tipo === 'Meia' ? 'selecionado-meia' : 'selecionado';
    return 'livre';
  };

  const valorIngresso = sessaoInfo?.valorIngresso || 0;
  const totalSeats = seats.reduce(
    (sum, s) => sum + (s.tipo === 'Meia' ? valorIngresso / 2 : valorIngresso),
    0
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{decodeURIComponent(filmeNome || '')}</Text>
        {sessao && <Text style={styles.sub}>{formatDateTime(sessao.dataHorario)} • Sala {sessao.sala.numero}</Text>}
      </LinearGradient>

      {/* Steps */}
      <View style={styles.steps}>
        {['Sessão', 'Assentos', 'Combos', 'Pagamento'].map((s, i) => (
          <View key={s} style={styles.step}>
            <View style={[styles.stepDot, i <= 1 && styles.stepDotActive]}>
              {i < 1 ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text style={[styles.stepNum, i <= 1 && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, i <= 1 && styles.stepLabelActive]}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView>
        {/* Tipo selector */}
        <View style={styles.tipoRow}>
          <Text style={styles.tipoTitle}>Tipo de Ingresso</Text>
          <View style={styles.tipoButtons}>
            {(['Inteira', 'Meia'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tipoBtn, selectedTipo === t && styles.tipoBtnActive]}
                onPress={() => setSelectedTipo(t)}
              >
                <Text style={[styles.tipoBtnText, selectedTipo === t && styles.tipoBtnTextActive]}>
                  {t} {t === 'Meia' ? `(${formatCurrency(valorIngresso / 2)})` : `(${formatCurrency(valorIngresso)})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Screen */}
        <View style={styles.screenArea}>
          <LinearGradient colors={[Colors.primary + '80', Colors.primary + '00']} style={styles.screen} />
          <Text style={styles.screenLabel}>TELA</Text>
        </View>

        {/* Seat grid */}
        <View style={styles.grid}>
          {ROWS.map((row) => (
            <View key={row} style={styles.gridRow}>
              <Text style={styles.rowLabel}>{row}</Text>
              <View style={styles.rowSeats}>
                {Array.from({ length: COLS }, (_, i) => {
                  const key = `${row}${i + 1}`;
                  if (!seatMap[key]) return null;
                  const status = getSeatStatus(key);
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.seat,
                        status === 'livre' && styles.seatLivre,
                        status === 'ocupado' && styles.seatOcupado,
                        status === 'selecionado' && styles.seatSelecionado,
                        status === 'selecionado-meia' && styles.seatSelecionadoMeia,
                      ]}
                      onPress={() => toggleSeat(key)}
                      disabled={status === 'ocupado'}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.seatText, (status === 'selecionado' || status === 'selecionado-meia') && styles.seatTextActive]}>
                        {i + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.rowLabel}>{row}</Text>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { color: Colors.seatAvailable, label: 'Livre' },
            { color: Colors.seatOccupied, label: 'Ocupado' },
            { color: Colors.seatSelected, label: 'Inteira' },
            { color: Colors.seatSelectedMeia, label: 'Meia' },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerSub}>{seats.length} assento(s) selecionado(s)</Text>
          <Text style={styles.footerTotal}>{formatCurrency(totalSeats)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.nextBtn, seats.length === 0 && { opacity: 0.5 }]}
          disabled={seats.length === 0}
          onPress={() =>
            router.push(
              `/checkout/snacks?sessaoId=${sessaoId}&filmeNome=${encodeURIComponent(filmeNome || '')}`
            )
          }
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.nextBtnGrad}
          >
            <Text style={styles.nextBtnText}>Próximo</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  backBtn: { marginBottom: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  steps: { flexDirection: 'row', justifyContent: 'center', padding: Spacing.sm, gap: Spacing.xl, backgroundColor: Colors.bgCard, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { alignItems: 'center', gap: 4 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  stepLabelActive: { color: Colors.primary },
  tipoRow: { padding: Spacing.md },
  tipoTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
  tipoButtons: { flexDirection: 'row', gap: Spacing.sm },
  tipoBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.bgCard },
  tipoBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '20' },
  tipoBtnText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  tipoBtnTextActive: { color: Colors.primary },
  screenArea: { alignItems: 'center', marginBottom: Spacing.sm },
  screen: { height: 12, width: '70%', borderRadius: 6 },
  screenLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', letterSpacing: 4, marginTop: 4 },
  grid: { paddingHorizontal: Spacing.md, gap: 6 },
  gridRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowLabel: { width: 16, fontSize: 11, color: Colors.textMuted, fontWeight: '700', textAlign: 'center' },
  rowSeats: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  seat: {
    width: 34, height: 34, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  seatLivre: { backgroundColor: Colors.seatAvailable, borderWidth: 1, borderColor: Colors.border },
  seatOcupado: { backgroundColor: Colors.seatOccupied },
  seatSelecionado: { backgroundColor: Colors.seatSelected },
  seatSelecionadoMeia: { backgroundColor: Colors.seatSelectedMeia },
  seatText: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
  seatTextActive: { color: '#fff' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg, padding: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 3 },
  legendText: { fontSize: 11, color: Colors.textMuted },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, paddingBottom: 30,
    backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  footerTotal: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  nextBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  nextBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
});
