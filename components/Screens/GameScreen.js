import React, { useEffect,useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import haversine from 'haversine';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../utils/firebaseConfig'; // Importa la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importa Firestore

const GameScreen = () => {
  const navigation = useNavigation();
  const [questionsData, setQuestionsData] = useState([]);

  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1); // Ejemplo de número de pregunta
  const [totalQuestions, setTotalQuestions] = useState(10); // Total de preguntas
  const [markerCoords, setMarkerCoords] = useState(null); // Coordenadas del marcador
  const [distance, setDistance] = useState(null); // Distancia entre los puntos
  const [showmarker,setShowMarker]=useState(false); //El usuario ya ha marcado el punto 1
  const [nextButton,setNextButton]=useState(false);
  const [exitButton,setExitButton]=useState(false);
  const [checkButtonTrigger,setCheckButtonTrigger]=useState(true);

  // Coordenadas hardcodeadas para el punto objetivo
  const targetCoords = { latitude: 41.3851, longitude: 2.1734 }; // Ejemplo: Barcelona

  const handleCheckPress = () => {
    if (markerCoords) {
      // Calcular la distancia usando la fórmula de Haversine
      const calculatedDistance = haversine(markerCoords, targetCoords, { unit: 'meter' });
      setShowMarker(true);
      setDistance(calculatedDistance);
      //alert(`El objetivo está a una distancia de ${Math.round(calculatedDistance)} metros`);
      setCheckButtonTrigger(false);
      setNextButton(true);
      setExitButton(true);
    } else {
      //alert("Coloca un marcador en el mapa antes de verificar.");
    }
    
  };

  const handleExitButtonPress = () =>{
    navigation.navigate('Home'); // Navega a la pantalla de inicio
    setExitButton(false);
  };

  const handleMapPress = (event) => {
    // Actualiza las coordenadas del marcador con la ubicación donde se pulsó el mapa
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });
  };

  const handleNextButtonPress = () =>{
    //Siguiente pregunta y hacer reset a todos los mierdas
    setCheckButtonTrigger(true);
    setExitButton(false);
    setNextButton(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsCollection = collection(db, 'quests'); // Cambia 'questions' al nombre de tu colección
        const snapshot = await getDocs(questionsCollection);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestionsData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchData();
  }, []);




  return (
    <View style={styles.container}>
      <Text style={styles.title}>GeoGuessr</Text>
      <Text style={styles.progress}>{questionNumber}/{totalQuestions}</Text>
      
        <MapView
        style={styles.map}
        mapType="satellite" // Cambia el tipo de mapa a satélite
        initialRegion={{
          latitude: 41.7282,
          longitude: 1.8236,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        onPress={handleMapPress}
        >
        {showmarker &&(
          <Marker coordinate={targetCoords} pinColor="green" />
        )}
        
        
        {markerCoords && (
          <Marker coordinate={markerCoords} pinColor="red" />
        )}

        {/* Línea entre los dos marcadores si ambos existen */}
        {showmarker && (
          <Polyline
            coordinates={[targetCoords, markerCoords]}
            strokeColor="#32CD32" // Color de la línea (verde)
            strokeWidth={2}
          />
        )}
      </MapView>

      <Text style={styles.question}>On està Barcelona?</Text>

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

      {distance && (
        <Text style={styles.distanceText}>
          El objetivo está a una distancia de {Math.round(distance)} metros
        </Text>
      )}

      <Text style={styles.score}>Actual Score: {score}m</Text>
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
    flexDirection: 'row', // Organiza los botones en una fila
    justifyContent: 'space-between', // Espacia los botones de manera uniforme
    width: '70%', // Ajusta el ancho según tus necesidades
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#32CD32', // Verde brillante para el título
  },
  progress: {
    fontSize: 20,
    color: '#32CD32', // Verde brillante para el progreso
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
    backgroundColor: '#32CD32', // Verde para el botón
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
    backgroundColor: '#32CD32', // Verde para el botón
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  checkButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#32CD32', // Verde para el botón
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
    marginRight:200,
  },
});

export default GameScreen;
