import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Container, Content } from './styles';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';

const keyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePalte, setLicensePalte] = useState('');
  const [isRegistering, setInsregistering] = useState(false);

  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePalte)) {
        licensePlateRef.current?.focus();
        return Alert.alert('Placa invalida', 'A placa e invalida. Por favor, informe a placa correta do veiculo.');
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilizacao do veiculo.');
      }

      setInsregistering(true);

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

  return (
    <Container>
      <Header title='Saida' />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingViewBehavior}>
        <ScrollView>
          <Content>
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