import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfile } from '../services/UserProfileContext';

const GENDER_OPTIONS = [
  { id: 'masculino', label: 'Masculino' },
  { id: 'feminino', label: 'Feminino' },
  { id: 'outro', label: 'Outro' },
  { id: 'nao_informar', label: 'Prefiro não dizer' },
];

const RegisterScreen = ({ navigation }) => {
  const { saveProfile } = useUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('masculino');
  const [isRockProfessional, setIsRockProfessional] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const parsedAge = parseInt(age, 10);

    if (!trimmedName) {
      Alert.alert('Atenção', 'Por favor, informe o seu nome.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      Alert.alert('Atenção', 'Por favor, informe um e-mail válido.');
      return;
    }

    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      Alert.alert('Atenção', 'Por favor, informe uma idade válida.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveProfile({
        name: trimmedName,
        email: trimmedEmail,
        age: parsedAge,
        gender,
        isRockProfessional,
      });

      if (result.success) {
        navigation.replace('Tabs');
      } else {
        Alert.alert(
          'Aviso',
          'Não foi possível salvar o perfil online no momento, mas o cadastro foi salvo no dispositivo.',
          [{ text: 'OK', onPress: () => navigation.replace('Tabs') }]
        );
      }
    } catch (error) {
      console.error('Erro ao submeter cadastro:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Topo / Boas-vindas */}
          <View style={styles.headerContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="scan" size={36} color="#2E7D32" />
            </View>
            <Text style={styles.title}>Bem-vindo ao StoneScan</Text>
            <Text style={styles.subtitle}>
              Preencha seu cadastro rápido para começar a identificar e analisar rochas ornamentais.
            </Text>
          </View>

          {/* Card do Formulário */}
          <View style={styles.formCard}>
            {/* Campo Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Campo Idade */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idade</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 28"
                  placeholderTextColor="#999"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            {/* Campo Sexo (Chips) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexo / Gênero</Text>
              <View style={styles.chipsContainer}>
                {GENDER_OPTIONS.map((opt) => {
                  const isSelected = gender === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => setGender(opt.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Pergunta: É da área de rochas? */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Você atua na área de rochas ou geologia?</Text>
              <Text style={styles.helpText}>
                Ajuda a calibrar e validar as avaliações técnicas de rochas ornamentais.
              </Text>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    isRockProfessional && styles.radioOptionSelected,
                  ]}
                  onPress={() => setIsRockProfessional(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isRockProfessional ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={isRockProfessional ? '#2E7D32' : '#888'}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      isRockProfessional && styles.radioLabelSelected,
                    ]}
                  >
                    Sim, sou da área
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    !isRockProfessional && styles.radioOptionSelected,
                  ]}
                  onPress={() => setIsRockProfessional(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={!isRockProfessional ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={!isRockProfessional ? '#2E7D32' : '#888'}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      !isRockProfessional && styles.radioLabelSelected,
                    ]}
                  >
                    Não / Entusiasta
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão de Envio */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Entrar no Aplicativo</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    lineHeight: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  chipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  radioOptionSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#F1F8E9',
  },
  radioLabel: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
    fontWeight: '500',
    flexShrink: 1,
  },
  radioLabelSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
