import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const NavigationFooter = ({ handleNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <TouchableOpacity onPress={() => handleNavigate('Dashboard')}>
          <Image style={styles.icon1} source={require('../assets/despensa.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Profile')}>
          <Image style={styles.icon2} source={require('../assets/perfilgreen.png')}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('Config')}>
          <Image style={styles.icon3} source={require('../assets/config.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        top: '20%',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
      },      
    container2:{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
    },
      icon1: {
        margin: 'auto',
        left: 10,
        top: '-15%',
        bottom: 0,
        maxWidth: 55,
        maxHeight: 55,
      },
      icon2: {
        margin: 'auto',
        top: '-15%',
        left: 10,
        bottom: 0,
        maxWidth: 65,
        maxHeight: 55,
      },
      icon3: {
        margin: 'auto',
        top: '-15%',
        bottom: 0,
        left: 10,
        maxWidth: 95,
        maxHeight: 60,
      },
  });
  
  export default NavigationFooter;