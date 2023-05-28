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

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardsProps[]>([]);

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

  function fetchHistoric() {
    try {
      const response = historic.filtered("status = 'arrival' SORT(created_at DESC)");

      const formattedHistoric = response.map((item) => ({
        id: item._id!.toString(),
        licensePlate: item.license_plate,
        created: dayjs(item.created_at).format('[Saida em] DD/MM/YYYY HH:mm'),
        isSync: false
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

  return (
    <Container>
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