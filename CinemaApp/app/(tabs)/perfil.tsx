import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useTicketsStore } from '../../src/store/ticketsStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';
import { formatCurrency } from '../../src/utils/format';

function MenuItem({ icon, label, onPress, danger }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && { backgroundColor: Colors.error + '20' }]}>
        <Ionicons name={icon} size={20} color={danger ? Colors.error : Colors.textSecondary} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={danger ? Colors.error : Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const { user, logout } = useAuthStore();
  const { tickets } = useTicketsStore();
  const router = useRouter();

  const totalGasto = tickets.reduce((sum, t) => sum + t.valorTotal, 0);
  const ativos = tickets.filter((t) => t.status === 'ativo').length;

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const initials = user?.nome
    ? user.nome.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.header}>
        <View style={styles.avatarArea}>
          <LinearGradient colors={[Colors.primaryLight, Colors.primary]} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <View>
            <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total Ingressos', value: String(tickets.length), icon: 'ticket' },
          { label: 'Ativos', value: String(ativos), icon: 'checkmark-circle', color: Colors.success },
          { label: 'Total Gasto', value: formatCurrency(totalGasto), icon: 'cash', color: Colors.accentGold },
        ].map(({ label, value, icon, color }) => (
          <View key={label} style={styles.statCard}>
            <Ionicons name={icon as any} size={24} color={color || Colors.primary} />
            <Text style={[styles.statValue, { color: color || Colors.textPrimary }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Dados Pessoais" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="lock-closed-outline" label="Alterar Senha" onPress={() => router.push('/(auth)/forgot-password')} />
          <View style={styles.divider} />
          <MenuItem icon="notifications-outline" label="Notificações" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="help-circle-outline" label="Central de Ajuda" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="document-text-outline" label="Termos de Uso" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark-outline" label="Privacidade" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.menuCard}>
          <MenuItem icon="log-out-outline" label="Sair da Conta" onPress={handleLogout} danger />
        </View>
      </View>

      <Text style={styles.version}>CinemaApp v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 40 },
  header: { paddingTop: 60, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.lg },
  avatarArea: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FontSize.xl, fontWeight: '900', color: '#fff' },
  userName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  userEmail: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  menuCard: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.md + 36 + Spacing.md },
  version: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.xl },
});
