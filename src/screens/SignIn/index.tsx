import { Container, Slogan, Title } from "./styles";

import backgorundImg from '../../assets/background.png';
import { Button } from "../../components/Button";

export function Signin() {
  return (
    <Container source={backgorundImg}>
      <Title>
        Ignite Fleet
      </Title>

      <Slogan>Gestao de uso de veiculos</Slogan>

      <Button title="Entrar com o google"></Button>
    </Container>
  )
}