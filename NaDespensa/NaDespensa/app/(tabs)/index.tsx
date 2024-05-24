import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

interface User {
  id: number;
  name: string;
  age: number;
}

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  
  const loadUsers = async () => {
    try {
      // Ale altera esse IP e o de baixo para o IP da sua máquina
      const response = await fetch('http://192.168.24.17:3000/users');
      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };
  
  //Ale, pra enviar pro meu back você segue essa lógica:
  const handleAddUser = async () => {
    try {
      await fetch('http://192.168.24.17:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age: parseInt(age) }),
      });
      loadUsers();
      setName('');
      setAge('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
        keyboardType="numeric"
      />
      <Button title="Add User" onPress={handleAddUser} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <Text>{item.name}</Text>
            <Text>{item.age}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default App;
