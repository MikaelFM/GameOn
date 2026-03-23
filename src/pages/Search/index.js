import { createStackNavigator } from '@react-navigation/stack';
import SearchResult from '../SearchResult';
import QuadraDetails from '../QuadraDetails';
import ScheduleScreen from '../ScheduleScreen'

const Stack = createStackNavigator();

export default function Search() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none'  }}>
      <Stack.Screen 
        name="Home" 
        component={SearchResult}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="QuadraDetails" 
        component={QuadraDetails} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ScheduleScreen" 
        component={ScheduleScreen} 
        options={{ title: 'Reserva' }} 
      />
    </Stack.Navigator>
  );
}