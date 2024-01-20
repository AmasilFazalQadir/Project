import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import OrdersScreen from './Screens/OrdersScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext, useEffect, useState } from 'react';
import OrderDetailScreen from './Screens/OrderDetailScreen';
import OrderContextProvider from './store/order-context';
import Button from './components/ui/Button';
import LoadingOverlay from './components/ui/LoadingOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: Colors.newPrimary100 },
      headerTintColor: 'white',
      // contentStyle: { backgroundColor: Colors.newPrimary100 },
    }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  )
}

function AuthenticatedStack() {

  const authCtx = useContext(AuthContext)

  function handleLogoutPress() {
    console.log('logout')
  }

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: Colors.newPrimary100 },
      headerTintColor: 'white',
      // contentStyle: { backgroundColor: Colors.newPrimary100 },
    }}>
      <Stack.Screen name='Orders' component={OrdersScreen} options={{
        headerRight: () => <Button onPress={authCtx.logout}>Log out</Button>
      }} />
      <Stack.Screen name='OrderDetail' component={OrderDetailScreen} options={{
        headerRight: () => <Button onPress={authCtx.logout}>Logout</Button>
      }} />
    </Stack.Navigator>
  )
}

function Navigation() {

  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {

  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken)
      }

      setIsTryingLogin(false)
    }

    fetchToken()
  }, [])

  if (isTryingLogin) {
    return <LoadingOverlay />
  }

  return <Navigation />
}

export default function App() {

  return (
    <>
      <StatusBar style='light' />
      <AuthContextProvider>
        <OrderContextProvider>
          <Root />
        </OrderContextProvider>
      </AuthContextProvider>
    </>
  )

}

const styles = StyleSheet.create({

});
