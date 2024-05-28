import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import RecipeListScreen from '../screens/RecipeListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }}/>
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Lista de Produtos' }}/>
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Adicionar Produto' }}/>
        <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: 'Editar Produto' }} />
        <Stack.Screen name="Recipes" component={RecipeListScreen} options={{ title: 'Receitas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
