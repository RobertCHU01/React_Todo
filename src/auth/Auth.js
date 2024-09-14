import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { jwtDecode } from "jwt-decode";

WebBrowser.maybeCompleteAuthSession();

const auth0ClientId = 'PBALBwLDwm1R6zW9r1xN6ttSY9e9dDhi';
const auth0Domain = 'https://dev-zvf16tcmsff5y7l3.us.auth0.com';

const discovery = {
  authorizationEndpoint: `${auth0Domain}/authorize`,
  tokenEndpoint: `${auth0Domain}/oauth/token`,
};

const Auth = ({ login }) => {
  const [error, setError] = React.useState(null);

  const redirectUri = makeRedirectUri({
    scheme: "mytodoapp"
  });

  console.log('Redirect URI:', redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: auth0ClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: "token id_token",
      extraParams: {
        nonce: 'nonce'
      },
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      
      console.log('ID Token:', id_token);
      console.log('Access Token:', access_token);

      if (!id_token) {
        setError('No ID token received');
        return;
      }

      try {
        const decodedToken = jwtDecode(id_token);
        console.log('Decoded Token:', decodedToken);
        login(decodedToken);
      } catch (e) {
        console.error('Error decoding token:', e);
        setError(`Error decoding token: ${e.message}`);
      }
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
      setError(`Authentication error: ${response.error.message}`);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          setError(null);
          promptAsync();
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Auth;