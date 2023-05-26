import React from 'react';
import { Container, IconBox, Message, TextHighlight } from './styles';
import { Car, Key } from 'phosphor-react-native';
import theme from '../../theme';
import { TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  licensePlate?: string;
}

export function CarStatus({ licensePlate = undefined, ...rest }: Props) {
  const Icon = licensePlate ? Key : Car;
  const message = licensePlate ? `Veiculo ${licensePlate} em uso. ` : 'Nenhum veiculo em uso. ';
  const status = licensePlate ? 'chegada' : 'saida';

  return (
    <Container {...rest}>
      <IconBox>
        <Icon
          size={32}
          color={theme.COLORS.BRAND_LIGHT}
        />
      </IconBox>

      <Message>
        {message}

        <TextHighlight>
          Clique aqui para registrar a {status}
        </TextHighlight>
      </Message>
    </Container>
  );
}