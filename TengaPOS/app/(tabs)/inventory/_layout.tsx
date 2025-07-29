import { Stack } from 'expo-router';

const HomeLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Inventory",
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