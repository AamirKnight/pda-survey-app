import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import SideDrawer from './src/components/SideDrawer';
import ConstructionDetailsScreen from './src/screens/ConstructionDetailsScreen';
import EvidenceUploadScreen from './src/screens/EvidenceUploadScreen';
import LoginScreen from './src/screens/LoginScreen';
import MapVerificationScreen from './src/screens/MapVerificationScreen';
import NewSurveyScreen from './src/screens/NewSurveyScreen';
import PropertyVerificationScreen from './src/screens/PropertyVerificationScreen';
import SurveyRecommendationScreen from './src/screens/SurveyRecommendationScreen';
import SurveyResultScreen from './src/screens/SurveyResultScreen';
import SurveySuccessScreen from './src/screens/SurveySuccessScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MainDrawer({ user }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideDrawer {...props} currentUser={user} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
      <Drawer.Screen name="NewSurvey" component={NewSurveyScreen} />
      <Drawer.Screen name="PropertyVerification" component={PropertyVerificationScreen} />
      <Drawer.Screen name="MapVerification" component={MapVerificationScreen} />
      <Drawer.Screen name="ConstructionDetails" component={ConstructionDetailsScreen} />
      <Drawer.Screen name="EvidenceUpload" component={EvidenceUploadScreen} />
      <Drawer.Screen name="SurveyResult" component={SurveyResultScreen} />
      <Drawer.Screen name="SurveyRecommendation" component={SurveyRecommendationScreen} />
      <Drawer.Screen name="SurveySuccess" component={SurveySuccessScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('pda_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newUser) => {
    setUser(newUser);
  };

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainDrawer user={user} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
