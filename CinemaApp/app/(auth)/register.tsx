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

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos' });
      return;
    }
    if (senha !== confirmar) {
      Toast.show({ type: 'error', text1: 'As senhas não coincidem' });
      return;
    }
    if (senha.length < 6) {
      Toast.show({ type: 'error', text1: 'Senha deve ter no mínimo 6 caracteres' });
      return;
    }
    try {
      await register(nome.trim(), email.trim(), senha);
      router.replace('/(tabs)/filmes');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar conta';
      Toast.show({ type: 'error', text1: 'Erro', text2: msg });
    }
  };

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoIcon}>
              <Ionicons name="film" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Junte-se a nós e aproveite o cinema</Text>
          </View>

          <View style={styles.card}>
            {[
              { label: 'Nome Completo', value: nome, setter: setNome, icon: 'person-outline', placeholder: 'Seu nome', type: 'default' },
              { label: 'E-mail', value: email, setter: setEmail, icon: 'mail-outline', placeholder: 'seu@email.com', type: 'email-address' },
            ].map(({ label, value, setter, icon, placeholder, type }) => (
              <View key={label} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name={icon as any} size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    value={value}
                    onChangeText={setter}
                    keyboardType={type as any}
                    autoCapitalize={type === 'email-address' ? 'none' : 'words'}
                    autoCorrect={false}
                  />
                </View>
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.textMuted}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showSenha}
                />
                <TouchableOpacity onPress={() => setShowSenha(!showSenha)} style={styles.eyeBtn}>
                  <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={[styles.inputWrapper, confirmar && senha !== confirmar && { borderColor: Colors.error }]}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  placeholderTextColor={Colors.textMuted}
                  value={confirmar}
                  onChangeText={setConfirmar}
                  secureTextEntry={!showSenha}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, isLoading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Criar Conta</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já tem conta? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Entrar</Text>
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
  scroll: { flexGrow: 1, padding: Spacing.lg, paddingTop: 60 },
  backBtn: { marginBottom: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoIcon: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary + '40',
    marginBottom: Spacing.md,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  card: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, color: Colors.textPrimary, fontSize: FontSize.md },
  eyeBtn: { padding: 4 },
  btn: { borderRadius: Radius.md, overflow: 'hidden', marginTop: Spacing.sm, marginBottom: Spacing.lg },
  btnGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700', letterSpacing: 1 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: Colors.textMuted, fontSize: FontSize.sm },
  loginLink: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },
});
