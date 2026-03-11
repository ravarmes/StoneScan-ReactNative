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
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ScanButton from '../components/ScanButton';
import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef(null);
  const [model, setModel] = useState(null);

useEffect(() => {
    async function loadModel() {
      try {
        const tfModel = await loadTensorflowModel(require('../../assets/best_model_float16.tflite'));
        setModel(tfModel);
        console.log("Modelo IA carregado");
      } catch (e) {
        console.error("Erro ao carregar modelo IA:", e);
      }
    }
    loadModel();
  }, []);

  const handleCameraFlip = () => {
    setCameraType(
      cameraType === 'back'
        ? 'front'
        : 'back'
    );
  };
  
  const handleFlashToggle = () => {
    setFlashMode(
      flashMode === 'off'
        ? 'on'
        : 'off'
    );
  };

  const processImageToTensor = async (uri) => {
    //Redimensiona para 224x224
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }],
      { format: ImageManipulator.SaveFormat.JPEG }
    );

    const imgB64 = await FileSystem.readAsStringAsync(manipResult.uri, {
  encoding: 'base64', 
});

    const imgBuffer = Buffer.from(imgB64, 'base64');
    const rawImageData = jpeg.decode(imgBuffer, { useTArray: true });
    const { width, height, data } = rawImageData;

    const float32Data = new Float32Array(3 * width * height);

    //Obrigatório para ResNet
    const FLOAT_MAX = 255.0;
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < width * height; i++) {
      const r = data[i * 4] / FLOAT_MAX;
      const g = data[i * 4 + 1] / FLOAT_MAX;
      const b = data[i * 4 + 2] / FLOAT_MAX;

      float32Data[i] = (r - mean[0]) / std[0];                                  
      float32Data[width * height + i] = (g - mean[1]) / std[1];                 
      float32Data[2 * width * height + i] = (b - mean[2]) / std[2];         
    }
    
    return float32Data;
  };
  
  const classifyRock = async (imageUri) => {
    if (!model) {
      Alert.alert("Aviso", "O motor de IA ainda está carregando.");
      return "Modelo indisponível";
    }

    try {
      console.log("Iniciando conversão da imagem...");
      const inputTensor = await processImageToTensor(imageUri);
      
      console.log("Rodando IA...");
      const output = await model.run([inputTensor]);
      
      const predictions = output[0]; 
      
      const maxIndex = predictions.indexOf(Math.max(...predictions));
      
      const ROCK_CLASSES = [
        'Granito Branco Itaúnas', 
        'Mármore Matarazzo', 
        'Quartzito Perla', 
        'Quartzito Wakanda', 
        'Quartzito Verde Gaya'
      ];
      
      const pedraDetectada = ROCK_CLASSES[maxIndex];
      console.log("Resultado da IA:", pedraDetectada);
      
      return pedraDetectada;
    } catch (error) {
      console.error("Erro na inferência:", error);
      return "Erro na análise";
    }
  };
  
  const takePicture = async () => {
    if (cameraRef.current) {
      setIsScanning(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        const rockName = await classifyRock(photo.uri);
        
        setIsScanning(false);
        navigation.navigate('Result', { 
          image: photo.uri,
          rockName: rockName,
          fromScan: true
        });
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
      
      const uri = result.assets[0].uri;
      
      // Chama a IA de verdade
      const rockName = await classifyRock(uri);
      
      setIsScanning(false);
      navigation.navigate('Result', { 
        image: uri,
        rockName: rockName,
        fromScan: true
      });
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }
  
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Escanear" />
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-off-outline" size={64} color="#ccc" />
          <Text style={styles.permissionText}>Sem acesso à câmera</Text>
          <Text style={styles.permissionSubtext}>
            Por favor, permita o acesso à câmera para usar esta funcionalidade.
          </Text>
          
          <TouchableOpacity 
            style={[styles.galleryButton, { marginBottom: 12, backgroundColor: '#2E7D32' }]}
            onPress={requestPermission}
          >
            <Ionicons name="camera-outline" size={24} color="#fff" />
            <Text style={styles.galleryButtonText}>Permitir Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
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
        <CameraView
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
                  name={flashMode === 'on' ? 'flash' : 'flash-off'} 
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
        </CameraView>
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