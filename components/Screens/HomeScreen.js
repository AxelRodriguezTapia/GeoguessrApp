import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleStartPress = () => {
    navigation.navigate('Game'); // Navega a la pantalla del juego
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.description}>
        Fes clic sobre el mapa per respondre la pregunta amb la ubicació correcte,
        posem a prova la teva precisió!
      </Text>
      <Button title="Start" onPress={handleStartPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 30,
  },
});

export default HomeScreen;