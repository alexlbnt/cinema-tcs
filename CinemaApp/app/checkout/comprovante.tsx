import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTicketsStore } from '../../src/store/ticketsStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatCurrency, formatDateTime } from '../../src/utils/format';

// QR Code simulado via SVG blocks (sem dependência extra)
function QRCodeDisplay({ value }: { value: string }) {
  // Gera grid determinístico a partir do valor
  const size = 10;
  const grid: boolean[][] = [];
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) & 0xffffffff;
  }
  const rand = (seed: number) => {
    seed = ((seed * 1103515245 + 12345) & 0x7fffffff);
    return seed / 0x7fffffff;
  };

  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      // Cantos são sempre preenchidos (padrão QR)
      const isCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c >= size - 3) ||
        (r >= size - 3 && c < 3);
      grid[r][c] = isCorner || rand(hash + r * size + c) > 0.5;
    }
  }

  const cellSize = 20;
  return (
    <View style={qrStyles.wrapper}>
      <View style={qrStyles.qr}>
        {grid.map((row, r) => (
          <View key={r} style={qrStyles.qrRow}>
            {row.map((filled, c) => (
              <View
                key={c}
                style={[
                  qrStyles.cell,
                  { width: cellSize, height: cellSize },
                  filled ? qrStyles.cellFilled : qrStyles.cellEmpty,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const qrStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', padding: Spacing.md },
  qr: {
    backgroundColor: '#fff', padding: 12, borderRadius: Radius.md,
    borderWidth: 3, borderColor: Colors.primary,
  },
  qrRow: { flexDirection: 'row' },
  cell: { borderRadius: 1 },
  cellFilled: { backgroundColor: '#000' },
  cellEmpty: { backgroundColor: '#fff' },
});

export default function ComprovanteScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const router = useRouter();
  const { tickets, markAsUsed } = useTicketsStore();

  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorText}>Ingresso não encontrado</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)/ingressos')}>
          <Text style={styles.homeBtnText}>Ir para Ingressos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `🎬 Meu ingresso - ${ticket.filmeNome}\n` +
          `📅 ${formatDateTime(ticket.sessaoData)}\n` +
          `🪑 Assentos: ${ticket.assentos.join(', ')}\n` +
          `🏛️ Sala ${ticket.salaNumero}\n` +
          `💰 Total: ${formatCurrency(ticket.valorTotal)}\n` +
          `🔑 Código: ${ticket.qrCode}`,
      });
    } catch {}
  };

  const handleMarkUsed = () => {
    Alert.alert(
      'Marcar como Utilizado',
      'Deseja marcar este ingresso como utilizado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            markAsUsed(ticket.id);
            router.replace('/(tabs)/ingressos');
          },
        },
      ]
    );
  };

  const isNew = ticket.status === 'ativo';

  return (
    <View style={styles.container}>
      {/* Header com sucesso */}
      <LinearGradient
        colors={isNew ? [Colors.primary, Colors.primaryDark] : ['#1A1A2E', '#12121A']}
        style={styles.header}
      >
        <View style={styles.successIcon}>
          <Ionicons
            name={isNew ? 'checkmark-circle' : 'ticket'}
            size={56}
            color={isNew ? '#fff' : Colors.textMuted}
          />
        </View>
        <Text style={styles.successTitle}>
          {isNew ? 'Compra Confirmada!' : 'Seu Ingresso'}
        </Text>
        <Text style={styles.successSub}>
          {isNew ? 'Apresente o QR Code na entrada' : ticket.filmeNome}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Ticket card físico */}
        <View style={styles.ticketCard}>
          {/* Topo */}
          <LinearGradient
            colors={[Colors.bgElevated, Colors.bgCard]}
            style={styles.ticketTop}
          >
            <Text style={styles.ticketFilme} numberOfLines={2}>{ticket.filmeNome}</Text>
            <Text style={styles.ticketData}>{formatDateTime(ticket.sessaoData)}</Text>
          </LinearGradient>

          {/* QR Code */}
          <QRCodeDisplay value={ticket.qrCode} />
          <Text style={styles.qrCode}>{ticket.qrCode}</Text>

          {/* Perfuração */}
          <View style={styles.perfRow}>
            <View style={styles.perfCircle} />
            <View style={styles.dashedLine} />
            <View style={styles.perfCircle} />
          </View>

          {/* Detalhes */}
          <View style={styles.ticketDetails}>
            <View style={styles.detailGrid}>
              {[
                { label: 'Sala', value: `Sala ${ticket.salaNumero}` },
                { label: 'Assentos', value: ticket.assentos.join(', ') },
                { label: 'Tipo', value: ticket.tipo },
                { label: 'Status', value: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) },
              ].map(({ label, value }) => (
                <View key={label} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>

            {ticket.snacks.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.snackTitle}>🍿 Combos</Text>
                {ticket.snacks.map((s) => (
                  <View key={s.id} style={styles.snackRow}>
                    <Text style={styles.snackNome}>{s.nome}</Text>
                    <Text style={styles.snackPreco}>{formatCurrency(s.preco)}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pago</Text>
              <Text style={styles.totalValue}>{formatCurrency(ticket.valorTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Compartilhar</Text>
          </TouchableOpacity>

          {ticket.status === 'ativo' && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleMarkUsed}>
              <Ionicons name="checkmark-done" size={20} color={Colors.success} />
              <Text style={[styles.actionBtnText, { color: Colors.success }]}>Marcar Usado</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botão final */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(tabs)/ingressos')}
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.homeBtnGrad}
          >
            <Ionicons name="ticket" size={18} color="#fff" />
            <Text style={styles.homeBtnText}>Ver Todos os Ingressos</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 60, paddingBottom: Spacing.xl, alignItems: 'center' },
  successIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  successSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 6 },
  scroll: { padding: Spacing.md, paddingBottom: 40 },
  ticketCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  ticketTop: { padding: Spacing.lg, alignItems: 'center' },
  ticketFilme: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  ticketData: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 6 },
  qrCode: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, fontFamily: 'monospace', paddingBottom: Spacing.sm },
  perfRow: { flexDirection: 'row', alignItems: 'center' },
  perfCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.bg, marginHorizontal: -10 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  ticketDetails: { padding: Spacing.md },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  detailItem: { minWidth: '45%' },
  detailLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '700', marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  snackTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
  snackRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  snackNome: { fontSize: FontSize.sm, color: Colors.textSecondary },
  snackPreco: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.accentGold },
  actions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.bgCard,
    paddingVertical: 14, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.primary + '50',
  },
  actionBtnDanger: { borderColor: Colors.success + '50' },
  actionBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
  homeBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  homeBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  homeBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
  errorText: { fontSize: FontSize.lg, color: Colors.textMuted, marginTop: Spacing.md, marginBottom: Spacing.xl },
});
