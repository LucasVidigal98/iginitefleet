import { Container, Content, Label, Title } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { HistoricCard, HistoricCardsProps } from '../../components/HistoricCard';
import dayjs from 'dayjs';
import { getLastSyncTimestamp, saveLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import Toast from 'react-native-toast-message';
import { TopMessage } from '../../components/TopMessage';
import { CloudArrowUp } from 'phosphor-react-native';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardsProps[]>([]);
  const [percentageTosync, setPercentageTosync] = useState<string | null>();

  const navigation = useNavigation();

  const historic = useQuery(Historic);
  const realm = useRealm();

  function handleRegisterMovent() {
    if (vehicleInUse?._id) {
      return navigation.navigate('arrival', { id: vehicleInUse._id.toString() });
    }

    navigation.navigate('departure');
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0];

      setVehicleInUse(vehicle);
    } catch (error) {
      console.log(error);
      Alert.alert('Veiculo em uso', 'Nao foi possivel carregar o veiculo em uso.');
    }
  }

  async function fetchHistoric() {
    try {
      const response = historic.filtered("status = 'arrival' SORT(created_at DESC)");

      const lastSync = await getLastSyncTimestamp();

      const formattedHistoric = response.map((item) => ({
        id: item._id!.toString(),
        licensePlate: item.license_plate,
        created: dayjs(item.created_at).format('[Saida em] DD/MM/YYYY HH:mm'),
        isSync: lastSync > item.updated_at!.getTime(),
      }));

      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      console.log(error);
      Alert.alert('Historico', 'Nao foi possivel carregar o historico.');
    }
  }

  function handleHistoricDetails(id: string) {
    navigation.navigate('arrival', { id });
  }

  async function progressNotification(transferred: number, transferable: number) {
    const percentage = (transferred / transferable) / 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      await fetchHistoric();
      setPercentageTosync(null);

      Toast.show({
        type: 'info',
        text1: 'Todos os dados estao sincronizados.'
      });
    }

    if (percentage < 100) {
      setPercentageTosync(`${percentage.toFixed(0)}% sincronizado.`);
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse);
      }
    }
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      Toast.show({
        type: 'info',
        text1: 'Voce nao esta sincronizado.'
      });

      return;
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => syncSession.removeProgressNotification(progressNotification);
  }, [realm]);

  return (
    <Container>
      {
        percentageTosync && <TopMessage title={percentageTosync} icon={CloudArrowUp} />
      }

      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovent}
        />

        <Title>Historico</Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={(<Label> Nenhum veiculo utilizado </Label>)}
        />
      </Content>
    </Container>
  );
}