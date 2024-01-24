import React, {useState, useEffect} from 'react';
import { ImageBackground,Button, View, StyleSheet, Text, ToastAndroid, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator, Platform, FlatList, RefreshControl, TextInput} from 'react-native';
import Results from './Results';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';
const Home =() => {
   const [image, setImage] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [results, setResults] = useState({});
     

  const camera = options => {
    console.log('inside camera');

    launchCamera(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
        Alert.alert(res.error);
      } else {

        setImage(res);
      }
    });
  };

  //get picture of  leaf from gallery
  const library = options => {
    
    launchImageLibrary(options, res => {
    
      if (res.didCancel) {
        console.log('User cancelled image picker');
        Alert.alert('You did not select any image');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      }  else {
        setImage(res);
      }
    });
  };

  //select leaf picture
  const selectFile = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    Alert.alert('Select Image', '', [
      {
        text: 'cancel',
        onPress: console.log('cancel'),
        style: 'cancel',
      },
      {
        text: 'Take a photo',
        onPress: () => camera(options),
      },
      {
        text: 'Choose from library',
        onPress: () => library(options),
      },
    ]);
  };

  //send image to server
  const scan = () => {
    setAnimating(true);  
    if (image === null) {
      Alert.alert('You did not select any image');
      setAnimating(false);
    } else {
      let data = new FormData();
      data.append('image', {
        name: image.fileName,
        type: image.type,
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', '')
      });

     console.log(image);
      fetch('url', {
       method: 'POST',
       headers: {
         'Content-Type': 'multipart/form-data',
         'Accept-Encoding': 'gzip, deflate',
       },
       body: data,
     })
       .then(res => {
         if (!res.ok) {
           Alert.alert('Server error');
           throw new Error('Network response was not ok');
         }
          return res.json();
        })
        .then(data => {
          // stop loader
          setAnimating(false);
          console.log(data);
          // display results

          setResults(data);
        })
        .catch(err => {
          Alert.alert('There was an error in scanning the picture');
          console.log(err);
          // Alert.alert(err);
          setAnimating(false);
        });
     
      
    }
  };




  return (

    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 19}}>
        <View style={styles.placeholderView}>
            <Image style={styles.placeholder} source={image == null? require('../images/placeholder_image.jpeg'):{uri:image.uri}}/>
          </View>

        <TouchableOpacity style={styles.button} onPress={selectFile}>
          <Text style={styles.text}>LOAD IMAGE</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={styles.button_2} onPress={scan} >
            <Text style={styles.text}>SCAN</Text>
          </TouchableOpacity>

          <ActivityIndicator
          animating ={animating}
            style={{marginTop: 20, marginBottom: 20}}
            size="large"
            color="#fff"
          />

          </View>
           <View ><Results results={results} /></View>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 0,
  },
  button: {
    backgroundColor: '#b61500',
    marginTop: 80,
    borderWidth: 1,
    padding: 8,
    height: 35,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  button_2: {
    backgroundColor: '#b61500',
    marginTop: 80,
    borderWidth: 1,
    padding: 8,
    height: 35,
    width: 70,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  button_3: {
    backgroundColor: '#b61500',
    // marginTop: 50,
    borderWidth: 1,
    // padding: 8,
    height: 55,
    width: 100,
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  placeholder: {
    width: 200,
    height: 200,
    marginTop: 60,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
    margin: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0,
    color: '#fff',
    fontSize: 18,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
});


export default Home;
