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
import InsertCode from '../screens/InsertCode';
import CreateNewPassowrd from '../screens/CreateNewPassword';
import BarcodeScannerScreen from '../screens/BarcodeScanner';
import Profile from '../screens/Profile';
import Config from '../screens/Config';
import Saves from '../screens/Saves';
import Help from '../screens/Help';
import SetNewPassword from '../screens/SetNewPassword'
import SetNewEmail from '../screens/SetNewEmail'
import SetNewName from '../screens/SetNewName'
import SetNewPhone from '../screens/SetNewPhone'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Esqueceu a senha' }}/>
        <Stack.Screen name="InsertCode" component={InsertCode} options={{ title: 'Inserir Código' }}/>
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
        <Stack.Screen name="Saves" component={Saves} options={{ title: 'Salvos' }} />
        <Stack.Screen name="Help" component={Help} options={{ title: 'Ajuda' }} />
        <Stack.Screen name='SetNewPassword' component={SetNewPassword} options={{ title: 'Alterar Senha' }} />
        <Stack.Screen name='SetNewEmail' component={SetNewEmail} options={{ title: 'Alterar E-mail' }} />
        <Stack.Screen name='SetNewName' component={SetNewName} options={{ title: 'Alterar Nome de usuário' }} />
        <Stack.Screen name='SetNewPhone' component={SetNewPhone} options={{ title: 'Alterar número de telefone' }} />        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
