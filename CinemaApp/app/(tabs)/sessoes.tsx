import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sessoesApi } from '../../src/api';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatDateTime, formatCurrency, getGenreColor } from '../../src/utils/format';

interface Sessao {
  id: number;
  dataHorario: string;
  valorIngresso: number;
  filme: { id: number; titulo: string; genero: string; duracao: number };
  sala: { id: number; numero: number; capacidade: number };
  ingressos: any[];
}

function SessaoCard({ sessao, onPress }: { sessao: Sessao; onPress: () => void }) {
  const ocupados = sessao.ingressos?.length || 0;
  const disponivel = sessao.sala.capacidade - ocupados;
  const pct = ocupados / sessao.sala.capacidade;
  const genreColor = getGenreColor(sessao.filme.genero);

  const statusColor =
    disponivel === 0 ? Colors.error : pct > 0.7 ? Colors.warning : Colors.success;
  const statusText =
    disponivel === 0 ? 'Esgotado' : pct > 0.7 ? 'Quase lotado' : 'Disponível';

  return (
    <TouchableOpacity
      style={[styles.card, disponivel === 0 && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={disponivel > 0 ? 0.8 : 1}
      disabled={disponivel === 0}
    >
      <View style={[styles.genreBar, { backgroundColor: genreColor }]} />
      <View style={styles.cardBody}>
        <View style={styles.topRow}>
          <Text style={styles.titulo} numberOfLines={1}>{sessao.filme.titulo}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '25', borderColor: statusColor + '60' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.meta}>{formatDateTime(sessao.dataHorario)}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.meta}>Sala {sessao.sala.numero} • {sessao.sala.capacidade} lugares</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceArea}>
            <Text style={styles.priceLabel}>A partir de</Text>
            <Text style={styles.price}>{formatCurrency(sessao.valorIngresso / 2)}</Text>
          </View>
          <View style={styles.capacityArea}>
            <View style={styles.capacityBar}>
              <View style={[styles.capacityFill, { width: `${pct * 100}%`, backgroundColor: statusColor }]} />
            </View>
            <Text style={styles.capacityText}>{disponivel} lugares livres</Text>
          </View>
          <TouchableOpacity
            style={[styles.comprarBtn, disponivel === 0 && { backgroundColor: Colors.bgElevated }]}
            onPress={onPress}
            disabled={disponivel === 0}
          >
            <Text style={[styles.comprarBtnText, disponivel === 0 && { color: Colors.textMuted }]}>
              {disponivel === 0 ? 'Esgotado' : 'Comprar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SessoesScreen() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      const { data } = await sessoesApi.getAll();
      setSessoes(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <Text style={styles.headerTitle}>Sessões</Text>
        <Text style={styles.headerSub}>Hoje e próximos dias</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={sessoes}
          keyExtractor={(s) => String(s.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="calendar-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma sessão disponível</Text>
            </View>
          }
          renderItem={({ item }) => (
            <SessaoCard
              sessao={item}
              onPress={() =>
                router.push(
                  `/checkout/assentos?sessaoId=${item.id}&filmeNome=${encodeURIComponent(item.filme.titulo)}`
                )
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1 },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  list: { padding: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', overflow: 'hidden',
  },
  genreBar: { width: 4 },
  cardBody: { flex: 1, padding: Spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  titulo: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full, borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  meta: { fontSize: FontSize.sm, color: Colors.textSecondary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm },
  priceArea: {},
  priceLabel: { fontSize: 10, color: Colors.textMuted },
  price: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.accentGold },
  capacityArea: { flex: 1, marginHorizontal: Spacing.md },
  capacityBar: { height: 4, backgroundColor: Colors.bgElevated, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  capacityFill: { height: '100%', borderRadius: 2 },
  capacityText: { fontSize: 10, color: Colors.textMuted },
  comprarBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  comprarBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
});
