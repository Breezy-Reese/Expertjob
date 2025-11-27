import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import { SplashScreen1, SplashScreen2, SplashScreen3 } from '../screens/OnboardingScreens';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens/AuthScreens';
import HomeScreen from '../screens/HomeScreen';
import { JobDetailsScreen, JobApplicationScreen } from '../screens/JobScreens';
import ApplicationStatusScreen from '../screens/ApplicationStatusScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const EmployeeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Applications') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Applications" component={ApplicationStatusScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash1" screenOptions={{ headerShown: false }}>
        {/* Onboarding Screens */}
        <Stack.Screen name="Splash1" component={SplashScreen1} />
        <Stack.Screen name="Splash2" component={SplashScreen2} />
        <Stack.Screen name="Splash3" component={SplashScreen3} />
        
        {/* Auth Screens */}
        <Stack.Screen name="Auth" component={AuthStack} />
        
        {/* Main App */}
        <Stack.Screen name="EmployeeDashboard" component={EmployeeTabs} />
        
        {/* Job Screens */}
        <Stack.Screen 
          name="JobDetails" 
          component={JobDetailsScreen}
          options={{ headerShown: true, title: 'Job Details' }}
        />
        <Stack.Screen 
          name="JobApplication" 
          component={JobApplicationScreen}
          options={{ headerShown: true, title: 'Apply for Job' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

export default AppNavigator;