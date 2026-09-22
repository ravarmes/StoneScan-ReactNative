import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserProfileToFirestore } from './firebase';

export const USER_PROFILE_KEY = '@stoneScan:user_profile';
export const USER_PROFILE_PENDING_KEY = '@stoneScan:user_profile_pending';

const UserProfileContext = createContext({
  userProfile: null,
  isLoadingProfile: true,
  saveProfile: async () => {},
  clearProfile: async () => {},
});

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Carrega o perfil do AsyncStorage na inicialização do app
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserProfile(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do AsyncStorage:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  /**
   * Salva o perfil localmente e envia ao Firebase Firestore.
   */
  const saveProfile = async (formData) => {
    const profile = {
      id: userProfile?.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      age: Number(formData.age),
      gender: formData.gender,
      isRockProfessional: Boolean(formData.isRockProfessional),
      createdAt: userProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Salva localmente de forma imediata
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      setUserProfile(profile);

      // 2. Tenta enviar para o Firestore
      const sent = await saveUserProfileToFirestore(profile);
      if (!sent) {
        // Se estiver offline ou falhar, salva na fila de pendências
        await AsyncStorage.setItem(USER_PROFILE_PENDING_KEY, JSON.stringify(profile));
      } else {
        await AsyncStorage.removeItem(USER_PROFILE_PENDING_KEY);
      }

      return { success: true, profile };
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      return { success: false, error };
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      await AsyncStorage.removeItem(USER_PROFILE_PENDING_KEY);
      setUserProfile(null);
    } catch (error) {
      console.error('Erro ao limpar perfil:', error);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isLoadingProfile,
        saveProfile,
        clearProfile,
        hasProfile: Boolean(userProfile),
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileContext;
