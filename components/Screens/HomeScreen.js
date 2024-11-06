import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState(''); // Estado para almacenar el nombre del usuario

  const handleStartPress = () => {
    if (name.trim()) { // Asegurarse de que el usuario ingresó un nombre
      navigation.navigate('Game', { userName: name }); // Pasar el nombre a la pantalla del juego
    } else {
      alert("Por favor, ingresa tu nombre");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.description}>
      Fes clic sobre el mapa per respondre la pregunta amb la ubicació correcta, 
      posem a prova la teva precisió!
      </Text>
      <Text style={styles.description2}>
        Posa el teu nom per començar:
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Fondo más oscuro para mejor contraste
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#32CD32', // Verde brillante para el título
    marginBottom: 40, // Espacio más compacto
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#b3b3b3', // Color de texto más suave para el subtítulo
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: 40,
    marginBottom: 60,
  },
  description2: {
    fontSize: 18,
    color: '#b3b3b3', // Color de texto más suave para el subtítulo
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#32CD32',
    borderWidth: 1,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#32CD32', // Verde brillante para el botón
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000', // Sombra para dar profundidad
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Elevación en Android
  },
  startButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
