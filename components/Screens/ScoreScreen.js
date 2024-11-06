import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../../utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const ScoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { score = 0 } = route.params || {};
  const [allScores, setAllScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, 'players');
        const snapshot = await getDocs(scoresCollection);
        const scoresList = snapshot.docs.map(doc => doc.data());

        // Ordenar los scores de menor a mayor
        const sortedScores = scoresList.sort((a, b) => a.bestScore - b.bestScore);
        setAllScores(sortedScores);
      } catch (error) {
        console.error("Error fetching scores: ", error);
      }
    };
    fetchScores();
  }, []);

  const handleStartPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.description}>La teva puntuació es de:</Text>
      <Text style={styles.scoretext}>{score.toFixed(0)} metres</Text>

      <Text style={styles.allScoresTitle}>Puntuaciones de todos los jugadores:</Text>
      <FlatList
        data={allScores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.scoreItem}>{item.name}: {item.bestScore.toFixed(0)} metres</Text>
        )}
      />

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
    padding: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#32CD32',
    marginBottom: 10,
    marginTop: 25,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 0,
    marginHorizontal: 50,
  },
  allScoresTitle: {
    fontSize: 18,
    color: '#32CD32',
    marginTop: 20,
    marginBottom: 10,
  },
  scoreItem: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  scoretext: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 50,
  },
  startButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 100,
    marginTop: 10,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScoreScreen;
