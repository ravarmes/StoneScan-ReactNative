import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import RockCard from '../components/RockCard';
import { useScanHistory } from '../services/ScanHistoryContext';

// Mock data for rocks
const rockData = [
  {
    id: '1',
    name: 'Granito Amarelo Capri',
    image: require('../assets/images/granito-amarelo-capri.jpg'),
    description: 'Granito de cor amarela com padrão uniforme.',
    category: 'Granito',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Granito Amarelo Florença',
    image: require('../assets/images/granito-amarelo-florenca.jpg'),
    description: 'Granito amarelo com padrão delicado.',
    category: 'Granito',
    rating: 4.3
  },
  {
    id: '3',
    name: 'Granito Amarelo Ouro Brasil',
    image: require('../assets/images/granito-amarelo-ouro-brasil.jpg'),
    description: 'Granito dourado com padrão exuberante.',
    category: 'Granito',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Granito Amêndoa Jaciguá',
    image: require('../assets/images/granito-amendoa-jacigua.jpg'),
    description: 'Granito de tonalidade amêndoa.',
    category: 'Granito',
    rating: 4.4
  },
  {
    id: '5',
    name: 'Granito Bege Butterfly',
    image: require('../assets/images/granito-bege-butterfly.jpg'),
    description: 'Granito bege com padrão delicado.',
    category: 'Granito',
    rating: 4.6
  },
  {
    id: '6',
    name: 'Granito Gold 500',
    image: require('../assets/images/granito-gold-500.jpg'),
    description: 'Granito dourado com padrão único.',
    category: 'Granito',
    rating: 4.5
  },
  {
    id: '7',
    name: 'Granito Preto São Gabriel',
    image: require('../assets/images/granito-preto-sao-gabriel.jpg'),
    description: 'Granito preto com alta resistência.',
    category: 'Granito',
    rating: 4.8
  },
  {
    id: '8',
    name: 'Mármore Branco Clássico',
    image: require('../assets/images/marmore-branco-classico.jpg'),
    description: 'Mármore branco clássico e elegante.',
    category: 'Mármore',
    rating: 4.9
  },
  {
    id: '9',
    name: 'Mármore Cachoeiro White',
    image: require('../assets/images/marmore-cachoeiro-white.jpg'),
    description: 'Mármore branco de Cachoeiro.',
    category: 'Mármore',
    rating: 4.7
  },
  {
    id: '10',
    name: 'Mármore Chocolate',
    image: require('../assets/images/marmore-chocolate.jpg'),
    description: 'Mármore de tonalidade chocolate.',
    category: 'Mármore',
    rating: 4.6
  },
  {
    id: '11',
    name: 'Mármore Imperial Pink',
    image: require('../assets/images/marmore-imperial-pink.jpg'),
    description: 'Mármore rosa imperial exclusivo.',
    category: 'Mármore',
    rating: 4.8
  },
  {
    id: '12',
    name: 'Mármore Pinta Verde',
    image: require('../assets/images/marmore-pinta-verde.jpg'),
    description: 'Mármore com detalhes em verde.',
    category: 'Mármore',
    rating: 4.5
  },
];

// Componente para exibir as estrelas
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);
  
  return (
    <View style={styles.ratingContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full_${i}`} name="star" size={16} color="#FFD700" />
      ))}
      {hasHalfStar && (
        <Ionicons name="star-half" size={16} color="#FFD700" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty_${i}`} name="star-outline" size={16} color="#FFD700" />
      ))}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('catalog');
  
  // Usar o contexto de histórico
  const { scanHistory, isLoading, removeScanFromHistory, clearHistory } = useScanHistory();

  // Ordenar rochas por classificação (do maior para o menor)
  const sortedRockData = [...rockData].sort((a, b) => b.rating - a.rating);

  // Função para navegar para a tela de escaneamento
  const navigateToScan = () => {
    navigation.navigate('Scan');
  };

  // Função para navegar para detalhes da rocha
  const handleRockPress = (rock) => {
    navigation.navigate('Result', {
      rockName: rock.name,
      image: rock.image,
      fromCatalog: true
    });
  };
  
  // Função para visualizar detalhes de um escaneamento salvo
  const handleHistoryItemPress = (item) => {
    navigation.navigate('Result', {
      rockName: item.name,
      image: item.image,
      fromHistory: true
    });
  };

  const renderRockItem = ({ item, isRecommendation = false }) => (
    <RockCard 
      name={item.name}
      image={item.image}
      description={item.description}
      category={item.category}
      rating={item.rating}
      onPress={() => handleRockPress(item)}
      isRecommendation={isRecommendation}
    />
  );

  const handleDeleteScan = async (itemId, itemName) => {
    if (!itemId) {
      console.error('ID inválido para exclusão:', itemId);
      return;
    }
    
    console.log('Tentando excluir item:', { id: itemId, name: itemName });
    
    // Executar a remoção diretamente
    const success = await removeScanFromHistory(itemId);
    console.log('Resultado da remoção:', success);
    
    if (success) {
      console.log('Item removido com sucesso:', itemId);
    } else {
      console.error('Falha ao remover item:', itemId);
    }
  };

  const handleClearHistory = async () => {
    if (!scanHistory || scanHistory.length === 0) {
      console.log('Histórico já está vazio');
      return;
    }

    console.log('Tentando limpar histórico. Items atuais:', scanHistory.length);
    
    // Executar a limpeza diretamente
    const success = await clearHistory();
    console.log('Resultado da limpeza:', success);
    
    if (success) {
      console.log('Histórico limpo com sucesso');
    } else {
      console.error('Falha ao limpar histórico');
    }
  };

  const renderHistoryItem = ({ item }) => {
    // Determinar a fonte da imagem
    let imageSource;
    try {
      if (item.image) {
        if (typeof item.image === 'object' && item.image.uri) {
          imageSource = { uri: item.image.uri };
        } else if (typeof item.image === 'string') {
          imageSource = { uri: item.image };
        } else {
          imageSource = item.image;
        }
      } else {
        // Imagem padrão
        imageSource = require('../assets/images/granito-preto-sao-gabriel.jpg');
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      imageSource = require('../assets/images/granito-preto-sao-gabriel.jpg');
    }

    return (
      <View style={styles.historyItem}>
        <TouchableOpacity 
          style={styles.historyContent}
          onPress={() => handleHistoryItemPress(item)}
        >
          <Image source={imageSource} style={styles.historyImage} />
          <View style={styles.historyInfo}>
            <Text style={styles.historyName}>{item.name}</Text>
            <Text style={styles.historyDate}>{item.date}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.6}
          onPress={() => handleDeleteScan(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={22} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    );
  };

  // Renderização condicional para o histórico
  const renderHistory = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.emptyStateText}>Carregando histórico...</Text>
        </View>
      );
    }
    
    if (!scanHistory || scanHistory.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="scan-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>Nenhum escaneamento encontrado</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={navigateToScan}
          >
            <Text style={styles.scanButtonText}>Escanear Agora</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <FlatList
        data={scanHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id || `temp-${Math.random()}`}
        contentContainerStyle={styles.historyList}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="StoneScan" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'catalog' && styles.activeTab]}
          onPress={() => setActiveTab('catalog')}
        >
          <Text style={[styles.tabText, activeTab === 'catalog' && styles.activeTabText]}>Catálogo</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'catalog' ? (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Rochas Populares</Text>
          <FlatList
            data={sortedRockData}
            renderItem={renderRockItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rockList}
          />
          
          <Text style={styles.sectionTitle}>Recomendados para você</Text>
          <FlatList
            data={sortedRockData.slice().reverse()}
            renderItem={(props) => renderRockItem({ ...props, isRecommendation: true })}
            keyExtractor={item => `rec-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rockList}
          />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Escaneamentos Recentes</Text>
            {scanHistory && scanHistory.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                activeOpacity={0.6}
                onPress={handleClearHistory}
              >
                <Ionicons name="trash-outline" size={18} color="#ff3b30" />
                <Text style={styles.clearButtonText}>Limpar tudo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {renderHistory()}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  rockList: {
    paddingBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#ffebee',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#ff3b30',
    marginLeft: 4,
    fontWeight: '500',
  },
  historyList: {
    paddingBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 12,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;
