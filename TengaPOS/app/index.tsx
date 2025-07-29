import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import * as Store from 'expo-secure-store';
import {
  Store as StoreIcon,
  Package as PackageIcon,
  DollarSign as DollarSignIcon,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Common step wrapper
const StepWrapper = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <View className="w-full flex-1 px-4 py-8 gap-40 items-center">
    {/* Top Text */}
    <View className="w-full items-center">
      <Text className="text-2xl font-bold text-center mb-1">{title}</Text>
      <Text className="text-base text-center text-gray-600">{description}</Text>
    </View>

    {/* Center Icon */}
    <View className="rounded-full bg-gray-200 p-8 justify-center items-center">
      {icon}
    </View>
  </View>
);

// Step 1
const StepOne = () => (
  <StepWrapper
    icon={<StoreIcon color="orange" strokeWidth={1.2} size={100} />}
    title="Welcome to TengaPOS"
    description="A fast, simple POS system built for Zimbabwean businesses."
  />
);

// Step 2
const StepTwo = () => (
  <StepWrapper
    icon={<PackageIcon color="#0ea5e9" strokeWidth={1.2} size={100} />}
    title="Add Your Products"
    description="Easily list your items with name, price, and image."
  />
);

// Step 3
const StepThree = () => (
  <StepWrapper
    icon={<DollarSignIcon color="green" strokeWidth={1.8} size={100} />}
    title="Start Selling"
    description="Make sales, print receipts, and grow your business."
  />
);

const MainPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [<StepOne key="1" />, <StepTwo key="2" />, <StepThree key="3" />];

  useEffect(() => {
    const checkSession = async () => {
      const session = await Store.getItemAsync('session');
      const onboardingCompleted = await Store.getItemAsync('onboardingCompleted');

      if (session) return router.replace('/(tabs)/home');
      if (onboardingCompleted) return router.replace('/(auth)/signin');
    };

    checkSession();
  }, []);

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await Store.setItemAsync('onboardingCompleted', 'true');
      router.replace('/(auth)/signin');
    }
  };

  return (
    <View className="bg-white px-4 h-full flex justify-between items-center py-8">
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={currentStep}
          from={{ opacity: 0, translateX: width }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -width }}
          transition={{ type: 'timing', duration: 500 }}
          className="w-full flex-1"
        >
          {steps[currentStep]}
        </MotiView>
      </AnimatePresence>

      {/* Footer Actions */}
      <View className="w-full items-center mt-4">
        <TouchableOpacity
          onPress={nextStep}
          className="bg-green-600 px-6 py-3 rounded-xl w-full flex items-center justify-center"
        >
          <Text className="text-white font-semibold text-base">
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        <View className="flex flex-row gap-2 mt-6">
          {steps.map((_, i) => (
            <View
              key={i}
              className={`w-2.2 h-2.2 rounded-full ${currentStep === i ? 'bg-green-600' : 'bg-gray-400'}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default MainPage;