import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';

export const FETCH_TODOS = gql`
  query FetchTodos($userId: String!) {
    todos(where: {user_id: {_eq: $userId}}) {
      id
      text
      is_completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    delete_todos(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`;

const TodoList = ({ userId }) => {
  const { loading, error, data } = useQuery(FETCH_TODOS, {
    variables: { userId },
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data: { delete_todos } }, { variables: { id } }) {
      const existingTodos = cache.readQuery({
        query: FETCH_TODOS,
        variables: { userId }
      });
      if (existingTodos && existingTodos.todos) {
        cache.writeQuery({
          query: FETCH_TODOS,
          variables: { userId },
          data: {
            todos: existingTodos.todos.filter(todo => todo.id !== id)
          }
        });
      }
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
    }
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleDelete = (id) => {
    deleteTodo({ 
      variables: { id },
      optimisticResponse: {
        delete_todos: {
          affected_rows: 1,
          __typename: 'todos_mutation_response'
        }
      }
    });
  };

  return (
    <FlatList
      data={data.todos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.todoItem}>
          <Text style={item.is_completed ? styles.completedTodo : styles.todoText}>
            {item.text}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoText: {
    fontSize: 16,
  },
  completedTodo: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    color: 'red',
  },
});

export default TodoList;