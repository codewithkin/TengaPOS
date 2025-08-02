import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

const HomeLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "TangaBiz",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "700"
                    }
                }}
            />
        </Stack>
    )
}

export default HomeLayout