import * as React from 'react';
import {
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Button
} from 'react-native';
import Constants from 'expo-constants';

export default class PhotoStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true, 
      dataSource: [],
    };
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }



  componentDidMount() {
    return fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(responseJson => {
        this.setState(() => {
          return { 
            isLoading: false,
            dataSource: responseJson
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.wrapper}>
        <FlatList
          data = {this.state.dataSource}
          keyExtractor={(item, index) => item.id}
          renderItem={renderItem}
          style={styles.container}
          horizontal
          pagingEnabled
          extraData={this.state}
        />
        <Button
          onPress={() => {
            var newArr = this.shuffle(this.state.dataSource);
            this.setState(() => {
              return { 
                isLoading: false,
                dataSource: newArr 
              }
            });
          }}
          title="Shuffle Slides"
          color="#841584"
          accessibilityLabel="Shuffle Slides"
        />
      </View>
    );
  }
}

const deviceWidth = Dimensions.get('window').width;
const renderItem = ({item}) => {
  return (
    <View style={styles.viewbox}>
      <View style={styles.content}>
        <ImageBackground
          source={{
            uri: item.url,
            cache: 'force-cache',
          }}
          style={styles.imgbg}
          imageStyle={styles.imgbg}>
          <Text style={styles.txt}>{item.title}</Text>
        </ImageBackground>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgbg: {
    width: "100%",
    height: "100%",
    borderRadius:10,
    resizeMode:"cover",
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    width: 180,
    textAlign: "justify",
    fontSize: 16,
  },
  content: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
    borderWidth: 0.5,
    borderColor: '#000000',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    position: "relative",
    elevation: 5,
    zIndex: 1
  },
  viewbox: {
    width: deviceWidth,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginTop: 30,
    height: "60%",
  },
});
