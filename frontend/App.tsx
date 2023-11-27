import React, { Fragment, useState } from 'react';
import ImagePicker, { Image as ImageType } from 'react-native-image-crop-picker';
import axios, { AxiosError } from 'axios';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Alert,
  Button,  // Import Button from react-native
} from 'react-native';

const App: React.FC = () => {
  const [state, setState] = useState({
    filepath: { data: '', uri: '' },
    fileData: '',
    fileUri: '',
  });

  const chooseImage = async () => {
    try {
      const response: ImageType | ImageType[] = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      console.log('response', response);

      if (Array.isArray(response)) {
        // Handle multiple images (if needed)
      } else {
        setState({
          ...state,
          filepath: {
            data: response.data || '',
            uri: response.path || '',
          },
          fileData: response.data || '',
          fileUri: response.path || '',
        });
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const launchCamera = async () => {
    try {
      const response: ImageType = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });

      console.log('response', response);

      setState({
        ...state,
        filepath: {
          data: response.data || '',
          uri: response.path || '',
        },
        fileData: response.data || '',
        fileUri: response.path || '',
      });
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const uploadImage = async () => {
    try {
      const { fileUri } = state;
  
      if (!fileUri) {
        console.log('Please select an image first.');
        Alert.alert('Error','Please select an image first.');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
  
      // Replace 'YOUR_BACKEND_API_URL' with your actual backend API endpoint
      const response = await fetch('http://your-machine-ip-here:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Image uploaded successfully:', responseData);
      Alert.alert('Success', 'Submitted Successfully!', [
        { text: 'OK', onPress: () => clearImagePreview() },
      ]);
    } catch (error:any) {
      console.error('Error uploading image:', error.message);
      Alert.alert('Error', 'Error! Please try again.');
    }
  };

  const clearImagePreview = () => {
    // Reset state to clear the image preview
    setState({
      filepath: { data: '', uri: '' },
      fileData: '',
      fileUri: '',
    });
  };

  const renderFileData = () => {
    if (state.fileData) {
      return <Image source={{ uri: `data:image/jpeg;base64,${state.fileData}` }} style={styles.images} />;
    } else {
      return <Image source={require('./assets/dummy.png')} style={styles.images} />;
    }
  };

  const renderFileUri = () => {
    if (state.fileUri) {
      return <Image source={{ uri: state.fileUri }} style={styles.images} />;
    } else {
      return <Image source={require('./assets/galeryImages.jpg')} style={styles.images} />;
    }
  };

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}>
            Pick Images from Camera & Gallery
          </Text>
          <View style={styles.ImageSections}>
            <View>
              {renderFileData()}
              <Text style={{ textAlign: 'center' }}>Base 64 String</Text>
            </View>
            <View>
              {renderFileUri()}
              <Text style={{ textAlign: 'center' }}>File Uri</Text>
            </View>
          </View>

          <View style={styles.btnParentSection}>
            <TouchableOpacity onPress={chooseImage} style={styles.btnSection}>
              <Text style={styles.btnText}>Choose File</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={launchCamera} style={styles.btnSection}>
              <Text style={styles.btnText}>Directly Launch Camera</Text>
            </TouchableOpacity>

            <Button onPress={uploadImage} title="Submit" />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 20,
    width: Dimensions.get('screen').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
