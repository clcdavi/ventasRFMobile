import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../stores/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2, // 2 minutos
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerShadowVisible: false,
              headerTintColor: '#111111',
              headerTitleStyle: {
                fontFamily: 'SF Pro Display',
                fontWeight: '600',
                fontSize: 16,
              },
              contentStyle: {
                backgroundColor: '#fbfbfa', // Bone/Off-White cálido
              },
            }}
          >
            {/* Flujo de Autenticación */}
            <Stack.Screen 
              name="(auth)" 
              options={{ headerShown: false }} 
            />

            {/* Navegación por Pestañas */}
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
          
          {/* Detalle de Pedido */}
          <Stack.Screen 
            name="pedidos/[id]" 
            options={{ 
              title: 'Detalle de Pedido',
              headerTitleStyle: {
                fontFamily: 'SF Pro Display',
                fontWeight: '600',
                fontSize: 16,
              }
            }} 
          />
          
          {/* Formularios */}
          <Stack.Screen 
            name="pedidos/nuevo" 
            options={{ 
              title: 'Nuevo Pedido', 
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="pedidos/editar" 
            options={{ 
              title: 'Editar Pedido', 
              presentation: 'modal',
            }} 
          />
        </Stack>
      </SafeAreaProvider>
     </AuthProvider>
    </QueryClientProvider>
  );
}
