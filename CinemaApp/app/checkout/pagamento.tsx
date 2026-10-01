import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ingressosApi, pedidosApi } from '../../src/api';
import { useCheckoutStore } from '../../src/store/checkoutStore';
import { useTicketsStore } from '../../src/store/ticketsStore';
import { useAuthStore } from '../../src/store/authStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatCurrency, formatDateTime } from '../../src/utils/format';

const PAYMENT_METHODS = [
  { id: 'cartao', label: 'Cartão de Crédito', icon: 'card', detail: 'Até 6x sem juros' },
  { id: 'debito', label: 'Cartão de Débito', icon: 'card-outline', detail: 'Pagamento imediato' },
  { id: 'pix', label: 'PIX', icon: 'qr-code', detail: 'Aprovação instantânea' },
  { id: 'dinheiro', label: 'Dinheiro', icon: 'cash', detail: 'Pague na bilheteria' },
];

export default function PagamentoScreen() {
  const { sessaoId, filmeNome } = useLocalSearchParams<{ sessaoId: string; filmeNome: string }>();
  const router = useRouter();
  const { seats, snacks, sessaoInfo, getTotalValue, reset } = useCheckoutStore();
  const { addTicket } = useTicketsStore();
  const { user } = useAuthStore();
  const [payMethod, setPayMethod] = useState('pix');
  const [loading, setLoading] = useState(false);

  const total = getTotalValue();
  const valorIngresso = sessaoInfo?.valorIngresso || 0;

  const handleComprar = async () => {
    if (seats.length === 0) {
      Toast.show({ type: 'error', text1: 'Selecione pelo menos um assento' });
      return;
    }
    setLoading(true);
    try {
      // 1. Criar ingressos
      const ingressoIds: number[] = [];
      for (const seat of seats) {
        const { data } = await ingressosApi.create({
          sessaoId: Number(sessaoId),
          tipo: seat.tipo,
          valorPago: seat.tipo === 'Meia' ? valorIngresso / 2 : valorIngresso,
          assento: seat.assento,
          usuarioId: user?.id,
        });
        ingressoIds.push(data.id);
      }

      // 2. Criar pedido
      const { data: pedido } = await pedidosApi.create({
        ingressoIds,
        snackIds: snacks.map((s) => s.id),
        valorTotal: total,
      });

      // 3. Salvar ticket local
      const ticket = await addTicket({
        pedidoId: pedido.id,
        filmeNome: sessaoInfo?.filme?.titulo || decodeURIComponent(filmeNome || ''),
        sessaoData: sessaoInfo?.dataHorario || '',
        salaNumero: sessaoInfo?.sala?.numero || 0,
        assentos: seats.map((s) => s.assento),
        tipo: seats[0]?.tipo || 'Inteira',
        snacks: snacks,
        valorTotal: total,
        qrCode: `CINEMA-${pedido.id}-${Date.now()}`,
      });

      reset();
      router.replace(`/checkout/comprovante?ticketId=${ticket.id}`);
    } catch (err: any) {
      console.log('ERRO COMPRA:', JSON.stringify(err?.response?.data || err?.message));
      const msg = err?.response?.data?.message || 'Erro ao processar pagamento';
      Toast.show({ type: 'error', text1: 'Erro', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Pagamento</Text>
        <Text style={styles.sub}>Revise e confirme seu pedido</Text>
      </LinearGradient>

      {/* Steps */}
      <View style={styles.steps}>
        {['Sessão', 'Assentos', 'Combos', 'Pagamento'].map((s, i) => (
          <View key={s} style={styles.step}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              {i < 3 ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text style={styles.stepNumActive}>{i + 1}</Text>
              )}
            </View>
            <Text style={styles.stepLabelActive}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Resumo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Filme</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {sessaoInfo?.filme?.titulo || decodeURIComponent(filmeNome || '')}
              </Text>
            </View>
            {sessaoInfo?.dataHorario && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Data/Hora</Text>
                <Text style={styles.summaryValue}>{formatDateTime(sessaoInfo.dataHorario)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sala</Text>
              <Text style={styles.summaryValue}>Sala {sessaoInfo?.sala?.numero}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.subSection}>Ingressos</Text>
            {seats.map((s) => (
              <View key={s.assento} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Assento {s.assento} ({s.tipo})</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(s.tipo === 'Meia' ? valorIngresso / 2 : valorIngresso)}
                </Text>
              </View>
            ))}
            {snacks.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.subSection}>Lanches</Text>
                {snacks.map((s) => (
                  <View key={s.id} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{s.nome}</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(s.preco)}</Text>
                  </View>
                ))}
              </>
            )}
            <View style={[styles.divider, { backgroundColor: Colors.primary + '40' }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.textPrimary, fontWeight: '800', fontSize: FontSize.md }]}>
                Total
              </Text>
              <Text style={[styles.summaryValue, { color: Colors.accentGold, fontSize: FontSize.lg }]}>
                {formatCurrency(total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Método de pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          <View style={styles.methodsCard}>
            {PAYMENT_METHODS.map((m, i) => (
              <View key={m.id}>
                {i > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.methodRow}
                  onPress={() => setPayMethod(m.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.methodIcon, payMethod === m.id && { backgroundColor: Colors.primary + '25' }]}>
                    <Ionicons name={m.icon as any} size={20} color={payMethod === m.id ? Colors.primary : Colors.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.methodLabel, payMethod === m.id && { color: Colors.primary }]}>
                      {m.label}
                    </Text>
                    <Text style={styles.methodDetail}>{m.detail}</Text>
                  </View>
                  <View style={[styles.radio, payMethod === m.id && styles.radioActive]}>
                    {payMethod === m.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total a pagar</Text>
          <Text style={styles.footerTotal}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, loading && { opacity: 0.7 }]}
          onPress={handleComprar}
          disabled={loading}
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.payBtnGrad}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color="#fff" />
                <Text style={styles.payBtnText}>Confirmar Pagamento</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  backBtn: { marginBottom: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  steps: { flexDirection: 'row', justifyContent: 'center', padding: Spacing.sm, gap: Spacing.xl, backgroundColor: Colors.bgCard, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { alignItems: 'center', gap: 4 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNumActive: { fontSize: 11, color: '#fff', fontWeight: '700' },
  stepLabelActive: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  scroll: { padding: Spacing.md },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
  summaryCard: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  summaryValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  subSection: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 6 },
  methodsCard: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  methodIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '600' },
  methodDetail: { fontSize: FontSize.xs, color: Colors.textMuted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, paddingBottom: 30,
    backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  footerTotal: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  payBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  payBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  payBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
});
