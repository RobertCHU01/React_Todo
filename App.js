// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Auth from './src/auth/Auth';
// import Main from './src/app/Main';

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState('');
//   const [username, setUsername] = useState('');
//   const [jwt, setJwt] = useState('');

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     try {
//       const session = await AsyncStorage.getItem('session');
//       if (session) {
//         const sessionData = JSON.parse(session);
//         setIsLoggedIn(true);
//         setUserId(sessionData.sub);
//         setUsername(sessionData.name);
//         setJwt(sessionData.idToken);
//       }
//     } catch (error) {
//       console.error('Error checking login status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (sessionData) => {
//     try {
//       await AsyncStorage.setItem('session', JSON.stringify(sessionData));
//       setIsLoggedIn(true);
//       setUserId(sessionData.sub);
//       setUsername(sessionData.name);
//       setJwt(sessionData.idToken);
//     } catch (error) {
//       console.error('Error during login:', error);
//     }
//   };

//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem('session');
//       setIsLoggedIn(false);
//       setUserId('');
//       setUsername('');
//       setJwt('');
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   if (loading) {
//     return <View><Text>Loading...</Text></View>;
//   }

//   if (isLoggedIn) {
//     return (
//       <Main
//         userId={userId}
//         username={username}
//         token={jwt}
//         logout={logout}
//       />
//     );
//   } else {
//     return <Auth login={login} />;
//   }
// }

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from './src/auth/Auth';
import Main from './src/app/Main';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const session = await AsyncStorage.getItem('session');
      if (session) {
        const sessionData = JSON.parse(session);
        setIsLoggedIn(true);
        setUserId(sessionData.sub);
        setUsername(sessionData.name);
        setJwt(sessionData.idToken);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (sessionData) => {
    try {
      await AsyncStorage.setItem('session', JSON.stringify(sessionData));
      setIsLoggedIn(true);
      setUserId(sessionData.sub);
      setUsername(sessionData.name);
      setJwt(sessionData.idToken);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('session');
      setIsLoggedIn(false);
      setUserId('');
      setUsername('');
      setJwt('');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (isLoggedIn) {
    return (
      <Main
        userId={userId}
        username={username}
        token={jwt}
        logout={logout}
      />
    );
  } else {
    return <Auth login={login} />;
  }
}