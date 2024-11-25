import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import axios from 'axios';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Erro', 'Por favor, insira seu email');
            return;
        }

        try {
            const response = await axios.post('http://192.168.24.5:3000/forgot-password', { email });

            if (response.data.success) {
                Alert.alert(
                    'Sucesso', 
                    'Instruções para redefinir a senha foram enviadas para seu email',
                    [{ text: 'OK', onPress: () => navigation.navigate('InsertCode', { email }) }]
                );
            } else {
                Alert.alert('Erro', 'Não foi possível enviar as instruções. Tente novamente.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Alert.alert('Erro', 'Nenhum usuário com o email informado encontrado');
            } else {
                Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
            }
            console.error(error);
        }
        const response = await axios.post('http://192.168.24.5:3000/send-reset-email', { email });

        console.log(response.data);
    };



    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image style={styles.design} source={require('../assets/desingtopright.png')} />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.back} source={require('../assets/back.png')} />
                    <Text style={styles.voltar}>Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Esqueceu a senha?</Text>
                <Text style={styles.subtitle}>Redefina a senha em duas etapas</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Image style={styles.icon} source={require('../assets/email.png')} />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
                <Image style={styles.designunder} source={require('../assets/designunder.png')} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 220,
    },
    design: {
        width: 220,
        height: 200,
        position: 'absolute',
        right: "-10%",
        top: 0,
    },
    back: {
        width: 20,
        height: 20,
        marginTop: 50,
        marginBottom: 10,
    },
    voltar: {
        color: '#3CB371',
        fontSize: 16,
        marginTop: -30,
        marginLeft: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 30,
        color: '#3CB371',
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#3CB371',
        marginBottom: 20,
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#3CB371',
        borderRadius: 5,
        padding: 10,
        paddingLeft: 40,
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    button: {
        backgroundColor: '#3CB371',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    designunder: {
        width: '115%',
        height: 200,
        position: 'absolute',
        display: 'flex',
        bottom: -35,
        left: 0,
    },
});

export default ForgotPassword;
