import { Container, Content } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';

export function Home() {

  const navigation = useNavigation();

  function handleRegisterMovent() {
    navigation.navigate('departure');
  }

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus onPress={handleRegisterMovent} />
      </Content>
    </Container>
  );
}