import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ExpiryProductListScreen from '../screens/ExpiryProductListScreen';
import PreExpiryProductListScreen from '../screens/PreExpiryProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import RecipeListScreen from '../screens/RecipeListScreen';
import ForgotPassword from '../screens/ForgotPassword';
import CreateNewPassowrd from '../screens/CreateNewPassword';
import BarcodeScannerScreen from '../screens/BarcodeScanner';
import Profile from '../screens/Profile';
import Config from '../screens/Config';
import HelpOne from '../screens/HelpOne';
import HelpTwo from '../screens/HelpTwo';
import HelpThree from '../screens/HelpThree';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Esqueceu a senha' }}/>
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassowrd} options={{ title: 'Criar nova senha' }}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }}/>
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Lista de Produtos' }}/>
        <Stack.Screen name="ExpiryProductList" component={ExpiryProductListScreen} options={{ title: 'Produtos Vencidos' }}/>
        <Stack.Screen name="PreExpiryProductList" component={PreExpiryProductListScreen} options={{ title: 'Produtos Próximos ao Vencimento' }}/>
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Adicionar Produto' }}/>
        <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Código de Barras' }}/>
        <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: 'Editar Produto' }} />
        <Stack.Screen name="Recipes" component={RecipeListScreen} options={{ title: 'Receitas' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Perfil' }} />
        <Stack.Screen name="Config" component={Config} options={{ title: 'Configurações' }} />
        <Stack.Screen name="HelpOne" component={HelpOne} options={{ title: 'Ajuda' }} />
        <Stack.Screen name="HelpTwo" component={HelpTwo} options={{ title: 'Ajuda' }} />
        <Stack.Screen name="HelpThree" component={HelpThree} options={{ title: 'Ajuda' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
