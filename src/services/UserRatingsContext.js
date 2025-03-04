import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserRatingsContext = createContext();

export const useUserRatings = () => {
  return useContext(UserRatingsContext);
};

export const UserRatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});

  // Carregar avaliações salvas quando o app iniciar
  useEffect(() => {
    loadRatings();
  }, []);

  // Carregar avaliações do AsyncStorage
  const loadRatings = async () => {
    try {
      const savedRatings = await AsyncStorage.getItem('userRatings');
      if (savedRatings) {
        setRatings(JSON.parse(savedRatings));
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  // Salvar uma nova avaliação
  const saveRating = async (rockName, rating) => {
    try {
      const newRatings = { ...ratings, [rockName]: rating };
      await AsyncStorage.setItem('userRatings', JSON.stringify(newRatings));
      setRatings(newRatings);
      return true;
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      return false;
    }
  };

  // Obter a avaliação de uma rocha específica
  const getRating = (rockName) => {
    return ratings[rockName] || 0;
  };

  return (
    <UserRatingsContext.Provider value={{ ratings, saveRating, getRating }}>
      {children}
    </UserRatingsContext.Provider>
  );
}; 