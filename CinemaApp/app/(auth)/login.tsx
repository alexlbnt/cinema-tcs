import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../src/store/authStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos' });
      return;
    }
    try {
      await login(email.trim(), senha);
      router.replace('/(tabs)/filmes');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Email ou senha incorretos';
      Toast.show({ type: 'error', text1: 'Erro ao entrar', text2: msg });
    }
  };

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Ionicons name="film" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.logoText}>CINEMA</Text>
            <Text style={styles.logoSub}>Sua experiência começa aqui</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Entrar</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showSenha}
                />
                <TouchableOpacity onPress={() => setShowSenha(!showSenha)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtnGrad}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Entrar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Cadastrar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  logoArea: { alignItems: 'center', marginBottom: Spacing.xl },
  logoIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary + '40',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: FontSize.xxxl, fontWeight: '900',
    color: Colors.textPrimary, letterSpacing: 8,
  },
  logoSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl, fontWeight: '700',
    color: Colors.textPrimary, marginBottom: Spacing.lg,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, height: 48,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  eyeBtn: { padding: 4 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: Spacing.lg, marginTop: 4 },
  forgotText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  loginBtn: { borderRadius: Radius.md, overflow: 'hidden', marginBottom: Spacing.lg },
  loginBtnGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700', letterSpacing: 1 },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: Colors.textMuted, fontSize: FontSize.sm },
  registerLink: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },
});
