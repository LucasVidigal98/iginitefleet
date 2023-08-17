import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Container, Content, Message } from './styles';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import { LocationAccuracy, LocationObjectCoords, LocationSubscription, requestBackgroundPermissionsAsync, useForegroundPermissions, watchPositionAsync } from 'expo-location';
import { getAdressLocation } from '../../utils/getAdressLocation';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { Car } from 'phosphor-react-native';
import { Map } from '../../components/Map';
import { startLocationTask } from '../../tasks/backGroudLocationTaks';

const keyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePalte, setLicensePalte] = useState('');
  const [isRegistering, setInsregistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAdress, setCurrentAdress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null);

  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions();

  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePalte)) {
        licensePlateRef.current?.focus();
        return Alert.alert('Placa invalida', 'A placa e invalida. Por favor, informe a placa correta do veiculo.');
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilizacao do veiculo.');
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert('Localizacao', 'Nao foi possivel obter a localizacao atual. Tente novamente!');
      }

      setInsregistering(true);

      const backgroudPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroudPermissions.granted) {
        setInsregistering(false);

        return Alert.alert('Localizacao', 'E necessario permitir que o App tenha acesso em segundo plano.');
      }

      await startLocationTask();

      realm.write(() => {
        realm.create('Historic', Historic.generate({
          description,
          license_plate: licensePalte.toUpperCase(),
          user_id: '507f191e810c19729de860ea' // user!.id
        }));
      });

      Alert.alert('Saida', 'Saida do veiculo registrada com sucesso');

      goBack();
    } catch (error) {
      setInsregistering(false);
      console.log(error);
      Alert.alert('Erro', 'Nao foi possivel registrar a saida do veiculo.')
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      console.log(location.coords)
      setCurrentCoords(location.coords);
      getAdressLocation(location.coords)
        .then((adress) => { if (adress) { setCurrentAdress(adress) } })
        .finally(() => setIsLoadingLocation(false));
    }).then((response) => subscription = response);

    return () => {
      if (subscription) {
        return subscription.remove();
      }
    };
  }, []);

  if (!locationForegroundPermission) {
    return (
      <Container>
        <Header title='Saida' />

        <Message>
          Voce precisa pemitir que o aplicativo tenha acesso a localizacao.
        </Message>
      </Container>
    )
  }

  // if (isLoadingLocation) {
  //   return <Loading />
  // }

  return (
    <Container>
      <Header title='Saida' />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingViewBehavior}>
        <ScrollView>
          {<Map coordinates={[
            { latitude: 37.4217937, longitude: -122.083922 },
            { latitude: 37.4250999, longitude: -122.083922 }
          ]} />}

          <Content>
            {
              currentAdress && <LocationInfo icon={Car} label='Localizacao atual' description={currentAdress} />
            }


            <LicensePlateInput
              label='Placa do veiculo'
              placeholder='BRA1234'
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next'
              onChangeText={setLicensePalte}
              ref={licensePlateRef}
            />

            <TextAreaInput
              label='Finalidade'
              placeholder='Vou utilizar esse veiculo para...'
              ref={descriptionRef}
              onSubmitEditing={handleDepartureRegister}
              returnKeyType='send'
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title='Registrar saida'
              onPress={handleDepartureRegister}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}