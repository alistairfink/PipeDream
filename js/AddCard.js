import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Platform, 
  Image, 
  Dimensions, 
  Button, 
  TouchableHighlight, 
  ToastAndroid, 
  BackHandler,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  NetInfo,
  TextInput,
  FlatList,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import CommonStyles from './CommonStyles';

const win = Dimensions.get('window');//Viewport

class AddCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      search: '',
      masterList: null,
      searchList: null,
    };
    this.cardList = [];
  }
  componentWillMount() {
    this.pullStorageData();
  }
  async save(item) {
    //Checks if crypto is already in card storage
    for(let i = 0; i < this.cardList.length; i++)
    {
      if(this.cardList[i].id === item.id){
        ToastAndroid.show('Cryptocurrency Card Already Added', ToastAndroid.SHORT);
        return;
      }
    }
    //If its not then push it to the cardList array and save.
    this.cardList.push(item);
    await AsyncStorage.setItem('CardList', JSON.stringify(this.cardList));
    let retrieveCards = await AsyncStorage.getItem('CardList');
    this.props.navigation.state.params.onGoBack('mainView');
    this.props.navigation.goBack();
  }
  async pullStorageData() {
    //Get master list and card list. Unfiltered searchList == masterlist
    let retrieveMaster = await AsyncStorage.getItem('MasterList');
    retrieveMaster = retrieveMaster ? JSON.parse(retrieveMaster) : [];
    this.setState({masterList: retrieveMaster, searchList: retrieveMaster});
    let retrieveCards = await AsyncStorage.getItem('CardList');
    this.cardList = retrieveCards ? JSON.parse(retrieveCards) : [];
  } 
  handleSearch(_input) {
    //Gets input string and sets lowercase to ignore case.
    let input = _input.toLowerCase();
    let masterList = this.state.masterList;
    //Checks each item to see if it matches. If it does it stays
    let searchList = masterList.filter((item) => {
      if(item.name.toLowerCase().includes(input))
        return item;
    })
    //If there is no search string then searchList == masterList
    if(!input || input === '')
    {
      this.setState({searchList: masterList});
    }
    else
    {
      this.setState({searchList: searchList});
    }
  }
  async search(_input) {
    //For searching. Basically piggybacking off this component and onecrypto component. 2 Places in render below with conditional for search/addcard
    let responseObj = null;
    try
    {
      await fetch('https://api.coinmarketcap.com/v1/ticker/'+_input.id,{
              method: 'GET'
            })
            .then( (response) => response.json()) 
            .then((responseJson) => { 
              responseObj = responseJson[0];
            })
      this.props.navigation.navigate('OneCrpyto',responseObj);
    }
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
  }
  render() {
    const { params } = this.props.navigation.state;//Get params.
    return (
      <View style={CommonStyles.container}>
        <View style={CommonStyles.topBar}>{/*Top Bar*/}
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/cancelIcon.png')} style={CommonStyles.backIcon}/>
          </TouchableOpacity>
          {params.passThrough ? (
            <Text style={CommonStyles.title}>Search</Text>
            ) : (  
            <Text style={CommonStyles.title}>Add Card</Text>
          )}
        </View>
        <View style={styles.searchBar}>{/*Search Bar*/}
          <TouchableOpacity style={{ justifyContent: 'center'}} onPress={() => {
            this.handleSearch('');
            this.setState({search: ''});
          }}>
            <Image source={require('../assets/clearSearchIcon.png')} style={styles.clearSearch}/>
          </TouchableOpacity>
          <TextInput
            placeholder={'Search...'}
            style={styles.searchTextInput}
            value={this.state.search}
            onChangeText={(value) =>{
              this.handleSearch(value);
              this.setState({search: value});
            }}
          />
        </View>
          {/*All the cryptocurrency name tiles*/}
          <FlatList
            data={this.state.searchList}
            keyExtractor={(x, i) => i}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => {
                  if(params.passThrough)
                  {
                    this.search(item);
                  }
                  else
                  {
                    this.save(item);
                  }
                }} 
              >
                <View style={styles.searchTiles}>
                  <Text style={styles.searchTilesTitle}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row-reverse'  
  },
  searchTextInput: {
    marginLeft: 10, 
    marginRight: 10,
    flex: 1,
  },
  searchTiles: {
    marginRight: 10,
    marginLeft: 10, 
    marginTop: 10, 
    flex: 1, 
    backgroundColor: 'green', 
    alignItems: 'center',
    borderRadius: 5,
  },
  searchTilesTitle: {
    color: 'white', 
    marginTop: 10, 
    marginBottom: 10,
  },
  clearSearch: {
    width: 25, 
    height: 25,
    marginRight: 10,
  },
});

export default AddCard;