import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  ToastAndroid, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  AsyncStorage,
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
    try
    {
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
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
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
          <Text style={CommonStyles.title}>Convert</Text>
        </View>
        <View style={[styles.topBottom, {backgroundColor: 'lightcoral', marginBottom: 5}]}>{/*Top Crypto*/}
          {this.state.topCrypto &&
            <View>{/*Only appears after u pick a crypto up top*/}
              <View style={styles.convertInput}>
                <TextInput 
                  keyboardType={'numeric'}
                  style={{color: 'white'}}
                  value={""+this.state.topCryptoVal}
                  style={[styles.font, {textAlign: 'center'}]}
                  underlineColorAndroid="black"
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
                      if(this.state.topCrypto && this.state.bottomCrypto)
                      {
                        this.convertCrypto('bottomCryptoVal', value, this.state.topCrypto.price_usd, this.state.bottomCrypto.price_usd);
                      }
                    }
                    else if(value === '')
                    {
                      this.setState({topCryptoVal: 0});
                      if(this.state.topCrypto && this.state.bottomCrypto)
                      {
                        this.convertCrypto('bottomCryptoVal', 0, this.state.topCrypto.price_usd, this.state.bottomCrypto.price_usd);
                      }
                    }
                    else if(isNaN(value) && value.charAt(value.length-1)!=".")
                    {
                    }
                  }}
                />
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.font}>{this.state.topCrypto.symbol}</Text>
                </View>
              </View>
              <View style={styles.currencyNormalConversion}>
                  <Text style={[styles.font, {fontWeight: 'bold'}]}>{this.state.topCrypto.name}</Text>
              </View>
              <View style={styles.currencyNormalConversion}>
                <Text style={[styles.font, {fontSize: 22,}]}>${parseFloat(this.state.topCryptoVal*this.state.topCrypto.price_usd).toFixed(2)} USD</Text>
              </View>
            </View>
          }
          <View style={styles.addCurrOuterView}>
            <TouchableOpacity style={[styles.addCurrOuter, {backgroundColor: 'red'}]} onPress={() => {
              if(!(this.state.searchTop) && !(this.state.searchBottom))
                this.chooseCurr('topCrypto');
            }}>
              <View>
                <Text style={styles.addCurrText}>Change Currency</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.topBottom, {backgroundColor: 'lightblue', marginTop: 5,}]}>{/*Same as top crypto but on bottom*/}
          {this.state.bottomCrypto &&
            <View>
              <View style={styles.convertInput}>
                <TextInput 
                  keyboardType={'numeric'}
                  value={""+this.state.bottomCryptoVal}
                  style={[styles.font, {textAlign: 'center'}]}
                  underlineColorAndroid="black"
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
                      if(this.state.topCrypto && this.state.bottomCrypto)
                      {
                        this.convertCrypto('topCryptoVal', value, this.state.bottomCrypto.price_usd, this.state.topCrypto.price_usd);
                      }
                    }
                    else if(value === '')
                    {
                      this.setState({bottomCryptoVal: 0});
                      if(this.state.topCrypto && this.state.bottomCrypto)
                      {
                        this.convertCrypto('topCryptoVal', 0, this.state.bottomCrypto.price_usd, this.state.topCrypto.price_usd);
                      }
                    }
                    else if(isNaN(value) && value.charAt(value.length-1)!=".")
                    {
                    }
                  }}
                />
                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.font}>{this.state.bottomCrypto.symbol}</Text>
                </View>
              </View>
              <View style={styles.currencyNormalConversion}>
                  <Text style={[styles.font, {fontWeight: 'bold'}]}>{this.state.bottomCrypto.name}</Text>
              </View>
              <View style={styles.currencyNormalConversion}>
                <Text style={[styles.font, {fontSize: 22,}]}>${parseFloat(this.state.bottomCryptoVal*this.state.bottomCrypto.price_usd).toFixed(2)} USD</Text>
              </View>
            </View>
          } 
          <View style={styles.addCurrOuterView}>
            <TouchableOpacity style={[styles.addCurrOuter, {backgroundColor: 'blue'}]} onPress={() => {
              if(!(this.state.searchTop) && !(this.state.searchBottom))
                this.chooseCurr('bottomCrypto');
            }}>
              <View>
                <Text style={styles.addCurrText}>Change Currency</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>{/*Below are search windows. Possibly make better by making one then taking values from array. Lazy tho.*/}
        {this.state.searchTop &&
          <View style={styles.searchWindow}>
            <View style={{backgroundColor: 'white', flexDirection: 'row-reverse'}}>
              <TouchableOpacity style={{ justifyContent: 'center'}} onPress={() => {                
                this.handleSearch('', 'searchListTop');
                this.setState({search: ''});
              }}>
                <Image source={require('../assets/clearSearchIcon.png')} style={styles.clearSearch}/>
              </TouchableOpacity>
              <TextInput
                placeholder={'Search...'}
                style={styles.searchTextInput}
                value={this.state.search}
                onChangeText={(value) =>{
                  this.handleSearch(value, 'searchListTop');
                  this.setState({search: value});
                }}
              />
            </View>
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
            <View style={{backgroundColor: 'white', flexDirection: 'row-reverse'}}>
              <TouchableOpacity style={{ justifyContent: 'center'}} onPress={() => {                
                this.handleSearch('', 'searchListBottom');
                this.setState({search: ''});
              }}>
                <Image source={require('../assets/clearSearchIcon.png')} style={styles.clearSearch}/>
              </TouchableOpacity>
              <TextInput
                placeholder={'Search...'}
                style={styles.searchTextInput}
                value={this.state.search}
                onChangeText={(value) =>{
                  this.handleSearch(value, 'searchListBottom');
                  this.setState({search: value});
                }}
              />
            </View>
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
  searchWindow: {
    position: 'absolute', 
    left: 40, 
    width: win.width-80, 
    top: 80, 
    height: win.height-160, 
    backgroundColor: 'black', 
    borderWidth: 2, 
    borderColor: 'green',
  },
  searchWindowChin: {
    height: 40, 
    backgroundColor: 'darkgreen',
  },
  searchWindowCancel: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  cancelText: {
    color: 'white',
  },
  addCurrOuter: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    margin: 0,
  },
  addCurrOuterView: {
    flex: 1, 
    flexDirection: 'column-reverse', 
    borderRadius: 5,
  },
  addCurrText: {
    color: 'white', 
    alignSelf: 'center', 
    fontSize: 18, 
    marginTop: 10, 
    marginBottom: 10,
  },
  convertInput: {
    marginBottom: 0, 
    borderRadius: 5, 
    flexDirection: 'row',  
    justifyContent: 'center',
  },
  font: {
    fontSize: 27,
    color: 'black',
  },
  topBottom: {
    flex: 0.5, 
    borderColor: 'gray',
    borderRadius: 10,
    margin: 20,
    flexDirection: 'column',
  },
  currencyNormalConversion: {
    flex: 1, 
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 35,
  },
  clearSearch: {
    width: 25, 
    height: 25,
    marginRight: 10,
  },
});

export default Converter;