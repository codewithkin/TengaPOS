// ...imports remain the same
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import * as Store from 'expo-secure-store';
import {
  Store as StoreIcon,
  Package as PackageIcon,
  DollarSign as DollarSignIcon,
  Check,
  Plus,
  User,
  Verified,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ✅ Common step wrapper
const StepWrapper = ({
  centerContent,
  title,
  description,
}: {
  centerContent: React.ReactNode;
  title: string;
  description: string;
}) => (
  <View className="w-full flex-1 px-4 py-8 gap-40 items-center">
    {/* Top Text */}
    <View className="w-full items-center">
      <Text className="text-2xl font-bold text-center mb-1 dark:text-white">{title}</Text>
      <Text className="text-base text-center text-gray-600 dark:text-gray-400">{description}</Text>
    </View>

    {/* Center Content (icon or custom) */}
    {centerContent}
  </View>
);

// ✅ Step 1
const StepOne = () => (
  <StepWrapper
    centerContent={
      <View className="rounded-full bg-slate-600 p-8 justify-center items-center">
        <StoreIcon color="orange" strokeWidth={1.2} size={100} />
      </View>
    }
    title="Welcome to TengaPOS"
    description="A fast, simple POS system built for Zimbabwean businesses."
  />
);

// ✅ Step 2 Content (animated cards)
const StepTwoCenterContent = () => {
  const items = [
    {
      icon: <User color="white" />,
      bg: 'bg-green-600',
      title: 'Create an account',
      description: 'Sign up with your business name and email',
    },
    {
      icon: <Plus color="white" />,
      bg: 'bg-indigo-600',
      title: 'Add your products',
      description: "Quickly add your business' products to the app",
    },
    {
      icon: <Check color="white" />,
      bg: 'bg-yellow-600',
      title: "You're all set !",
      description: 'Sign up with your business name and email',
    },
  ];

  return (
    <View className="flex flex-col gap-2 items-center w-full">
      {items.map((item, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 400,
            delay: index * 200,
          }}
          className="rounded-xl shadow-md flex flex-row justify-between w-full gap-4 items-center dark:bg-white bg-slate-300 p-4"
        >
          <View className={`rounded-full p-4 ${item.bg} w-14 h-14 flex justify-center items-center`}>
            {item.icon}
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-lg">{item.title}</Text>
            <Text className="text-gray-600 text-sm">{item.description}</Text>
          </View>
        </MotiView>
      ))}
    </View>
  );
};

// ✅ Step 2
const StepTwo = () => (
  <StepWrapper
    centerContent={<StepTwoCenterContent />}
    title="How TengaPOS works"
    description="Get started in 3 easy steps, it's that easy."
  />
);

// ✅ Step 3 Content (animated icon)
const StepThreeCenterContent = () => (
  <MotiView
    from={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'timing', duration: 600 }}
    className="flex flex-col gap-2 items-center p-4"
  >
    <Verified strokeWidth={1.2} size={170} color="white" fill="green" />
  </MotiView>
);

// ✅ Step 3
const StepThree = () => (
  <StepWrapper
    centerContent={<StepThreeCenterContent />}
    title="You're all set !"
    description="Let's get you into TengaPOS"
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

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const skip = async () => {
    await Store.setItemAsync('onboardingCompleted', 'true');
    router.replace('/(auth)/signin');
  };

  return (
    <View className="light:bg-white px-4 h-full flex justify-between items-center py-8">
      {/* Animated Step Screen */}
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

      {/* Footer */}
      <View className="w-full items-center mt-4">
        {/* Pagination Dots */}
        <View className="flex flex-row gap-2 mb-6">
          {steps.map((_, i) => (
            <View
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${currentStep === i ? 'bg-green-600' : 'bg-gray-400'
                }`}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View className="w-full flex-row justify-between gap-3 px-4">
          {/* Back / Skip */}
          <TouchableOpacity
            onPress={currentStep > 0 ? prevStep : skip}
            className="w-1/3 border border-gray-300 dark:border-gray-600 rounded-xl px-6 py-3 items-center"
          >
            <Text className="text-gray-600 dark:text-gray-300 font-semibold text-base">
              {currentStep > 0 ? 'Back' : 'Skip'}
            </Text>
          </TouchableOpacity>

          {/* Next / Get Started */}
          <TouchableOpacity
            onPress={nextStep}
            className="w-2/3 bg-green-600 px-6 py-3 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MainPage;