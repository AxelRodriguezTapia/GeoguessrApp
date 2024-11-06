import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import haversine from 'haversine';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../utils/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const GameScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userName } = route.params; // Obtener el nombre del usuario desde los parámetros de navegación
  const [questionsData, setQuestionsData] = useState([]);
  const [score, setScore] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0); // Estado para el puntaje visual
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showmarker, setShowMarker] = useState(false);
  const [nextButton, setNextButton] = useState(false);
  const [exitButton, setExitButton] = useState(false);
  const [checkButtonTrigger, setCheckButtonTrigger] = useState(true);
  const [targetCoords, setTargetCoords] = useState(null);
  const [region, setRegion] = useState(null); // Nueva variable de estado para manejar la región del mapa

  const handleCheckPress = () => {
    if (markerCoords) {
      const calculatedDistance = haversine(markerCoords, targetCoords, { unit: 'meter' });
      setShowMarker(true);
      setDistance(calculatedDistance);
      setCheckButtonTrigger(false);
      setNextButton(true);
      setExitButton(true);

      // Animación del score
      const scoreIncrease = calculatedDistance;
      setScore(prevScore => prevScore + scoreIncrease);

      let currentScore = displayedScore;
      const increment = scoreIncrease / 50; // Divídelo en 50 pasos para una animación suave
      const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score + scoreIncrease) {
          clearInterval(interval);
          setDisplayedScore(score + scoreIncrease); // Muestra el puntaje final exacto
        } else {
          setDisplayedScore(currentScore); // Actualiza el puntaje mostrado de manera gradual
        }
      }, 20); // Tiempo entre pasos (20 ms para una animación rápida)

      // Aquí ajustamos la vista del mapa para que se vean ambos puntos
      setRegion({
        latitude: (markerCoords.latitude + targetCoords.latitude) / 2, // Promedio de las latitudes
        longitude: (markerCoords.longitude + targetCoords.longitude) / 2, // Promedio de las longitudes
        latitudeDelta: (markerCoords.latitude + targetCoords.latitude)+50,
        longitudeDelta: (markerCoords.latitude + targetCoords.latitude)+50,
      });
    }
  };

  const handleExitButtonPress = () => {
    navigation.navigate('Home');
    setExitButton(false);
  };

  const handleMapPress = (event) => {
    if (checkButtonTrigger) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setMarkerCoords({ latitude, longitude });
    }
  };

  const handleNextButtonPress = () => {
    setCheckButtonTrigger(true);
    setExitButton(false);
    setNextButton(false);
    setShowMarker(false);
    setQuestionNumber(questionNumber + 1);
    setTargetCoords(questionsData[questionNumber + 1]?.loc);
    setMarkerCoords(null);

    if ((questionNumber + 1) === questionsData.length) {
      goToScoreScreen();
    }
  };

  const goToScoreScreen = async () => {
    // Guardar la puntuación en Firebase antes de ir a ScoreScreen
    try {
      await addDoc(collection(db, 'players'), { // Aquí estamos guardando el nombre y la puntuación
        name: userName,
        bestScore: score,
      });
    } catch (error) {
      console.error("Error saving score: ", error);
    }
    navigation.navigate('Score', { score });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsCollection = collection(db, 'quests');
        const snapshot = await getDocs(questionsCollection);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestionsData(data);
        setTotalQuestions(data.length);
        setTargetCoords(data[questionNumber]?.loc);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.progress}>{questionNumber + 1}/{totalQuestions}</Text>

      <MapView
        style={styles.map}
        mapType="satellite"
        initialRegion={{
          latitude: 41.7282,
          longitude: 1.8236,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        region={region} // Usamos la nueva variable de estado para la región
        onPress={handleMapPress}
      >
        {showmarker && (
          <Marker coordinate={{ latitude: targetCoords.latitude, longitude: targetCoords.longitude }} pinColor="green" />
        )}
        {markerCoords && (
          <Marker coordinate={markerCoords} pinColor="red" />
        )}
        {showmarker && (
          <Polyline
            coordinates={[{ latitude: targetCoords.latitude, longitude: targetCoords.longitude }, markerCoords]}
            strokeColor="#32CD32"
            strokeWidth={2}
          />
        )}
      </MapView>
      <Text style={styles.question}>{questionsData[questionNumber]?.pregunta}</Text>

      <View style={styles.buttonsrow}>
        {exitButton && (
          <TouchableOpacity style={styles.exitButton} onPress={handleExitButtonPress}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        )}
        {checkButtonTrigger && (
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckPress}>
            <Text style={styles.checkButtonText}>Check</Text>
          </TouchableOpacity>
        )}
        {nextButton && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextButtonPress}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {distance && !checkButtonTrigger && (
        <Text style={styles.distanceText}>
          L'objectiu esta a una distancia de {Math.round(distance)} metres
        </Text>
      )}
      <Text style={styles.score}>
        Score: {Math.round(displayedScore)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonsrow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#32CD32',
  },
  progress: {
    fontSize: 20,
    color: '#32CD32',
    marginBottom: 20,
  },
  map: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
  },
  exitButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  exitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  checkButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  distanceText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  score: {
    fontSize: 16,
    color: '#fff',
    marginTop: 50,
    marginLeft: -175,
  },
});

export default GameScreen;
