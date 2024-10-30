import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TextInput } from "react-native";
import Button from './components/Button'; 
import ImageViewer from './components/ImageViewer';
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef,useEffect } from 'react';
import React from 'react';
import MapView, { Marker } from 'react-native-maps'; // Importa el componente MapView
import * as Location from 'expo-location'; // Importa la API de localización

// Importa las dependencias de navegación
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Define el stack de navegación
const Stack = createNativeStackNavigator();

const PlaceholderImage = require("./assets/images/background-image.png");

function HomeScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const imageRef = useRef();
  
  
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (status === null) {
      requestPermission();
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer
              placeholderImageSource={PlaceholderImage}
              selectedImage={selectedImage}
            />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          </View>
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
            <Button theme="secondary" label="Use this photo" onPress={() => setShowAppOptions(true)} />
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
        <Button 
          theme="primary" 
          label="Go to NewHome" 
          onPress={() => navigation.navigate('NewHome')} 
        />
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

function NewHome({ navigation }) {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>Enter your name:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type your name"
        value={name}
        onChangeText={setName}
      />
      <Button 
        theme="primary" 
        label="Go to Screen 1" 
        onPress={() => navigation.navigate('Screen1', { userName: name })} 
      />
      <Button 
        theme="primary" 
        label="Go to Screen 2" 
        onPress={() => navigation.navigate('Screen2')} 
      />
      <Button 
        theme="secondary" 
        label="Go back to Home" 
        onPress={() => navigation.popToTop()} 
      />
    </View>
  );
}

function Screen1({ route, navigation }) {
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>This is Screen 1</Text>
      {userName && <Text style={styles.whiteText}>Welcome, {userName}!</Text>}
      <Button 
        theme="primary" 
        label="Go to Details" 
        onPress={() => navigation.navigate('Details', { userName,fromScreen: 'Screen1' })} 
      />
      <Button 
        theme="secondary" 
        label="Go back to Home" 
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

function Screen2({ navigation }) {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);  // Almacenará los marcadores guardados
  const [errorMsg, setErrorMsg] = useState(null);
  const predefinedMarkers = [
    { latitude: 41.3851, longitude: 2.1734, name: "Barcelona" },
    { latitude: 40.4168, longitude: -3.7038, name: "Madrid" },
    { latitude: 48.8566, longitude: 2.3522, name: "París" },
    // Agrega más marcadores según sea necesario
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation({ latitude: 41.3851, longitude: 2.1734 }); // Barcelona
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  const handleMarkerPress = (marker) => {
    navigation.navigate('MarkerDetails', { marker }); // Navigate to MarkerDetails and pass the marker data
  };
  
  // Inside your Marker component mapping
  {markers.map((marker, index) => (
    <Marker 
      key={index} 
      coordinate={marker} 
      title={marker.name || `Marker ${index + 1}`} 
      onPress={() => handleMarkerPress(marker)} // Handle marker press
    />
  ))}

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Definir los límites de Manresa
    const MANRESA_BOUNDS = {
      latitudeMin: 41.704016,
      latitudeMax: 41.758409,
      longitudeMin: 1.795785,
      longitudeMax: 1.885033,
    };

    // Verificar si las coordenadas están dentro de los límites de Manresa
    if (
      latitude < MANRESA_BOUNDS.latitudeMin ||
      latitude > MANRESA_BOUNDS.latitudeMax ||
      longitude < MANRESA_BOUNDS.longitudeMin ||
      longitude > MANRESA_BOUNDS.longitudeMax
    ) {
      alert('You can only place markers within the limits of Manresa.');
      return; // No continuar si está fuera de los límites
    }

    navigation.navigate('NewMarker', {
      latitude,
      longitude,
      saveMarker: (newMarker) => setMarkers([...markers, newMarker]),
    });
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is Screen 2</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here" />

        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            coordinate={marker} 
            title={marker.name || `Marker ${index + 1}`} // Mostrar el nombre del marcador
            onPress={() => handleMarkerPress(marker)} // Handle marker press
            //try add image
          />
        ))}

        {predefinedMarkers.map((marker, index) => (
          <Marker 
            key={`predefined-${index}`} 
            coordinate={marker} 
            title={marker.name} // Mostrar el nombre del marcador predefinido
            onPress={() => handleMarkerPress(marker)} // Handle marker press
          />
        ))}
      </MapView>
      <Button theme="primary" label="Go to Details" onPress={() => navigation.navigate('Details', { fromScreen: 'Screen2' })} />
      <Button theme="secondary" label="Go back to Home" onPress={() => navigation.popToTop()} />
    </View>
  );
}
function MarkerDetails({ route, navigation }) {
  const { marker } = route.params; // Get the marker data from the route parameters

  return (
    <View style={styles.container}>
      <Text style={styles.whiteTitle}>{marker.name}</Text>
      <Text style={styles.whiteText}>Latitude: {marker.latitude}</Text>
      <Text style={styles.whiteText}>Longitude: {marker.longitude}</Text>
      <Button 
        theme="secondary" 
        label="Back to Map" 
        onPress={() => navigation.goBack()} // Go back to the previous screen
      />
    </View>
  );
}

function NewMarker({ route, navigation }) {
  const { latitude, longitude, saveMarker } = route.params;
  const [markerName, setMarkerName] = useState(''); // Estado para el nombre del marcador

  const handleSave = () => {
    const newMarker = { 
      latitude, 
      longitude, 
      name: markerName // Guardar el nombre del marcador
    };
    saveMarker(newMarker);
    navigation.goBack();  // Volver a la pantalla anterior después de guardar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.whiteTitle}>Add new Marker</Text>
      
      {/* Campo de texto para ingresar el nombre del marcador */}
      <TextInput 
        style={styles.textInput}
        placeholder="Enter marker name"
        value={markerName}
        onChangeText={setMarkerName} // Actualizar el estado con el nombre del marcador
      />
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={markerName || "New Marker"} />
      </MapView>
      
      <Button theme="primary" label="Save Marker" onPress={handleSave} />
      <Button theme="secondary" label="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
}




function Details({ route, navigation }) {
  const { fromScreen } = route.params;
  const userName = route.params?.userName;  // Verifica si userName está definido
  
  return (
    <View style={styles.container}>
      <Text>This is the Details screen</Text>
      <Button 
        theme="primary" 
        label={`Go back to ${fromScreen}`} 
        onPress={() => navigation.navigate(fromScreen, { userName })} // Pasa de nuevo el parámetro userName
      />
      <Button 
        theme="secondary" 
        label="Go back to NewHome" 
        onPress={() => navigation.navigate('NewHome')} 
      />
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewHome" component={NewHome} />
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="NewMarker" component={NewMarker} />
        <Stack.Screen name="MarkerDetails" component={MarkerDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  map: {
    width: '100%',  // Ancho del mapa al 100% del contenedor
    height: '50%',  // Alto del mapa al 50% de la pantalla
    marginBottom: 20,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  whiteText: {
    color: '#fff', // Color blanco
  },
  whiteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Color blanco
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  textInput: {
    borderColor: '#fff',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    color: '#fff',
  },
});
