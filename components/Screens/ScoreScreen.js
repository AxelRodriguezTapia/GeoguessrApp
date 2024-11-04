import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ScoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { score = 0,distance = 0 } = route.params || {}; // Accedemos a score desde los parámetros

  const handleStartPress = () => {
    navigation.navigate('Home'); // Navega a la pantalla de inicio
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.description}>
        La teva puntuació es de: 
      </Text>
      <Text style={styles.scoretext}>
        {(score + distance).toFixed(0)} metres
      </Text>

      
      <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
        <Text style={styles.startButtonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#32CD32',
    marginBottom: 100,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 0,
    marginHorizontal: 50,
  },
  scoretext: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 150,
    marginHorizontal: 50,
  },
  startButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 100,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScoreScreen;
