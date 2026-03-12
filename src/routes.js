import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'

import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

export default function Routes () {
    return(
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#2B9D48',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0
                }
            }}
        >
            <Tab.Screen
                name='home'
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name="home" size={size} color={color}></Ionicons>
                    }
                }}
            />
            <Tab.Screen
                name='search'
                component={Search}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name="search" size={size} color={color}></Ionicons>
                    }
                }}
            />
            <Tab.Screen
                name='profile'
                component={Profile}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size, focused}) => {
                        return <Ionicons name="person" size={size} color={color}></Ionicons>
                    }
                }}
            />
        </Tab.Navigator>
    )
}

