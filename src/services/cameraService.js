import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

// Camera service object
const cameraService = {
  // Request camera permissions
  requestCameraPermissions: async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  },
  
  // Request media library permissions
  requestMediaLibraryPermissions: async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  },
  
  // Take a picture using the camera
  takePicture: async (cameraRef) => {
    if (!cameraRef.current) {
      throw new Error('Camera reference is not available');
    }
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      
      return photo;
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    }
  },
  
  // Pick an image from the media library
  pickImage: async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (result.canceled) {
        return null;
      }
      
      return result.assets[0];
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  },
  
  // Save an image to the app's directory
  saveImage: async (uri, filename) => {
    try {
      const directory = `${FileSystem.documentDirectory}images/`;
      const dirInfo = await FileSystem.getInfoAsync(directory);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }
      
      const newUri = `${directory}${filename}`;
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });
      
      return newUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  },
  
  // Get saved images
  getSavedImages: async () => {
    try {
      const directory = `${FileSystem.documentDirectory}images/`;
      const dirInfo = await FileSystem.getInfoAsync(directory);
      
      if (!dirInfo.exists) {
        return [];
      }
      
      const files = await FileSystem.readDirectoryAsync(directory);
      return files.map(filename => `${directory}${filename}`);
    } catch (error) {
      console.error('Error getting saved images:', error);
      throw error;
    }
  },
  
  // Delete a saved image
  deleteImage: async (uri) => {
    try {
      await FileSystem.deleteAsync(uri);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};

export default cameraService;
