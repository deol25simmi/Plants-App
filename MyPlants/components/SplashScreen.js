
import React from 'react';
import {View, Text, ImageBackground} from 'react-native';
const  SplashScreen = props => {
  setTimeout(() => {
    props.navigation.replace('Home');
  }, 3000);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ImageBackground
        style={{
          height: 200,
          width: 200,
        }}
        source={require('../images/ic_launcher.png')}
      />
    </View>
  );
};
export default SplashScreen;