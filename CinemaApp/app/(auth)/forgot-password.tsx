import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../src/store/authStore';
import { Colors, Spacing, FontSize, Radius } from '../../src/utils/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSend = async () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Informe seu e-mail' });
      return;
    }
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível enviar o e-mail',
      });
    }
  };

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.inner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          {!sent ? (
            <View style={styles.card}>
              <View style={styles.iconArea}>
                <Ionicons name="key-outline" size={36} color={Colors.accent} />
              </View>
              <Text style={styles.title}>Recuperar Senha</Text>
              <Text style={styles.desc}>
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </Text>

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
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.btn, isLoading && { opacity: 0.7 }]}
                onPress={handleSend}
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
                    <Text style={styles.btnText}>Enviar Link</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={[styles.iconArea, { backgroundColor: Colors.success + '20', borderColor: Colors.success + '40' }]}>
                <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
              </View>
              <Text style={styles.title}>E-mail Enviado!</Text>
              <Text style={styles.desc}>
                Verifique sua caixa de entrada e siga as instruções para redefinir a senha.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(auth)/login')}>
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.btnGrad}
                >
                  <Text style={styles.btnText}>Voltar ao Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: Spacing.lg, paddingTop: 60, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 60, left: Spacing.lg },
  card: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center',
  },
  iconArea: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.accent + '40',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  desc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.lg },
  inputGroup: { marginBottom: Spacing.lg, width: '100%' },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, color: Colors.textPrimary, fontSize: FontSize.md },
  btn: { borderRadius: Radius.md, overflow: 'hidden', width: '100%' },
  btnGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700', letterSpacing: 1 },
});
