import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { ApolloProvider, useMutation, gql } from '@apollo/client';
import apolloClient from '../apollo';
import TodoList from './TodoList';
import Textbox from './Textbox';

const INSERT_USER = gql`
  mutation InsertUser($id: String!, $name: String!) {
    insert_users(objects: [{id: $id, name: $name}], on_conflict: {constraint: users_pkey, update_columns: [name]}) {
      affected_rows
    }
  }
`;

const MainContent = ({ userId, username, logout }) => {
  const [insertUser] = useMutation(INSERT_USER);

  useEffect(() => {
    const insertUserData = async () => {
      try {
        await insertUser({
          variables: { id: userId, name: username }
        });
        console.log('User inserted successfully');
      } catch (error) {
        console.error('Error inserting user:', error);
      }
    };

    insertUserData();
  }, [userId, username, insertUser]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Todo App</Text>
      <Textbox userId={userId} />
      <TodoList userId={userId} />
      <Text style={styles.logoutText} onPress={logout}>Logout</Text>
    </SafeAreaView>
  );
};

const Main = ({ userId, username, logout }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <MainContent userId={userId} username={username} logout={logout} />
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Main;