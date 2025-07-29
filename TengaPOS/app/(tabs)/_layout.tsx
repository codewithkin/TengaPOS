import { Tabs } from 'expo-router'
import { Home, Users, ShoppingCart, Box } from 'lucide-react-native'

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#16a34a', // Tailwind's green-600
                tabBarInactiveTintColor: '#64748b', // Tailwind's slate-500
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="sales"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Sales',
                    tabBarIcon: ({ color, size }) => (
                        <ShoppingCart color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="inventory"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Inventory',
                    tabBarIcon: ({ color, size }) => (
                        <Box color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="customers"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Customers',
                    tabBarIcon: ({ color, size }) => (
                        <Users color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}

export default TabsLayout
