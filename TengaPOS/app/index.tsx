import { View, Text } from 'react-native';
import * as Store from "expo-secure-store";
import { router } from 'expo-router';

const MainPage = () => {
  // Get the user's session
  const session = Store.getItem("session");
  const onboardingCompleted = Store.getItem("onboardingCompleted");

  if (session) {
    // Redirect to the home page
    return router.push("/(tabs)/home");
  }

  if (onboardingCompleted) {
    // Redirect to the signin page
    return router.push("/(auth)/signin");
  }

  // Show the onboarding
  return (
    <View>
      <Text>Hi</Text>
    </View>
  )
}

export default MainPage