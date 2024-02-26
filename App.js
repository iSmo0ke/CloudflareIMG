import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [variants, setVariants] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      alert('Por favor, selecciona una imagen antes de subirla.');
      return;
    }

    const formData = new FormData();
    formData.append("file", "image");

    try {
      const response = await axios.request({
        url: "https://api.cloudflare.com/client/v4/accounts/ca9b43f77ee269734e8818fd05c17671/images/v1",
        method: "POST",
        data: formData,
        headers: {
          "Authorization": "Bearer UyOxZFlhu6jX60HHuGUgPdn1W9umohvgof2AZSjK"
        }
      });
      
      const {result} = data;
      const {variants} = result;
      setVariants(variants);

      if (result && result.variants) {
        setVariants(result.variants);
      } else {
        alert('Error al obtener las variantes de imagen.');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      console.log(error);
      alert('Error al subir la imagen. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Selecciona tu imagen</Text>
      <Button title="Seleccionar imagen de la galería" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
      <Button title="Subir imagen a CloudFlare" onPress={uploadImage} disabled={!image} />
      <Text style={styles.text}>Imagen subida:</Text>
      {variants.map((variant, index) => (
        <View key={index}>
          <Text style={styles.text}>Variante {index + 1}:</Text>
          <Image source={{ uri: variant.url }} style={{ width: 200, height: 200, marginVertical: 10 }} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#39B5CD',
    alignItems: 'center',
    paddingVertical: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontStyle: 'italic',
    marginVertical: 5,
  },
});
