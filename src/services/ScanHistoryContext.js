import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenamento no AsyncStorage
const SCAN_HISTORY_KEY = '@stoneScan:history';

// Criar o contexto
const ScanHistoryContext = createContext();

// Hook personalizado para facilitar o uso do contexto
export const useScanHistory = () => {
  return useContext(ScanHistoryContext);
};

// Componente provedor do contexto
export const ScanHistoryProvider = ({ children }) => {
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Adicionar um contador de atualização para forçar re-renderização
  const [updateCounter, setUpdateCounter] = useState(0);

  // Função para forçar atualização do estado
  const forceUpdate = () => {
    setUpdateCounter(prevCounter => prevCounter + 1);
  };

  // Carregar o histórico do AsyncStorage quando o componente montar ou quando updateCounter mudar
  useEffect(() => {
    loadScanHistory();
  }, [updateCounter]);

  // Função para carregar o histórico
  const loadScanHistory = async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          setScanHistory(parsedHistory);
          console.log('Histórico carregado:', parsedHistory.length, 'itens');
        } catch (error) {
          console.error('Erro ao processar histórico:', error);
          setScanHistory([]);
          await AsyncStorage.removeItem(SCAN_HISTORY_KEY);
        }
      } else {
        console.log('Nenhum histórico encontrado');
        setScanHistory([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setScanHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar um novo item ao histórico
  const addScanToHistory = async (scan) => {
    try {
      // Criar novo item com ID único baseado no timestamp
      const newScan = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        ...scan
      };
      
      // Carregar histórico atual para garantir dados atualizados
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      let currentHistory = [];
      
      if (storedHistory) {
        try {
          currentHistory = JSON.parse(storedHistory);
          if (!Array.isArray(currentHistory)) {
            currentHistory = [];
          }
        } catch (error) {
          console.error('Erro ao processar histórico existente:', error);
        }
      }
      
      // Adicionar o novo item ao início da lista
      const updatedHistory = [newScan, ...currentHistory];
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updatedHistory));
      
      // Atualizar o estado e forçar re-renderização
      setScanHistory(updatedHistory);
      forceUpdate();
      
      console.log('Item adicionado ao histórico com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar item ao histórico:', error);
      return false;
    }
  };

  // Função para remover um item específico do histórico
  const removeScanFromHistory = async (scanId) => {
    if (!scanId) {
      console.error('ID inválido para remoção');
      return false;
    }
    
    try {
      console.log('Iniciando remoção do item:', scanId);
      
      // Carregar histórico atual do AsyncStorage
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      let currentHistory = [];
      
      if (storedHistory) {
        try {
          currentHistory = JSON.parse(storedHistory);
          console.log('Histórico atual carregado:', currentHistory.length, 'itens');
          
          if (!Array.isArray(currentHistory)) {
            console.error('Histórico armazenado não é um array');
            return false;
          }
        } catch (error) {
          console.error('Erro ao processar histórico para remoção:', error);
          return false;
        }
      } else {
        console.log('Nenhum histórico encontrado para remoção');
        return false;
      }
      
      // Filtrar o histórico para remover o item
      const updatedHistory = currentHistory.filter(item => item.id !== scanId);
      console.log(`Removendo item ${scanId}. Antes: ${currentHistory.length}, Depois: ${updatedHistory.length}`);
      
      if (currentHistory.length === updatedHistory.length) {
        console.log('Item não encontrado no histórico');
        return false;
      }
      
      // Salvar histórico atualizado no AsyncStorage
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('Histórico atualizado salvo no AsyncStorage');
      
      // Atualizar o estado
      setScanHistory(updatedHistory);
      console.log('Estado do histórico atualizado');
      
      return true;
    } catch (error) {
      console.error('Erro ao remover item do histórico:', error);
      return false;
    }
  };

  // Função para limpar todo o histórico
  const clearHistory = async () => {
    try {
      console.log('Iniciando limpeza do histórico');
      
      // Verificar se há histórico para limpar
      const storedHistory = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      if (!storedHistory) {
        console.log('Nenhum histórico encontrado para limpar');
        return true;
      }
      
      // Remover do AsyncStorage
      await AsyncStorage.removeItem(SCAN_HISTORY_KEY);
      console.log('Histórico removido do AsyncStorage');
      
      // Limpar o estado
      setScanHistory([]);
      console.log('Estado do histórico limpo');
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      return false;
    }
  };

  // Valores e funções disponibilizados pelo contexto
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