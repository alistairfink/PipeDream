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

class Converter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      masterList: null,
      topCrypto: null,
      bottomCrypto: null,
      searchTop: false,
      searchBottom: false,
      search: '',
      searchListTop: [],
      searchListBottom: [],
      topCryptoVal: 0,
      bottomCryptoVal: 0,
    };
  }
  componentWillMount() {
    this.pullStorageData();
  }
  async pullStorageData() {
    //Get master list and card list. Unfiltered searchList == masterlist
    let retrieveMaster = await AsyncStorage.getItem('MasterList');
    retrieveMaster = retrieveMaster ? JSON.parse(retrieveMaster) : [];
    this.setState({masterList: retrieveMaster});
  }
  chooseCurr(TopBottom){
    //When opening search list.
    this.setState({search: ''});
    if(TopBottom === 'topCrypto')
    {
      this.setState({searchListTop: this.state.masterList, searchTop: true});
    } 
    else if(TopBottom === 'bottomCrypto')
    {
      this.setState({searchListBottom: this.state.masterList, searchBottom: true});
    }
  }
  handleSearch(_input, _list) {
    //Same as AddCard.js
    let input = _input.toLowerCase();
    let masterList = this.state.masterList;
    let searchList = masterList.filter((item) => {
      if(item.name.toLowerCase().includes(input))
        return item;
    })
    if(!input || input === '')
    {
      this.setState({[_list]: masterList});
    }
    else
    {
      this.setState({[_list]: searchList});
    }
  }
  async pickCrypt(TopBottom, crypto){
    //Gets called when you pick a crypto then fetches data.
    let responseCrypto = '';
    if(TopBottom === 'topCrypto')
    {
      this.setState({searchTop: false});
    }
    else if(TopBottom === 'bottomCrypto')
    {
      this.setState({searchBottom: false});
    }
    await fetch('https://api.coinmarketcap.com/v1/ticker/'+crypto.id,{
            method: 'GET'
          })
          .then( (response) => response.json()) 
          .then((responseJson) => { 
            responseCrypto = responseJson[0];
          })
    this.setState({[TopBottom]: responseCrypto, topCryptoVal: 0, bottomCryptoVal: 0});
  }
  convertCrypto(to, val, fromUSD, toUSD)
  {
    if(!(isFinite(val)))
    {
      ToastAndroid.show('Inputed Value Too Large', ToastAndroid.SHORT);
      this.setState({topCryptoVal: 0, bottomCryptoVal: 0});
      return;
    }
    //Converts Crypto -> USD -> Other Crypto since all the cryptos share USD and BTC prices.
    if(this.state.topCrypto && this.state.bottomCrypto)
    {
      val = val*fromUSD/toUSD;
      this.setState({[to]: val});
    }
  }
  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={CommonStyles.topBar}>{/*Top Bar*/}
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/backIcon.png')} style={CommonStyles.backIcon}/>
          </TouchableOpacity>
          <Text style={CommonStyles.title}>Converter</Text>
        </View>
        <View style={{flex: 0.5, borderBottomWidth: 4, borderBottomColor: 'gray'}}>{/*Top Crypto*/}
          <Button title={'Change Currency'} onPress={() => {
            if(!(this.state.searchTop) && !(this.state.searchBottom))
              this.chooseCurr('topCrypto');
          }}/>
          {this.state.topCrypto &&
            <View>{/*Only appears after u pick a crypto up top*/}
              <Text style={{color: 'white'}}>{this.state.topCrypto.name}   {this.state.topCrypto.price_usd}</Text>
              <TextInput 
                keyboardType={'numeric'}
                style={{color: 'white'}}
                value={""+this.state.topCryptoVal}
                onChangeText={(value) =>{
                  //value = parseFloat(value);
                  if(!(isNaN(value)) && value!=="")
                  {
                    if(value.charAt(value.length-1)===".")
                    {
                      value = parseFloat(value);
                      value += '.';
                    }
                    else
                    {
                      value = parseFloat(value);
                    }
                    this.setState({topCryptoVal: value});
                    this.convertCrypto('bottomCryptoVal', value, this.state.topCrypto.price_usd, this.state.bottomCrypto.price_usd);
                  }
                  else if(value === '')
                  {
                    this.setState({topCryptoVal: 0});
                    this.convertCrypto('bottomCryptoVal', 0, this.state.topCrypto.price_usd, this.state.bottomCrypto.price_usd);
                  }
                  else if(isNaN(value) && value.charAt(value.length-1)!=".")
                  {
                  }
                }}
              />
            </View>
          }
        </View>
        <View style={{flex: 0.5, borderTopWidth: 4, borderTopColor: 'gray'}}>{/*Same as top crypto but on bottom*/}
          <Button title={'Change Currency'} onPress={() => {
            if(!(this.state.searchTop) && !(this.state.searchBottom))
              this.chooseCurr('bottomCrypto');
          }}/>
          {this.state.bottomCrypto &&
            <View>
              <Text style={{color: 'white'}}>{this.state.bottomCrypto.name}   {this.state.bottomCrypto.price_usd}</Text>
              <TextInput 
                keyboardType={'numeric'}
                style={{color: 'white'}}
                value={""+this.state.bottomCryptoVal}
                onChangeText={(value) =>{
                  //value = parseFloat(value);
                  if(!(isNaN(value)) && value!=="")
                  {
                    if(value.charAt(value.length-1)===".")
                    {
                      value = parseFloat(value);
                      value += '.';
                    }
                    else
                    {
                      value = parseFloat(value);
                    }
                    this.setState({bottomCryptoVal: value});
                    this.convertCrypto('topCryptoVal', value, this.state.bottomCrypto.price_usd, this.state.topCrypto.price_usd);
                  }
                  else if(value === '')
                  {
                    this.setState({bottomCryptoVal: 0});
                    this.convertCrypto('topCryptoVal', 0, this.state.bottomCrypto.price_usd, this.state.topCrypto.price_usd);
                  }
                  else if(isNaN(value) && value.charAt(value.length-1)!=".")
                  {
                  }
                }}
              />
            </View>
          }
        </View>{/*Below are search windows. Possibly make better by making one then taking values from array. Lazy tho.*/}
        {this.state.searchTop &&
          <View style={styles.searchWindow}>
            <TextInput
              placeholder={'Search...'}
              style={styles.searchTextInput}
              value={this.state.search}
              onChangeText={(value) =>{
                this.handleSearch(value, 'searchListTop');
                this.setState({search: value});
              }}
            />
            <FlatList
              data={this.state.searchListTop}
              keyExtractor={(x, i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => {
                    this.pickCrypt('topCrypto', item);
                  }} 
                >
                  <View style={styles.searchTiles}>
                    <Text style={styles.searchTilesTitle}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.searchWindowChin}>
              <TouchableOpacity style={styles.searchWindowCancel} onPress={() => this.setState({searchTop: false})}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        {this.state.searchBottom &&
          <View style={styles.searchWindow}>
            <TextInput
              placeholder={'Search...'}
              style={styles.searchTextInput}
              value={this.state.search}
              onChangeText={(value) =>{
                this.handleSearch(value, 'searchListBottom');
                this.setState({search: value});
              }}
            />
            <FlatList
              data={this.state.searchListBottom}
              keyExtractor={(x, i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => {
                    this.pickCrypt('bottomCrypto', item);
                  }} 
                >
                  <View style={styles.searchTiles}>
                    <Text style={styles.searchTilesTitle}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.searchWindowChin}>
              <TouchableOpacity style={styles.searchWindowCancel} onPress={() => this.setState({searchBottom: false})}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'white',
  },
  searchTextInput: {
    marginLeft: 10, 
    marginRight: 10,
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
  searchWindow: {
    position: 'absolute', 
    left: 40, 
    width: win.width-80, 
    top: 80, 
    height: win.height-160, 
    backgroundColor: 'lightblue', 
    borderWidth: 2, 
    borderColor: 'green',
  },
  searchWindowChin: {
    height: 40, 
    backgroundColor: 'green', 
    borderTopColor: 'black', 
    borderTopWidth: 2,
  },
  searchWindowCancel: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  cancelText: {
    color: 'white',
  },
});

export default Converter;