import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardScreen from '../screens/DashboardScreen';
import SurveyHistoryScreen from '../screens/SurveyHistoryScreen';
import SurveyListScreen from '../screens/SurveyListScreen';
import { colors, elevation, minTouchTarget, radius, spacing, typography } from '../theme/theme';

// NOTE: ProfileScreen and the survey-flow screens keep their existing implementations
// for now — only the 4 tab roots ship redesigned in this pass.
// @ts-ignore
import ProfileScreen from '../../src/screens/ProfileScreen';
// @ts-ignore
import NewSurveyScreen from '../../src/screens/NewSurveyScreen';
// @ts-ignore
import PropertyVerificationScreen from '../../src/screens/PropertyVerificationScreen';
// @ts-ignore
import MapVerificationScreen from '../../src/screens/MapVerificationScreen';
// @ts-ignore
import ConstructionDetailsScreen from '../../src/screens/ConstructionDetailsScreen';
// @ts-ignore
import EvidenceUploadScreen from '../../src/screens/EvidenceUploadScreen';
// @ts-ignore
import SurveyResultScreen from '../../src/screens/SurveyResultScreen';
// @ts-ignore
import SurveyRecommendationScreen from '../../src/screens/SurveyRecommendationScreen';
// @ts-ignore
import SurveySuccessScreen from '../../src/screens/SurveySuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_CONFIG = {
  Dashboard: { label: 'Dashboard', icon: 'grid', iconOutline: 'grid-outline' },
  Surveys: { label: 'Surveys', icon: 'clipboard', iconOutline: 'clipboard-outline' },
  History: { label: 'History', icon: 'time', iconOutline: 'time-outline' },
  Profile: { label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
};

/** Floating, rounded, safe-area-respecting tab bar — fully custom so it
 * can never be pushed off-screen by a notch, gesture bar, or keyboard. */
function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  // Get the options for the currently focused tab route
  const focusedRoute = state.routes[state.index];
  const { options } = descriptors[focusedRoute.key];

  // If the route options say the tab bar should be hidden, don't render it
  if (options.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={[styles.bar, elevation.lg]}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name] ?? TAB_CONFIG.Dashboard;
          const isFocused = state.index === index;
          const { options: routeOptions } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={routeOptions.tabBarAccessibilityLabel ?? config.label}
              style={styles.tabItem}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={isFocused ? config.icon : config.iconOutline}
                  size={20}
                  color={isFocused ? colors.primary : colors.textTertiary}
                />
              </View>
              <Text style={[styles.tabLabel, { color: isFocused ? colors.primary : colors.textTertiary }]}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="NewSurvey" component={NewSurveyScreen} />
      <Stack.Screen name="PropertyVerification" component={PropertyVerificationScreen} />
      <Stack.Screen name="MapVerification" component={MapVerificationScreen} />
      <Stack.Screen name="ConstructionDetails" component={ConstructionDetailsScreen} />
      <Stack.Screen name="EvidenceUpload" component={EvidenceUploadScreen} />
      <Stack.Screen name="SurveyResult" component={SurveyResultScreen} />
      <Stack.Screen name="SurveyRecommendation" component={SurveyRecommendationScreen} />
      <Stack.Screen name="SurveySuccess" component={SurveySuccessScreen} />
    </Stack.Navigator>
  );
}

function SurveysStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SurveyListMain" component={SurveyListScreen} />
      <Stack.Screen name="PropertyVerification" component={PropertyVerificationScreen} />
      <Stack.Screen name="MapVerification" component={MapVerificationScreen} />
      <Stack.Screen name="ConstructionDetails" component={ConstructionDetailsScreen} />
      <Stack.Screen name="EvidenceUpload" component={EvidenceUploadScreen} />
      <Stack.Screen name="SurveyResult" component={SurveyResultScreen} />
      <Stack.Screen name="SurveyRecommendation" component={SurveyRecommendationScreen} />
      <Stack.Screen name="SurveySuccess" component={SurveySuccessScreen} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SurveyHistoryMain" component={SurveyHistoryScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// Helper function to check if the tab bar should be visible based on the current nested route
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  
  // Tab bar should ONLY be visible on these root screens.
  // 'undefined' means we are on the initial screen of that stack and haven't navigated deeper yet.
  const visibleScreens = ['DashboardMain', 'SurveyListMain', 'SurveyHistoryMain', 'ProfileMain', undefined];
  
  return visibleScreens.includes(routeName) ? 'flex' : 'none';
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { display: getTabBarVisibility(route) }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Surveys" component={SurveysStack} />
      <Tab.Screen name="History" component={HistoryStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: minTouchTarget,
    paddingVertical: spacing.xs,
  },
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapActive: { backgroundColor: colors.primaryTint },
  tabLabel: { ...typography.caption, fontWeight: '700' },
});