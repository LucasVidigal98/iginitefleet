import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Signin } from './src/screens/SignIn';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/theme';
import { Loading } from './src/components/Loading';
import { StatusBar } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="trasnparent" translucent />
      <Signin />
    </ThemeProvider>
  );
}

