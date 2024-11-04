import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/Screens/HomeScreen'; // Asegúrate de que la ruta sea correcta
import GameScreen from './components/Screens/GameScreen'; // Crea este componente para la pantalla del juego
import ScoreScreen from './components/Screens/ScoreScreen'; // Pantalla del scoreFinal

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} // Ocultar el encabezado si no lo necesitas
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: 'Juego',headerShown:false}} // Título para la pantalla del juego
        />
        <Stack.Screen
          name="Score" 
          component={ScoreScreen} 
          options={{ title: 'Juego',headerShown:false}} // Título para la pantalla del juego
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;