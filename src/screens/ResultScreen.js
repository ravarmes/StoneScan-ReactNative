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
  'Granito Branco Itaúnas': {
    description: 'Rocha ornamental de cor clara, com tons branco-bege e grãos finos. Muito usado em ambientes internos por sua aparência elegante e uniforme.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2614 kg/m³' },
      { name: 'Absorção d\'água', value: '0,37%' },
      { name: 'Porosidade Aparente', value: '0,96%' },
      { name: 'Flexão', value: '9,38 MPa' },
    ],
    applications: [
      'Paredes e divisórias',
      'Pisos e escadas',
      'Pavimentos de baixo tráfego',
      'Revestimentos exteriores secos',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'A limpeza deve ser feita com pano úmido e detergente neutro, evitando excesso de água e produtos agressivos. Substâncias manchantes devem ser removidas imediatamente.'
  },
  'Granito Branco Kashmir': {
    description: 'Rocha clara com veios acinzentados e avermelhados, valorizada por sua elegância e durabilidade.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2700 a 2800 kg/m³' },
      { name: 'Absorção d\'água', value: '0,09% a 0,41%' },
      { name: 'Porosidade Aparente', value: '1,2%' },
      { name: 'Flexão', value: '9 a 11,25 MPa' },
    ],
    applications: [
      'Bancadas de cozinha e banheiro',
      'Revestimentos internos de pisos e paredes',
      'Escadas e soleiras',
      'Fachadas externas (com impermeabilização)',
      'Tampos de móveis e mesas',
    ],
    maintenance: 'Limpeza com pano úmido e detergente neutro, evitando produtos ácidos ou abrasivos. Recomenda-se reaplicar o selante periodicamente para preservar a proteção contra manchas.'
  },
  'Granito Cinza Castelo': {
    description: 'Pedra de tonalidade cinza médio com grãos uniformes, valorizada por sua resistência e aparência sóbria. Ideal para revestimentos internos e externos.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Cinza' },
      { name: 'Densidade Aparente', value: '2657 kg/m³' },
      { name: 'Absorção d\'água', value: '0,31%' },
      { name: 'Porosidade Aparente', value: '0,83%' },
      { name: 'Flexão', value: '17,37 MPa' },
    ],
    applications: [
      'Revestimentos internos: paredes, divisórias',
      'Pisos, escadas e pavimentos de baixo tráfego',
      'Revestimentos externos com testes prévios',
      'Fachadas com ensaios de durabilidadecadas',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'Limpe sistematicamente com pano úmido e detergente neutro, evitando excesso de água e produtos abrasivos ou químicos agressivos. Remova rapidamente substâncias manchantes e evite contato com materiais ferruginosos.'
  },
  'Granito Preto Absoluto': {
    description: 'Pedra natural de cor preta uniforme, reconhecida pela alta durabilidade e elegância. Ideal para ambientes internos e externos sofisticados.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Preto' },
      { name: 'Densidade Aparente', value: '2960 a 3078 kg/m³' },
      { name: 'Absorção d\'água', value: '0,02% a 0,10%' },
      { name: 'Porosidade Aparente', value: '0,2% a 4%' },
      { name: 'Flexão', value: '12 a 33,5 MPa' },
    ],
    applications: [
      'Revestimentos interiores',
      'Revestimentos exteriores',
      'Fachadas ventiladas',
      'Pisos residenciais leves',
      'Bancadas (com impermeabilização)',
    ],
    maintenance: 'impar com pano úmido e detergente neutro, evitando produtos abrasivos ou ácidos. Reaplicar selante regularmente para proteger contra manchas e desgaste.'
  },
'Granito Preto Via Láctea': {
  description: 'Granito brasileiro de fundo preto profundo com veios brancos e cinzas, lembrando o céu estrelado. Combina estética sofisticada e alta durabilidade.',
  characteristics: [
    { name: 'Tipo', value: 'Granito' },
    { name: 'Cor predominante', value: 'Preto com veios brancos e cinzas' },
    { name: 'Densidade Aparente', value: '2579 a 2960 kg/m³' },
    { name: 'Absorção d\'água', value: '0,22%' },
    { name: 'Porosidade Aparente', value: '0,3% a 1%' },
    { name: 'Flexão', value: '10 a 33,5 MPa' }
  ],
  applications: [
    'Bancadas de cozinha e banheiro',
    'Pisos e revestimentos internos',
    'Escadas e soleiras',
    'Mesas e tampos de móveis',
    'Fachadas ventiladas'
  ],
  maintenance: 'Limpar com pano úmido e detergente neutro, evitando produtos abrasivos ou ácidos. Aplicar selante periodicamente para proteger contra manchas e preservar o brilho.'
},
  'Granito Preto São Gabriel': {
    description: 'Granito preto com alta resistência, ideal para diversos ambientes.',
    characteristics: [
      { name: 'Tipo', value: 'Granito' },
      { name: 'Cor predominante', value: 'Preto' },
      { name: 'Densidade Aparente', value: '2960 kg/m³' },
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
  // MÁRMORES 
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
  'Mármore Dolomítico Matarazzo': {
    description: 'Mármore dolomítico branco com veios acinzentados e dourados, de alta resistência e beleza clássica.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: '2852 kg/m³' },
      { name: 'Absorção d\'água', value: '0,18%' },
      { name: 'Porosidade Aparente', value: '0,50%' },
      { name: 'Flexão', value: '10 à 15 MPa' },
    ],
    applications: [
      'Bancadas de alto padrão',
      'Revestimento de paredes internas e fachadas',
      'Mesas e tampos ',
      'Lavabos',
      'Detalhes decorativos como painéis retroiluminados',
    ],
    maintenance: 'Limpe com sabão neutro e água; seque imediatamente para evitar manchas.'
  },
  'Mármore Cintilante Green': {
    description: 'Mármore verde com aspecto cintilante, ideal para áreas decorativas com impacto visual.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Verde' },
      { name: 'Densidade Aparente', value: '2792 kg/m³' },
      { name: 'Absorção d\'água', value: '0,08%' },
      { name: 'Porosidade Aparente', value: '0,21%' },
      { name: 'Flexão', value: '8,10 MPa' },
    ],
    applications: [
      'Revestimento de paredes',
      'Bancadas decorativas e aparadores',
      'Tampos de móveis ',
      'Pisos de ambientes refinados',
      'Aplicações artísticas como mosaicos e painéis',
    ],
    maintenance: 'Lave com sabão neutro diluído; evite esfregar com esponjas ásperas.'
  },
  'Mármore Arabescato Super White': {
    description: 'Mármore branco com veios cinza escuro, sofisticado e versátil para ambientes internos.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Branco' },
      { name: 'Densidade Aparente', value: 'X kg/m³' },
      { name: 'Absorção d\'água', value: 'X%' },
      { name: 'Porosidade Aparente', value: 'X%' },
      { name: 'Flexão', value: 'X MPa' },
    ],
    applications: [
      'Bancadas de cozinhas e banheiros',
      'Paredes internas',
      'Ilhas centrais decorativas',
      'Lareiras e painéis',
      'Pisos de áreas sociais',
    ],
    maintenance: 'Use pano macio com detergente neutro; evite ácidos e abrasivos.'
  },
  'Mármore Pegasus Blue': {
    description: 'Mármore azul acinzentado com veios claros, de aparência contemporânea e elegante.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'Azul' },
      { name: 'Densidade Aparente', value: 'X kg/m³' },
      { name: 'Absorção d\'água', value: 'X%' },
      { name: 'Porosidade Aparente', value: 'X%' },
      { name: 'Flexão', value: 'X MPa' },
    ],
    applications: [
      'Pisos de halls de entrada',
      'Painéis de destaque em salas e quartos',
      'Bancadas em lavabos',
      'Revestimentos em escadas',
      'Mesas de jantar ou centro',
    ],
    maintenance: 'Utilize pano úmido com detergente neutro; não utilize produtos químicos agressivos.'
  },
    'Mármore Shadow': {
    description: 'Lorem ipsum dolor sit amet.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'X' },
      { name: 'Densidade Aparente', value: 'X kg/m³' },
      { name: 'Absorção d\'água', value: 'X%' },
      { name: 'Porosidade Aparente', value: 'X%' },
      { name: 'Flexão', value: 'X MPa' },
    ],
    applications: [
      'Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet.',
    ],
    maintenance: 'Lorem ipsum dolor sit amet.'
  },
    'Mármore Ragnatela': {
    description: 'Fundo branco com veios finos em padrão que lembra teia, conferindo um visual delicado e refinado.',
    characteristics: [
      { name: 'Tipo', value: 'Mármore' },
      { name: 'Cor predominante', value: 'X' },
      { name: 'Densidade Aparente', value: 'X kg/m³' },
      { name: 'Absorção d\'água', value: 'X%' },
      { name: 'Porosidade Aparente', value: 'X%' },
      { name: 'Flexão', value: 'X MPa' },
    ],
    applications: [
      'Pisos de áreas internas e externas',
      'Revestimento de paredes e fachadas',
      'Bancadas de cozinhas e banheiros',
      'Escadas internas',
      'Detalhes arquitetônicos e decorativos',
    ],
    maintenance: 'Utilize pano macio com detergente neutro diluído em água. Evite produtos ácidos ou abrasivos para preservar o brilho e a integridade da superfície.'
  }
};

const ResultScreen = ({ route, navigation }) => {
  console.log('ResultScreen params:', route.params);
  
  const { image, rockName, fromScan, fromCatalog, fromHistory } = route.params;
  const { saveRating, getRating } = useUserRatings();
  const [userRating, setUserRating] = useState(0);
  const rockData = rockDetails[rockName] || {
    description: 'Informações detalhadas não disponíveis para esta rocha.',
    characteristics: [],
    applications: [],
    maintenance: 'Informações de manutenção não disponíveis.'
  };
  
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
      
      // Garantir formato consistente para a imagem
      const imageData = typeof image === 'string' ? { uri: image } : image;
      
      console.log('Formato da imagem a ser salva:', imageData);
      
      const success = await addScanToHistory({
        name: rockName,
        image: imageData
      });
      
      if (success) {
        console.log('Salvo com sucesso no histórico');
        setSaved(true);
        // Navegar para a tela Home e selecionar a aba de histórico
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
});

export default ResultScreen;
