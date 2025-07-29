import { Stack } from 'expo-router'

const AuthLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="(auth)/signin"
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="(auth)/signup"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default AuthLayout