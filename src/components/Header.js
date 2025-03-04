import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, showBackButton, onBackPress }) => {
  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={styles.logoContainer}>
          <Ionicons name="scan-outline" size={24} color="#2E7D32" />
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rightPlaceholder: {
    width: 40,
  },
});

export default Header;
