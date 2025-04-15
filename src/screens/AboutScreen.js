import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

const AboutScreen = ({ navigation }) => {
  // Função para lidar com erros de carregamento da imagem
  const handleImageError = (error) => {
    console.error('Erro ao carregar imagem:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sobre" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo-fapes.png')}
              style={styles.logo}
              resizeMode="contain"
              onError={handleImageError}
            />
            <Image
              source={require('../../assets/logo-granimaster.png')}
              style={styles.logo}
              resizeMode="contain"
              onError={handleImageError}
            />
          </View>

          <Text style={styles.sectionTitle}>StoneScan</Text>
          <Text style={styles.paragraph}>
            O StoneScan é um aplicativo móvel inovador que utiliza inteligência artificial para identificar rochas ornamentais através de fotografias tiradas por smartphones. Desenvolvido para atender tanto profissionais do setor quanto consumidores finais, o aplicativo emprega redes neurais avançadas para reconhecer e classificar diferentes tipos de rochas, como granitos e mármores, a partir de imagens de superfícies como pias, pisos e paredes.
          </Text>

          <Text style={styles.paragraph}>
            O projeto é resultado de uma colaboração multidisciplinar entre estudantes de Sistemas de Informação e Técnico em Mineração, sob orientação docente. As informações sobre as rochas são baseadas em fontes autorizadas, incluindo o manual de rochas ornamentais do SindRochas e dados fornecidos por empresas parceiras do setor.
          </Text>

          {/* <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://fapes.es.gov.br/')}
          >
            <Ionicons name="globe-outline" size={20} color="#2E7D32" />
            <Text style={styles.linkText}>Visitar site oficial</Text>
          </TouchableOpacity> */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Este aplicativo foi desenvolvido com o apoio da FAPES.
            </Text>
            <Text style={styles.copyright}>© 2025 StoneScan</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 220,
    height: 120,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  valuesList: {
    marginLeft: 10,
    marginBottom: 20,
  },
  valueItem: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
});

export default AboutScreen; 