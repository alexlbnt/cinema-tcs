import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { sessoesApi } from '../../src/api';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatDateTime, formatCurrency } from '../../src/utils/format';

export default function SessaoPickerScreen() {
  const { filmeId, filmeNome } = useLocalSearchParams<{ filmeId: string; filmeNome: string }>();
  const router = useRouter();
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessoesApi.getAll()
      .then(({ data }) => {
        const filtradas = filmeId
          ? data.filter((s: any) => String(s.filmeId) === filmeId || String(s.filme?.id) === filmeId)
          : data;
        setSessoes(filtradas);
      })
      .finally(() => setLoading(false));
  }, [filmeId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.subtitle}>Escolha uma sessão</Text>
        <Text style={styles.title} numberOfLines={2}>{decodeURIComponent(filmeNome || '')}</Text>
      </LinearGradient>

      {/* Steps indicator */}
      <View style={styles.steps}>
        {['Sessão', 'Assentos', 'Combos', 'Pagamento'].map((s, i) => (
          <View key={s} style={styles.step}>
            <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
              <Text style={[styles.stepNum, i === 0 && styles.stepNumActive]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>{s}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={sessoes}
          keyExtractor={(s) => String(s.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="calendar-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma sessão disponível</Text>
            </View>
          }
          renderItem={({ item }) => {
            const ocupados = item.ingressos?.length || 0;
            const disponivel = item.sala?.capacidade - ocupados;
            const isFull = disponivel <= 0;

            return (
              <TouchableOpacity
                style={[styles.card, isFull && styles.cardDisabled]}
                onPress={() =>
                  !isFull &&
                  router.push(
                    `/checkout/assentos?sessaoId=${item.id}&filmeNome=${encodeURIComponent(filmeNome || item.filme?.titulo || '')}`
                  )
                }
                disabled={isFull}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <View style={styles.dateBlock}>
                    <Ionicons name="calendar" size={16} color={Colors.primary} />
                    <Text style={styles.dateText}>{formatDateTime(item.dataHorario)}</Text>
                  </View>
                  {isFull ? (
                    <View style={styles.fullBadge}>
                      <Text style={styles.fullBadgeText}>Esgotado</Text>
                    </View>
                  ) : (
                    <Text style={styles.disponivel}>{disponivel} livres</Text>
                  )}
                </View>
                <View style={styles.cardBottom}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>Sala {item.sala?.numero}</Text>
                  </View>
                  <View style={styles.priceBlock}>
                    <Text style={styles.priceLabel}>Meia</Text>
                    <Text style={styles.price}>{formatCurrency(item.valorIngresso / 2)}</Text>
                  </View>
                  <View style={styles.priceBlock}>
                    <Text style={styles.priceLabel}>Inteira</Text>
                    <Text style={styles.price}>{formatCurrency(item.valorIngresso)}</Text>
                  </View>
                  {!isFull && (
                    <View style={styles.selectBtn}>
                      <Text style={styles.selectBtnText}>Selecionar</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  backBtn: { marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  steps: { flexDirection: 'row', justifyContent: 'center', padding: Spacing.md, gap: Spacing.xl, backgroundColor: Colors.bgCard, borderBottomWidth: 1, borderBottomColor: Colors.border },
  step: { alignItems: 'center', gap: 4 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNum: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  stepLabelActive: { color: Colors.primary },
  list: { padding: Spacing.md, gap: Spacing.md },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  cardDisabled: { opacity: 0.5 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  dateBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  disponivel: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '600' },
  fullBadge: { backgroundColor: Colors.error + '25', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  fullBadgeText: { color: Colors.error, fontSize: FontSize.xs, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  metaText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  priceBlock: { alignItems: 'center' },
  priceLabel: { fontSize: 10, color: Colors.textMuted },
  price: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.accentGold },
  selectBtn: { backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md },
  selectBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
});
