import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCAN_HISTORY_KEY = '@stoneScan:history';

const ScanHistoryContext = createContext();

export const useScanHistory = () => {
  return useContext(ScanHistoryContext);
};

export const ScanHistoryProvider = ({ children }) => {
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            setScanHistory(parsedHistory);
          } else {
            setScanHistory([]);
          }
        } catch (error) {
          console.error('Erro ao processar histórico:', error);
          setScanHistory([]);
          await AsyncStorage.removeItem(SCAN_HISTORY_KEY);
        }
      } else {
        setScanHistory([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setScanHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addScanToHistory = async (scan) => {
    try {
      const newScan = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split('T')[0],
        ...scan
      };
      
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      let currentHistory = [];
      
      if (storedHistory) {
        try {
          const parsed = JSON.parse(storedHistory);
          if (Array.isArray(parsed)) {
            currentHistory = parsed;
          }
        } catch (error) {
          console.error('Erro ao ler histórico:', error);
        }
      }
      
      const updatedHistory = [newScan, ...currentHistory];
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updatedHistory));
      setScanHistory(updatedHistory);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar item ao histórico:', error);
      return false;
    }
  };

  const removeScanFromHistory = async (scanId) => {
    if (!scanId) return false;
    
    try {
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      let currentHistory = [];
      
      if (storedHistory) {
        try {
          const parsed = JSON.parse(storedHistory);
          if (Array.isArray(parsed)) {
            currentHistory = parsed;
          }
        } catch (error) {
          console.error('Erro ao ler histórico para remoção:', error);
        }
      }
      
      const updatedHistory = currentHistory.filter(item => item.id !== scanId);
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updatedHistory));
      setScanHistory(updatedHistory);
      return true;
    } catch (error) {
      console.error('Erro ao remover item do histórico:', error);
      return false;
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(SCAN_HISTORY_KEY);
      setScanHistory([]);
      return true;
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      return false;
    }
  };

  const value = {
    scanHistory,
    isLoading,
    addScanToHistory,
    removeScanFromHistory,
    clearHistory,
    reloadHistory: loadScanHistory
  };

  return (
    <ScanHistoryContext.Provider value={value}>
      {children}
    </ScanHistoryContext.Provider>
  );
};

export default ScanHistoryContext; 