import { TouchableOpacity } from 'react-native';
import { Container, Greeting, Message, Name, Picture } from './styles';
import { Power } from 'phosphor-react-native';
import theme from '../../theme';
import { useUser, useApp } from '@realm/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeHeader() {
  const user = useUser();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  function handleLogout() {
    app.currentUser?.logOut();
  }

  return (
    <Container style={{ paddingTop: paddingTop }}>
      <Picture
        source={{ uri: 'https://github.com/lucasvidigal98.png' }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj["
      />

      {/* <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj["
      /> */}

      <Greeting>
        <Message>
          Ola
        </Message>

        <Name>
          Lucas
        </Name>
        {/* 
        <Name>
          {user?.profile.name}
        </Name> */}

      </Greeting>

      <TouchableOpacity activeOpacity={0.7}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}