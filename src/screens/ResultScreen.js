import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useScanHistory } from '../services/ScanHistoryContext';
import { sendFeedback } from '../services/firebase';

const rockDetails = {
  'Granito Amarelo Capri': {
    description: 'Granito de cor amarela com padrão uniforme, ideal para ambientes internos.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amarelo' },
      { name: 'Densidade Aparente', value: '2606 kg/m³' },
      { name: 'Absorção d\'água', value: '0,51%' },
      { name: 'Porosidade Aparente', value: '1,34%' },
      { name: 'Flexão', value: '8,78 MPa' },
    ],
    applications: [
      'Revestimentos interiores de paredes',
      'Divisórias',
      'Pisos de baixo tráfego',
      'Escadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Granito Amarelo Florença': {
    description: 'Granito amarelo com padrão delicado, perfeito para ambientes sofisticados.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amarelo' },
      { name: 'Densidade Aparente', value: '2644 kg/m³' },
      { name: 'Absorção d\'água', value: '0,38%' },
      { name: 'Porosidade Aparente', value: '1,00%' },
      { name: 'Flexão', value: '7,42 MPa' },
    ],
    applications: [
      'Revestimentos interiores de paredes',
      'Divisórias',
      'Pisos de baixo tráfego',
      'Escadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Granito Amarelo Ouro Brasil': {
    description: 'Granito dourado com padrão exuberante, adequado para ambientes internos e externos.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amarelo dourado' },
      { name: 'Densidade Aparente', value: '2670 kg/m³' },
      { name: 'Absorção d\'água', value: '0,32%' },
      { name: 'Porosidade Aparente', value: '0,85%' },
      { name: 'Flexão', value: '9,23 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas aeradas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Granito Amêndoa Jaciguá': {
    description: 'Granito de tonalidade amêndoa, versátil para diversos ambientes internos.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Amêndoa' },
      { name: 'Densidade Aparente', value: '2632 kg/m³' },
      { name: 'Absorção d\'água', value: '0,41%' },
      { name: 'Porosidade Aparente', value: '1,08%' },
      { name: 'Flexão', value: '8,76 MPa' },
    ],
    applications: [
      'Revestimentos interiores de paredes',
      'Divisórias',
      'Pisos de baixo tráfego',
      'Escadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Granito Bege Butterfly': {
    description: 'Granito bege com padrão delicado, adequado para ambientes internos e externos.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Bege' },
      { name: 'Densidade Aparente', value: '2632 kg/m³' },
      { name: 'Absorção d\'água', value: '0,35%' },
      { name: 'Porosidade Aparente', value: '0,92%' },
      { name: 'Flexão', value: '11,43 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas aeradas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Granito Gold 500': {
    description: 'Granito dourado com padrão único, versátil para ambientes internos e externos.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Dourado' },
      { name: 'Densidade Aparente', value: '2641 kg/m³' },
      { name: 'Absorção d\'água', value: '0,36%' },
      { name: 'Porosidade Aparente', value: '0,94%' },
      { name: 'Flexão', value: '8,92 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Granito Preto São Gabriel': {
    description: 'Granito preto com alta resistência, ideal para diversos ambientes.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Preto' },
      { name: 'Densidade Aparente', value: '2660 kg/m³' },
      { name: 'Absorção d\'água', value: '0,33%' },
      { name: 'Porosidade Aparente', value: '0,96%' },
      { name: 'Flexão', value: '14,10 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas',
      'Pisos de baixo tráfego',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos ou abrasivos. Recomenda-se aplicar impermeabilizante a cada 12 meses.'
  },
  'Mármore Branco Clássico': {
    description: 'Mármore branco clássico, perfeito para ambientes internos elegantes.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2850 kg/m³' },
      { name: 'Absorção d\'água', value: '0,09%' },
      { name: 'Porosidade Aparente', value: '0,26%' },
      { name: 'Flexão', value: '17,59 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  'Mármore Cachoeiro White': {
    description: 'Mármore branco de Cachoeiro, elegante e versátil para ambientes internos.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2901 kg/m³' },
      { name: 'Absorção d\'água', value: '0,01%' },
      { name: 'Porosidade Aparente', value: '0,04%' },
      { name: 'Flexão', value: '18,11 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  'Mármore Chocolate': {
    description: 'Mármore de tonalidade chocolate, sofisticado para ambientes internos.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Marrom chocolate' },
      { name: 'Densidade Aparente', value: '2733 kg/m³' },
      { name: 'Absorção d\'água', value: '0,01%' },
      { name: 'Porosidade Aparente', value: '0,02%' },
      { name: 'Flexão', value: '17,54 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  'Mármore Imperial Pink': {
    description: 'Mármore rosa imperial, exclusivo para ambientes internos sofisticados.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Rosa' },
      { name: 'Densidade Aparente', value: '2732 kg/m³' },
      { name: 'Absorção d\'água', value: '0,06%' },
      { name: 'Porosidade Aparente', value: '0,17%' },
      { name: 'Flexão', value: '18,43 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  },
  'Mármore Pinta Verde': {
    description: 'Mármore com detalhes em verde, elegante para ambientes internos.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco com detalhes verdes' },
      { name: 'Densidade Aparente', value: '2855 kg/m³' },
      { name: 'Absorção d\'água', value: '0,06%' },
      { name: 'Porosidade Aparente', value: '0,17%' },
      { name: 'Flexão', value: '13,04 MPa' },
    ],
    applications: [
      'Pisos de muito baixo tráfego',
      'Paredes internas',
      'Divisórias',
      'Lavabos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe com água e sabão neutro. Evite produtos ácidos e materiais abrasivos. Não recomendado para áreas externas ou box de banheiro.'
  }
};

const ResultScreen = ({ route, navigation }) => {
  const { image, rockName, confidence, source, feedbackChoice: initialFeedback, fromScan, fromCatalog, fromHistory, outOfDomain } = route.params;
  const [feedbackChoice, setFeedbackChoice] = useState(initialFeedback || null);
  const [saved, setSaved] = useState(false);
  const prevParamsKey = React.useRef(null);

  const rockData = rockDetails[rockName] || {
    description: 'Informações detalhadas não disponíveis para esta rocha.',
    characteristics: [],
    applications: [],
    maintenance: 'Informações de manutenção não disponíveis.'
  };

  useEffect(() => {
    const key = `${image}-${rockName}`;
    if (prevParamsKey.current !== key) {
      prevParamsKey.current = key;
      setFeedbackChoice(initialFeedback || null);
      setSaved(false);
    }
  }, [image, rockName, initialFeedback]);

  const getConfidenceInfo = (conf) => {
    if (conf === undefined || conf === null) return null;
    if (conf >= 80) {
      return {
        color: '#2E7D32',
        bgColor: '#E8F5E9',
        label: 'Alta Confiança',
        icon: 'checkmark-circle'
      };
    } else if (conf >= 60) {
      return {
        color: '#F57C00',
        bgColor: '#FFF3E0',
        label: 'Confiança Moderada',
        icon: 'alert-circle'
      };
    } else {
      return {
        color: '#D32F2F',
        bgColor: '#FFEBEE',
        label: 'Baixa Confiança',
        icon: 'warning',
        warningText: 'A iluminação ou o ângulo podem ter interferido na identificação. Recomendamos escanear novamente com boa iluminação.'
      };
    }
  };

  const confInfo = getConfidenceInfo(confidence);

  const handleFeedbackChoice = async (choice) => {
    if (feedbackChoice || fromHistory) return;
    setFeedbackChoice(choice);
    await sendFeedback({
      rockName,
      feedback: choice,
      confidence,
      source: source || 'camera'
    });
  };

  // Determinar a fonte da imagem
  const getImageSource = () => {
    try {
      if (fromCatalog) {
        return image; // Imagem do catálogo já está no formato correto
      }
      
      if (typeof image === 'string') {
        return { uri: image };
      }
      
      if (typeof image === 'object' && image !== null) {
        if (image.uri) {
          return { uri: image.uri };
        }
      }
      
      // Caso nenhuma das condições acima seja atendida, usar imagem padrão
      return require('../assets/images/granito-preto-sao-gabriel.jpg');
    } catch {
      return require('../assets/images/granito-preto-sao-gabriel.jpg');
    }
  };
  
  // Acessar o contexto de histórico
  const { addScanToHistory } = useScanHistory();
  
  const handleSaveToHistory = async () => {
    if (!saved) {
      const imageData = typeof image === 'string' ? { uri: image } : image;
      
      const success = await addScanToHistory({
        name: rockName,
        image: imageData,
        confidence: confidence,
        feedbackChoice: feedbackChoice,
        source: source || 'camera'
      });
      
      if (success) {
        setSaved(true);
        navigation.navigate('Tabs', { screen: 'Home' });
      } else {
        console.error('Erro ao salvar no histórico');
      }
    }
  };

  // Função para lidar com o botão de voltar com base na origem da navegação
  const handleBackPress = () => {
    if (fromCatalog || fromHistory) {
      // Se veio do catálogo ou do histórico, voltar para a Home
      navigation.navigate('Tabs', { screen: 'Home' });
    } else {
      // Caso contrário, voltar para a tela anterior
      navigation.goBack();
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Identifiquei esta rocha usando o StoneScan App! É um ${rockName}. ${rockData.description}`,
        url: image,
        title: 'Rocha identificada com StoneScan',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={fromCatalog ? "Detalhes da Rocha" : "Resultado"} 
        showBackButton 
        onBackPress={handleBackPress} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.resultContainer}>
          <View style={styles.imageContainer}>
            <Image 
              source={getImageSource()} 
              style={styles.rockImage} 
              resizeMode="cover"
            />
            {!fromCatalog && !fromHistory && !outOfDomain && (
              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.successText}>Identificado com sucesso</Text>
              </View>
            )}
            {outOfDomain && (
              <View style={[styles.successBadge, { backgroundColor: 'rgba(211, 47, 47, 0.85)' }]}>
                <Ionicons name="alert-circle" size={24} color="#fff" />
                <Text style={styles.successText}>Não é uma rocha conhecida</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.rockName}>{rockName}</Text>
          
          {outOfDomain && (
            <View style={[styles.section, { backgroundColor: '#FFEBEE', borderColor: '#D32F2F', borderWidth: 1 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons name="warning-outline" size={28} color="#D32F2F" />
                <Text style={[styles.sectionTitle, { color: '#D32F2F', marginBottom: 0, marginLeft: 8 }]}>
                  Imagem fora do domínio
                </Text>
              </View>
              <Text style={{ fontSize: 15, color: '#555', lineHeight: 22 }}>
                A imagem enviada não foi reconhecida como uma rocha ornamental presente em nosso banco de dados.
              </Text>
              <Text style={{ fontSize: 15, color: '#555', lineHeight: 22, marginTop: 8 }}>
                Certifique-se de fotografar a superfície de uma rocha ornamental com boa iluminação e tente novamente.
              </Text>
            </View>
          )}

          {!outOfDomain && confInfo && (
            <View style={[styles.confidenceCard, { backgroundColor: confInfo.bgColor, borderColor: confInfo.color }]}>
              <View style={styles.confidenceHeader}>
                <Ionicons name={confInfo.icon} size={22} color={confInfo.color} />
                <Text style={[styles.confidenceTitle, { color: confInfo.color }]}>
                  {confidence}% de confiança ({confInfo.label})
                </Text>
              </View>
              {confInfo.warningText && (
                <Text style={styles.confidenceWarningText}>
                  {confInfo.warningText}
                </Text>
              )}
            </View>
          )}

          {!outOfDomain && (
            <Text style={styles.rockDescription}>{rockData.description}</Text>
          )}
          
          {!fromCatalog && !outOfDomain && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>A identificação está correta?</Text>
              <View style={styles.feedbackButtonsRow}>
                <TouchableOpacity 
                  disabled={Boolean(fromHistory || feedbackChoice)}
                  style={[
                    styles.feedbackOptionButton, 
                    feedbackChoice === 'sim' && styles.feedbackButtonSimActive,
                    Boolean(fromHistory || feedbackChoice) && feedbackChoice !== 'sim' && styles.feedbackButtonDisabled
                  ]}
                  onPress={() => handleFeedbackChoice('sim')}
                >
                  <Ionicons 
                    name={feedbackChoice === 'sim' ? "thumbs-up" : "thumbs-up-outline"} 
                    size={20} 
                    color={feedbackChoice === 'sim' ? "#fff" : "#2E7D32"} 
                  />
                  <Text style={[
                    styles.feedbackButtonText, 
                    feedbackChoice === 'sim' && styles.feedbackButtonTextActive
                  ]}>Sim</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  disabled={Boolean(fromHistory || feedbackChoice)}
                  style={[
                    styles.feedbackOptionButton, 
                    feedbackChoice === 'nao' && styles.feedbackButtonNaoActive,
                    Boolean(fromHistory || feedbackChoice) && feedbackChoice !== 'nao' && styles.feedbackButtonDisabled
                  ]}
                  onPress={() => handleFeedbackChoice('nao')}
                >
                  <Ionicons 
                    name={feedbackChoice === 'nao' ? "thumbs-down" : "thumbs-down-outline"} 
                    size={20} 
                    color={feedbackChoice === 'nao' ? "#fff" : "#D32F2F"} 
                  />
                  <Text style={[
                    styles.feedbackButtonText, 
                    feedbackChoice === 'nao' && styles.feedbackButtonTextActive
                  ]}>Não</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  disabled={Boolean(fromHistory || feedbackChoice)}
                  style={[
                    styles.feedbackOptionButton, 
                    feedbackChoice === 'nao_sei' && styles.feedbackButtonNaoSeiActive,
                    Boolean(fromHistory || feedbackChoice) && feedbackChoice !== 'nao_sei' && styles.feedbackButtonDisabled
                  ]}
                  onPress={() => handleFeedbackChoice('nao_sei')}
                >
                  <Ionicons 
                    name={feedbackChoice === 'nao_sei' ? "help-circle" : "help-circle-outline"} 
                    size={20} 
                    color={feedbackChoice === 'nao_sei' ? "#fff" : "#666"} 
                  />
                  <Text style={[
                    styles.feedbackButtonText, 
                    feedbackChoice === 'nao_sei' && styles.feedbackButtonTextActive
                  ]}>Não conheço</Text>
                </TouchableOpacity>
              </View>
              {(fromHistory || feedbackChoice) && (
                <Text style={styles.feedbackThanksText}>
                  {fromHistory 
                    ? (feedbackChoice ? 'Avaliação registrada anteriormente' : 'Sem avaliação registrada')
                    : 'Obrigado pelo seu feedback!'}
                </Text>
              )}
            </View>
          )}
          
          {!outOfDomain && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Características</Text>
                {rockData.characteristics.map((item, index) => (
                  <View key={index} style={styles.characteristicItem}>
                    <Text style={styles.characteristicName}>{item.name}</Text>
                    <Text style={styles.characteristicValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Aplicações Recomendadas</Text>
                {rockData.applications.map((item, index) => (
                  <View key={index} style={styles.applicationItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                    <Text style={styles.applicationText}>{item}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Manutenção</Text>
                <Text style={styles.maintenanceText}>{rockData.maintenance}</Text>
              </View>
              
              <View style={styles.actionsContainer}>
                {!fromCatalog && !fromHistory && (
                  <TouchableOpacity 
                    style={[
                      styles.actionButton,
                      styles.primaryButton,
                      saved && styles.savedButton,
                      { marginRight: 8 }
                    ]}
                    onPress={handleSaveToHistory}
                    disabled={saved}
                  >
                    <Ionicons 
                      name={saved ? "checkmark-circle" : "bookmark-outline"} 
                      size={24} 
                      color="white" 
                    />
                    <Text style={styles.primaryButtonText}>
                      {saved ? "Salvo no histórico" : "Salvar no histórico"}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    fromCatalog ? styles.primaryButton : styles.secondaryButton,
                    { flex: fromCatalog ? 1 : undefined }
                  ]}
                  onPress={handleShare}
                >
                  <Ionicons 
                    name="share-social-outline" 
                    size={20} 
                    color={fromCatalog ? "white" : "#2E7D32"} 
                  />
                  <Text style={fromCatalog ? styles.primaryButtonText : styles.secondaryButtonText}>
                    Compartilhar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {outOfDomain && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton, { flex: 1 }]}
                onPress={() => navigation.navigate('Tabs', { screen: 'Scan' })}
              >
                <Ionicons name="camera-outline" size={24} color="white" />
                <Text style={styles.primaryButtonText}>Escanear novamente</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  resultContainer: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rockImage: {
    width: '100%',
    height: 250,
  },
  successBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  successText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  rockName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  rockDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  characteristicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  characteristicName: {
    fontSize: 16,
    color: '#666',
  },
  characteristicValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  applicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  applicationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  maintenanceText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 8,
  },
  savedButton: {
    backgroundColor: '#4CAF50',
  },
  feedbackButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  feedbackOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  feedbackButtonDisabled: {
    opacity: 0.4,
  },
  feedbackButtonSimActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  feedbackButtonNaoActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  feedbackButtonNaoSeiActive: {
    backgroundColor: '#555',
    borderColor: '#555',
  },
  feedbackButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  feedbackButtonTextActive: {
    color: '#fff',
  },
  feedbackThanksText: {
    textAlign: 'center',
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  confidenceCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  confidenceWarningText: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
    lineHeight: 18,
  },
});

export default ResultScreen;
