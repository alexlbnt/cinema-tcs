import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { filmesApi } from '../../src/api';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatDuration, getGenreColor } from '../../src/utils/format';

interface Filme {
  id: number;
  titulo: string;
  genero: string;
  duracao: number;
  classificacaoEtaria: number;
}

const RATING_COLOR: Record<number, string> = {
  0: '#22C55E',
  10: '#F59E0B',
  12: '#F97316',
  14: '#EF4444',
  16: '#DC2626',
  18: '#7C3AED',
};

function FilmeCard({ filme, onPress }: { filme: Filme; onPress: () => void }) {
  const genreColor = getGenreColor(filme.genero);
  const ratingColor = RATING_COLOR[filme.classificacaoEtaria] || Colors.textMuted;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Poster placeholder com gradiente e ícone */}
      <LinearGradient
        colors={[genreColor + '40', Colors.bgElevated]}
        style={styles.poster}
      >
        <Ionicons name="film" size={40} color={genreColor} />
        <View style={[styles.ratingBadge, { backgroundColor: ratingColor }]}>
          <Text style={styles.ratingText}>{filme.classificacaoEtaria}+</Text>
        </View>
      </LinearGradient>

      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={2}>{filme.titulo}</Text>
        <View style={styles.genreRow}>
          <View style={[styles.genreBadge, { backgroundColor: genreColor + '25', borderColor: genreColor + '60' }]}>
            <Text style={[styles.genreText, { color: genreColor }]}>{filme.genero}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{formatDuration(filme.duracao)}</Text>
        </View>
        <TouchableOpacity style={styles.sessaoBtn} onPress={onPress}>
          <Text style={styles.sessoaBtnText}>Ver Sessões</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function FilmesScreen() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [filtrados, setFiltrados] = useState<Filme[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      const { data } = await filmesApi.getAll();
      setFilmes(data);
      setFiltrados(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltrados(filmes);
    } else {
      const q = search.toLowerCase();
      setFiltrados(filmes.filter(
        (f) => f.titulo.toLowerCase().includes(q) || f.genero.toLowerCase().includes(q)
      ));
    }
  }, [search, filmes]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <Text style={styles.headerTitle}>Em Cartaz</Text>
        <Text style={styles.headerSub}>{filtrados.length} filmes disponíveis</Text>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título ou gênero..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(f) => String(f.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="film-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
            </View>
          }
          renderItem={({ item }) => (
            <FilmeCard
              filme={item}
              onPress={() => router.push(`/checkout/sessao-picker?filmeId=${item.id}&filmeNome=${encodeURIComponent(item.titulo)}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingTop: 60, paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1 },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2, marginBottom: Spacing.md },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, color: Colors.textPrimary, fontSize: FontSize.sm },
  list: { padding: Spacing.md, gap: Spacing.md },
  card: {
    flexDirection: 'row', backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  poster: {
    width: 100, height: 140,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  ratingBadge: {
    position: 'absolute', top: 8, right: 8,
    borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  ratingText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  info: { flex: 1, padding: Spacing.md, justifyContent: 'space-between' },
  titulo: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, lineHeight: 20 },
  genreRow: { flexDirection: 'row', marginTop: 4 },
  genreBadge: {
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1,
  },
  genreText: { fontSize: FontSize.xs, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.textMuted },
  sessaoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: Radius.md, alignSelf: 'flex-start',
    marginTop: 4,
  },
  sessoaBtnText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: Spacing.md },
});
