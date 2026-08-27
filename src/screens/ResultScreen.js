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
import { useUserRatings } from '../services/UserRatingsContext';

// Mock rock data
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
  console.log('ResultScreen params:', route.params);
  
  const { image, rockName, confidence, fromScan, fromCatalog, fromHistory } = route.params;
  const { saveRating, getRating } = useUserRatings();
  const [userRating, setUserRating] = useState(0);
  const rockData = rockDetails[rockName] || {
    description: 'Informações detalhadas não disponíveis para esta rocha.',
    characteristics: [],
    applications: [],
    maintenance: 'Informações de manutenção não disponíveis.'
  };

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
  
  // Carregar a avaliação salva quando a tela é montada
  useEffect(() => {
    const savedRating = getRating(rockName);
    setUserRating(savedRating);
  }, [rockName]);

  // Função para lidar com a mudança de avaliação
  const handleRatingChange = async (rating) => {
    setUserRating(rating);
    const success = await saveRating(rockName, rating);
    if (!success) {
      console.error('Erro ao salvar a avaliação');
      // Você pode adicionar um feedback visual para o usuário aqui
    }
  };

  // Determinar a fonte da imagem
  const getImageSource = () => {
    console.log('Tipo da imagem recebida:', typeof image);
    console.log('Imagem recebida:', image);

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
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      return require('../assets/images/granito-preto-sao-gabriel.jpg');
    }
  };
  
  // Acessar o contexto de histórico
  const { addScanToHistory } = useScanHistory();
  const [saved, setSaved] = useState(false);
  
  const handleSaveToHistory = async () => {
    if (!saved) {
      console.log('Salvando no histórico. Image:', image);
      
      const imageData = typeof image === 'string' ? { uri: image } : image;
      
      console.log('Formato da imagem a ser salva:', imageData);
      
      const success = await addScanToHistory({
        name: rockName,
        image: imageData,
        confidence: confidence
      });
      
      if (success) {
        console.log('Salvo com sucesso no histórico');
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
      console.log(error.message);
    }
  };

  // Função para renderizar estrelas interativas
  const renderInteractiveStars = () => {
    return (
      <View style={styles.userRatingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingChange(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= userRating ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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
            {!fromCatalog && !fromHistory && (
              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.successText}>Identificado com sucesso</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.rockName}>{rockName}</Text>
          
          {confInfo && (
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

          <Text style={styles.rockDescription}>{rockData.description}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sua Avaliação</Text>
            {renderInteractiveStars()}
            <Text style={styles.ratingHint}>
              {userRating > 0 
                ? `Você avaliou esta rocha com ${userRating} estrela${userRating > 1 ? 's' : ''}`
                : 'Toque nas estrelas para avaliar esta rocha'}
            </Text>
          </View>
          
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
  userRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  starButton: {
    padding: 8,
  },
  ratingHint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
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
