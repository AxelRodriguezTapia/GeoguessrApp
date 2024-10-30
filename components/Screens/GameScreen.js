import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GameScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);

  const increaseScore = () => {
    setScore(score + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido al Juego!</Text>
      <Text style={styles.score}>Puntuación: {score}</Text>
      
      <Button title="Aumentar puntuación" onPress={increaseScore} />
      <Button title="Volver al Inicio" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default GameScreen;
