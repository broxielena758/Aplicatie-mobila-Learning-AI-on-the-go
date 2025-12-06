import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="learning"
                options={{
                    title: 'Learning',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="photography"
                options={{
                    title: 'Photography',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="portfolio"
                options={{
                    title: 'Portfolio',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="contests"
                options={{
                    title: 'Contests',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="age-select"
                options={{
                    title: 'Select Course Path',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
