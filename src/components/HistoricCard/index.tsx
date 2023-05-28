import { TouchableOpacityProps } from 'react-native';
import { Container, Departure, Info, LicencePlate } from './styles';
import { Check, ClockClockwise } from 'phosphor-react-native';
import { useTheme } from 'styled-components/native';

export type HistoricCardsProps = {
  licensePlate: string;
  created: string;
  isSync: boolean;
  id: string;
}

type Props = TouchableOpacityProps & {
  data: HistoricCardsProps;
}

export function HistoricCard({ data, ...rest }: Props) {
  const Icon = data.isSync ? Check : ClockClockwise;

  const { COLORS } = useTheme();

  return (
    <Container activeOpacity={0.7} {...rest}>
      <Info>
        <LicencePlate>
          {data.licensePlate}
        </LicencePlate>

        <Departure>
          {data.created}
        </Departure>
      </Info>

      <Icon
        size={24}
        color={data.isSync ? COLORS.BRAND_LIGHT : COLORS.GRAY_400}
      />
    </Container>
  );
}