import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { Container, Slogan, Title } from "./styles";

import backgorundImg from '../../assets/background.png';
import { Button } from "../../components/Button";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Realm, useApp } from '@realm/react';

WebBrowser.maybeCompleteAuthSession();

export function Signin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  });

  const app = useApp();

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    // setTimeout(() => setIsAuthenticating(false), 1000);

    googleSignIn().then((response) => {
      if (response.type !== 'success') {
        setIsAuthenticating(false);
      }
    });
  }

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication?.idToken) {

        const credentials = Realm.Credentials.jwt(response.authentication.idToken);

        app.logIn(credentials).catch((error) => {
          console.log(error);
          Alert.alert('Entrar', 'Nao foi possivel conectar-se a sua conta Google');
          setIsAuthenticating(true);
        });

      } else {
        Alert.alert('Entrar', 'Nao foi possivel conectar-se a sua conta Google');
        setIsAuthenticating(true);
      }
    }
  }, [response]);

  return (
    <Container source={backgorundImg}>
      <Title>
        Ignite Fleet
      </Title>

      <Slogan>Gestao de uso de veiculos</Slogan>

      <Button
        title="Entrar com o google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  )
}