import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';


const HelpThree = ({ navigation, route }) => {
  const { userId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

  return (
    <View style={styles.container}>
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => handleNavigate('Profile')} style={styles.backContainer}>
            <Text style={styles.skip}>Pular</Text>
        </TouchableOpacity>
            <Image source={require('../assets/help3.png')} style={styles.image} />
        <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Profile')}>
            <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
    },
    design: {
        width: 220,
        height: 200,
        position: 'absolute',
        right: "-5%",
        top: "-2%",
    },
    backContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginTop: '25%',
        color: '#3CB371',
    },
    skip: {
        color: '#3CB371',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
      width: '100%',
      height: '100%',
      maxWidth: 375,
      maxHeight: 450,
      marginTop: '20%',
    },
    button: {
      backgroundColor: '#3CB371',
      padding: 20,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
    },
});


export default HelpThree;