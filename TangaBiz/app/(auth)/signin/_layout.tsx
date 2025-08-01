import { Stack } from 'expo-router'
import { View, Text } from 'react-native'

const SignInLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default SignInLayout