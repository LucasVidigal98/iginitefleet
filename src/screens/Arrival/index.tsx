import { useNavigation, useRoute } from '@react-navigation/native';
import { AsyncMessage, Container, Content, Description, Footer, Label, LicencePlate } from './styles';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage';

type RouteParamsProps = {
  id: string;
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);

  const route = useRoute();
  const { id } = route.params as RouteParamsProps;

  const historic = useObject(Historic, new BSON.UUID(id));
  const realm = useRealm();

  const { goBack } = useNavigation();

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

  function handleRemoveVehicleUsage() {
    Alert.alert(
      'Cancelar',
      'Cancelar a utilizacao do veiculo?',
      [
        { text: 'Nao', style: 'cancel' },
        { text: 'Sim', onPress: () => removeVehicleUsage() }
      ]
    );
  }

  function removeVehicleUsage() {
    try {
      realm.write(() => {
        realm.delete(historic);
      });

      goBack();
    } catch (error) {
      console.log(error);
    }
  }

  function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert('Error', 'Nao foi possivel obter os dados para registrar a chegada do veiculo.');
      }

      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
      });

      Alert.alert('Chegada', 'Chegada registrada com sucesso.');

      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Nao foi possivel registrar a chegada do veiculo.');
    }
  }

  useEffect(() => {
    getLastSyncTimestamp()
      .then(lastSync => setDataNotSynced(historic!.updated_at.getTime() > lastSync));
  }, []);

  return (
    <Container>
      <Header title={title} />

      <Content>
        <Label>
          Placa do veiculo
        </Label>

        <LicencePlate>{historic?.license_plate}</LicencePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
          {historic?.description}
        </Description>
      </Content>

      {historic?.status === 'departure' && <Footer>
        <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

        <Button
          title='Registrar chegada'
          onPress={handleArrivalRegister}
        />
      </Footer>}

      {
        dataNotSynced &&
        <AsyncMessage>
          Sincronizacao da
          {historic?.status === 'departure' ? ' partida' : ' chegada'} pendente.
        </AsyncMessage>}
    </Container>
  );
}