import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { snacksApi } from '../../src/api';
import { useCheckoutStore } from '../../src/store/checkoutStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatCurrency } from '../../src/utils/format';

const SNACK_ICONS: Record<string, string> = {
  Pipoca: '🍿',
  Refrigerante: '🥤',
  Água: '💧',
  Suco: '🍹',
  Nachos: '🧀',
  Chocolate: '🍫',
  Sorvete: '🍦',
  Hotdog: '🌭',
};

export default function SnacksScreen() {
  const { sessaoId, filmeNome } = useLocalSearchParams<{ sessaoId: string; filmeNome: string }>();
  const router = useRouter();
  const { snacks, toggleSnack, getTotalValue, seats } = useCheckoutStore();
  const [available, setAvailable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    snacksApi.getAll()
      .then(({ data }) => setAvailable(data))
      .finally(() => setLoading(false));
  }, []);

  const isSelected = (id: number) => snacks.some((s) => s.id === id);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Combos & Lanches</Text>
        <Text style={styles.sub}>Aproveite mais a experiência</Text>
      </LinearGradient>

      {/* Steps */}
      <View style={styles.steps}>
        {['Sessão', 'Assentos', 'Combos', 'Pagamento'].map((s, i) => (
          <View key={s} style={styles.step}>
            <View style={[styles.stepDot, i <= 2 && styles.stepDotActive]}>
              {i < 2 ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text style={[styles.stepNum, i <= 2 && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, i <= 2 && styles.stepLabelActive]}>{s}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={available}
          keyExtractor={(s) => String(s.id)}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            snacks.length > 0 ? (
              <View style={styles.selectedBanner}>
                <Ionicons name="cart" size={16} color={Colors.accentGold} />
                <Text style={styles.selectedBannerText}>
                  {snacks.length} item(s) adicionado(s)
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum snack disponível</Text>
            </View>
          }
          renderItem={({ item }) => {
            const sel = isSelected(item.id);
            const emoji = SNACK_ICONS[item.nome] || '🍽️';
            return (
              <TouchableOpacity
                style={[styles.card, sel && styles.cardSelected]}
                onPress={() => toggleSnack(item)}
                activeOpacity={0.8}
              >
                {sel && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={styles.snackNome} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.snackPreco}>{formatCurrency(item.preco)}</Text>
                <View style={[styles.addBtn, sel && styles.addBtnSelected]}>
                  <Text style={[styles.addBtnText, sel && styles.addBtnTextSelected]}>
                    {sel ? 'Remover' : 'Adicionar'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerSub}>Total com lanches</Text>
          <Text style={styles.footerTotal}>{formatCurrency(getTotalValue())}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push(
              `/checkout/pagamento?sessaoId=${sessaoId}&filmeNome=${encodeURIComponent(filmeNome || '')}`
            )
          }
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.nextBtnGrad}
          >
            <Text style={styles.nextBtnText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
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
  stepNum: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  stepLabelActive: { color: Colors.primary },
  list: { padding: Spacing.md },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  selectedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.accentGold + '20',
    padding: Spacing.md, borderRadius: Radius.md,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.accentGold + '40',
  },
  selectedBannerText: { color: Colors.accentGold, fontWeight: '600', fontSize: FontSize.sm },
  card: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, position: 'relative',
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 36, marginBottom: Spacing.sm },
  snackNome: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  snackPreco: { fontSize: FontSize.md, fontWeight: '800', color: Colors.accentGold, marginTop: 4 },
  addBtn: {
    marginTop: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
  },
  addBtnSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  addBtnText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700' },
  addBtnTextSelected: { color: '#fff' },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, paddingBottom: 30,
    backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  footerTotal: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  nextBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: Radius.md },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.md },
});
