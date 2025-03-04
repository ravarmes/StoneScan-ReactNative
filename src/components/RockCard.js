import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RockCard = ({ name, image, category, rating, onPress, isRecommendation = false }) => {
  // Função para formatar o nome removendo o tipo da rocha
  const formatRockName = (fullName) => {
    const types = ['Granito', 'Mármore', 'Quartzito'];
    let formattedName = fullName;
    types.forEach(type => {
      formattedName = formattedName.replace(`${type} `, '');
    });
    return formattedName;
  };

  // Renderizar as estrelas
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={`full_${i}`} name="star" size={14} color="#FFD700" />
        ))}
        {hasHalfStar && (
          <Ionicons name="star-half" size={14} color="#FFD700" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={`empty_${i}`} name="star-outline" size={14} color="#FFD700" />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      {!isRecommendation && (
        <View style={styles.ratingBadge}>
          {renderStars()}
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {formatRockName(name)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(46, 125, 50, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 40,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RockCard;
