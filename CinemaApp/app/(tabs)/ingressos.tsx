import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTicketsStore } from '../../src/store/ticketsStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatDateTime, formatCurrency } from '../../src/utils/format';

const STATUS_CONFIG = {
  ativo: { label: 'Ativo', color: Colors.success, icon: 'checkmark-circle' },
  utilizado: { label: 'Utilizado', color: Colors.textMuted, icon: 'checkmark-done-circle' },
  cancelado: { label: 'Cancelado', color: Colors.error, icon: 'close-circle' },
};

function TicketCard({ ticket, onPress }: { ticket: any; onPress: () => void }) {
  const status = STATUS_CONFIG[ticket.status as keyof typeof STATUS_CONFIG];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Top stub */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.stub}
      >
        <View style={styles.stubLeft}>
          <Text style={styles.stubFilme} numberOfLines={1}>{ticket.filmeNome}</Text>
          <Text style={styles.stubData}>{formatDateTime(ticket.sessaoData)}</Text>
        </View>
        <View style={styles.stubRight}>
          <Ionicons name="ticket" size={32} color="rgba(255,255,255,0.3)" />
        </View>
      </LinearGradient>

      {/* Perfuração */}
      <View style={styles.perforationRow}>
        <View style={styles.perfCircle} />
        <View style={styles.dashedLine} />
        <View style={styles.perfCircle} />
      </View>

      {/* Bottom info */}
      <View style={styles.bottom}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sala</Text>
            <Text style={styles.infoValue}>Sala {ticket.salaNumero}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Assentos</Text>
            <Text style={styles.infoValue}>{ticket.assentos.join(', ')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>{ticket.tipo}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total</Text>
            <Text style={[styles.infoValue, { color: Colors.accentGold }]}>
              {formatCurrency(ticket.valorTotal)}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20', borderColor: status.color + '50' }]}>
            <Ionicons name={status.icon as any} size={14} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
          <TouchableOpacity style={styles.detailBtn} onPress={onPress}>
            <Text style={styles.detailBtnText}>Ver QR Code</Text>
            <Ionicons name="qr-code-outline" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function IngressosScreen() {
  const { tickets, isLoading } = useTicketsStore();
  const router = useRouter();

  const ativos = tickets.filter((t) => t.status === 'ativo');
  const historico = tickets.filter((t) => t.status !== 'ativo');

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <Text style={styles.headerTitle}>Meus Ingressos</Text>
        <Text style={styles.headerSub}>{tickets.length} ingresso(s) no total</Text>
      </LinearGradient>

      <FlatList
        data={[...ativos, ...historico]}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="ticket-outline" size={64} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Nenhum ingresso ainda</Text>
            <Text style={styles.emptyDesc}>Compre seu primeiro ingresso e aproveite!</Text>
            <TouchableOpacity style={styles.comprarBtn} onPress={() => router.push('/(tabs)/filmes')}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primary]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.comprarBtnGrad}
              >
                <Text style={styles.comprarBtnText}>Ver Filmes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          ativos.length > 0 ? (
            <Text style={styles.sectionTitle}>🎟️ Ativos ({ativos.length})</Text>
          ) : null
        }
        renderItem={({ item, index }) => {
          const showHistorico =
            historico.length > 0 && index === ativos.length && ativos.length > 0;
          return (
            <>
              {showHistorico && (
                <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
                  📁 Histórico ({historico.length})
                </Text>
              )}
              {historico.length > 0 && ativos.length === 0 && index === 0 && (
                <Text style={styles.sectionTitle}>📁 Histórico ({historico.length})</Text>
              )}
              <TicketCard
                ticket={item}
                onPress={() => router.push(`/checkout/comprovante?ticketId=${item.id}`)}
              />
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1 },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  list: { padding: Spacing.md, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  stub: { flexDirection: 'row', padding: Spacing.md, justifyContent: 'space-between', alignItems: 'center' },
  stubLeft: { flex: 1 },
  stubFilme: { fontSize: FontSize.lg, fontWeight: '800', color: '#fff' },
  stubData: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  stubRight: {},
  perforationRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: -8 },
  perfCircle: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.bg, marginHorizontal: -8,
  },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  bottom: { padding: Spacing.md },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.md },
  infoItem: { minWidth: '45%' },
  infoLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '700', marginTop: 2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radius.full, borderWidth: 1,
  },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  detailBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
  emptyIcon: {
    width: 120, height: 120, borderRadius: 40,
    backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptyDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl },
  comprarBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  comprarBtnGrad: { paddingHorizontal: 32, paddingVertical: 14, alignItems: 'center' },
  comprarBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  center: { alignItems: 'center', justifyContent: 'center' },
});
