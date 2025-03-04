import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ScanButton from '../components/ScanButton';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraFlip = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleFlashToggle = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsScanning(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // Simulate processing time
        setTimeout(() => {
          setIsScanning(false);
          
          // Resultados simulados do escaneamento
          const rockName = 'Granito Preto São Gabriel';
          
          // Não salvamos mais no histórico aqui, apenas navegamos para a tela de resultado
          navigation.navigate('Result', { 
            image: photo.uri,
            rockName: rockName,
            fromScan: true
          });
        }, 2000);
      } catch (error) {
        setIsScanning(false);
        Alert.alert('Erro', 'Não foi possível capturar a foto.');
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsScanning(true);
      // Simulate processing time
      setTimeout(() => {
        setIsScanning(false);
        
        // Resultados simulados do escaneamento
        const rockName = 'Mármore Branco Espírito Santo';
        
        // Não salvamos mais no histórico aqui, apenas navegamos para a tela de resultado
        navigation.navigate('Result', { 
          image: result.assets[0].uri,
          rockName: rockName,
          fromScan: true
        });
      }, 2000);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Escanear" />
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-off-outline" size={64} color="#ccc" />
          <Text style={styles.permissionText}>
            Sem acesso à câmera
          </Text>
          <Text style={styles.permissionSubtext}>
            Por favor, permita o acesso à câmera nas configurações do seu dispositivo para usar esta funcionalidade.
          </Text>
          <TouchableOpacity 
            style={styles.galleryButton}
            onPress={pickImage}
          >
            <Ionicons name="images-outline" size={24} color="#fff" />
            <Text style={styles.galleryButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Escanear" />
      
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={flashMode}
        >
          <View style={styles.overlayContainer}>
            <View style={styles.topControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleFlashToggle}
              >
                <Ionicons 
                  name={flashMode === Camera.Constants.FlashMode.on ? 'flash' : 'flash-off'} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleCameraFlip}
              >
                <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.scanFrame}>
              {isScanning && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color="#2E7D32" />
                  <Text style={styles.scanningText}>Analisando rocha...</Text>
                </View>
              )}
            </View>
            
            <View style={styles.bottomControls}>
              <TouchableOpacity 
                style={styles.galleryButton}
                onPress={pickImage}
              >
                <Ionicons name="images-outline" size={24} color="#fff" />
                <Text style={styles.galleryButtonText}>Galeria</Text>
              </TouchableOpacity>
              
              <ScanButton onPress={takePicture} disabled={isScanning} />
              
              <View style={styles.placeholderButton} />
            </View>
          </View>
        </Camera>
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Como escanear</Text>
        <View style={styles.instructionItem}>
          <Ionicons name="sunny-outline" size={24} color="#2E7D32" />
          <Text style={styles.instructionText}>Certifique-se de que a rocha esteja bem iluminada</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="scan-outline" size={24} color="#2E7D32" />
          <Text style={styles.instructionText}>Posicione a câmera próxima à superfície da rocha</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="hand-left-outline" size={24} color="#2E7D32" />
          <Text style={styles.instructionText}>Mantenha a câmera estável ao tirar a foto</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    height: 400,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    alignSelf: 'center',
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  galleryButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  placeholderButton: {
    width: 80,
  },
  instructionsContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});

export default ScanScreen;
