//Imports
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Button, 
  ToastAndroid, 
  TouchableOpacity,
  ScrollView,
  Switch,
  AsyncStorage,
  TextInput,
  Linking,
  StatusBar,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';
import { Dropdown } from 'react-native-material-dropdown';

import CommonStyles from './CommonStyles';
import Globals from './Globals';

const win = Dimensions.get('window');//Viewport
//Settings Object. All Settings go here and will get generated in render.
const settings = {
  refreshOnOpen: {
    displayText: 'Refresh Crypto Prices when Opening App',
    optionType: 'switch',
    stateName: 'refreshOnOpen',
    storageName: 'RefreshOnOpen',
  },
  menuEntires: {
    displayText: 'Number of Top Cryptos Shown in Side Menu',
    optionType: 'number', 
    options: {
      min: 1,
      max: 100,
    },
    stateName: 'menuEntries',
    storageName: 'MenuEntries',
  },
};
const buttons = {
  refreshMasterList: {
    displayText: 'Refresh Master List',
    functionCall: 'checkMasterList',
  },
}
const fiatData = [
  {value:'AUD'},
  {value:'BRL'},
  {value:'CAD'},
  {value:'CHF'},
  {value:'CLP'},
  {value:'CNY'},
  {value:'CZK'},
  {value:'DKK'},
  {value:'EUR'},
  {value:'GBP'},
  {value:'HKD'},
  {value:'HUF'},
  {value:'IDR'},
  {value:'ILS'},
  {value:'INR'},
  {value:'JPY'},
  {value:'KRW'},
  {value:'MXN'},
  {value:'MYR'},
  {value:'NOK'},
  {value:'NZD'},
  {value:'PHP'},
  {value:'PKR'},
  {value:'PLN'},
  {value:'RUB'},
  {value:'SEK'},
  {value:'SGD'},
  {value:'THB'},
  {value:'TRY'},
  {value:'TWD'},
  {value:'USD'},
  {value:'ZAR'},
];
var themeData = [
  {value:'Black and White'},
  {value:'Dark'},
  {value:'Blue'},
  {value:'Red'},
  {value:'Green'},
  {value:'Orange'},
  {value:'Purple'},
];

class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refreshOnOpen: true,
      menuEntries: 10,
    };
    this.settingsObject = null;
    this.changeTheme = this.changeTheme.bind(this);
    this.changeFiat = this.changeFiat.bind(this);
  }
  async save() {
    //Loops through settings object and uses stateName and storageName to save to local device.
    for(let compo in settings)
    {
      //Creates object to save as setting.
      let settingToSave = {
        setting: (this.state)[settings[compo].stateName],
      };
      settingToSave = JSON.stringify(settingToSave);//Stringify to prepare for AsyncStorage(Only accepts strings and object makes it easier)
      await AsyncStorage.setItem(settings[compo].storageName, settingToSave);
    }
    Globals.UpdateSettings(this.settingsObject);
    await AsyncStorage.setItem(Globals.StorageNames.settings, JSON.stringify(this.settingsObject));
    this.props.navigation.state.params.onGoBack('all');//Refresh list on save settings
    //this.props.navigation.state.params.onGoBack('list');//Refresh list on save settings
    this.props.navigation.goBack();
  }
  async initLoad() {
    //When page opens all settings load from local storage.
    for(let compo in settings)
    {
      let retrieveState = await AsyncStorage.getItem(settings[compo].storageName);
      if(retrieveState)
      {
        //Why it saves as object as above. (retrieveState.setting)
        retrieveState = JSON.parse(retrieveState);
        this.setState({[settings[compo].stateName]: retrieveState.setting});
      }
    }
    //Loads in saved settings and if they exist uses that object else uses default.
    let retrieveSavedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
    if(retrieveSavedSettings)
      this.settingsObject = JSON.parse(retrieveSavedSettings);
    else 
      this.settingsObject = Globals.DefaultSettings;
  }
  componentWillMount() {
    this.initLoad();
  }
  async checkMasterList() {
    //Same as Home's checkMasterList() but gets list everytime
    try{
      fetch('https://api.coinmarketcap.com/v1/ticker/?limit=99999999',{
        method: 'GET'
      })
      .then( (response) => response.json()) 
      .then(async(responseJson) => {
        //Gets masterList and sets up master list array to save in storage 
        let masterList = [];
        for(let i = 0; i<responseJson.length; i++)
        {
          masterList.push({
            id: responseJson[i].id,
            name: responseJson[i].name,
          });
        }
        await AsyncStorage.setItem('MasterList', JSON.stringify(masterList));
        ToastAndroid.show('Master List Updated', ToastAndroid.SHORT);
      })
    }
    catch(error)
    {//If can't load the log error.
      console.log(error);
    }
  }
  changeTheme(text) {
    switch(text) {
      case "Blue":
        this.settingsObject.theme = {
          name: 'Blue',
          primaryColour: '#0d47a1',
          lightColour: '#5472d3',
          darkColour: '#002171',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Red":
        this.settingsObject.theme = {
          name: 'Red',
          primaryColour: '#b71c1c',
          lightColour: '#f05545',
          darkColour: '#7f0000',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Green":
        this.settingsObject.theme = {
          name: 'Green',
          primaryColour: '#1b5e20',
          lightColour: '#4c8c4a',
          darkColour: '#003300',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Dark":
        this.settingsObject.theme = {
          name: 'Dark',
          primaryColour: '#212121',
          lightColour: '#484848',
          darkColour: '#000000',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Orange":
        this.settingsObject.theme = {
          name: 'Orange',
          primaryColour: '#e65100',
          lightColour: '#ff833a',
          darkColour: '#ac1900',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Purple":
        this.settingsObject.theme = {
          name: 'Purple',
          primaryColour: '#4a148c',
          lightColour: '#7c43bd',
          darkColour: '#12005e',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      default:
        this.settingsObject.theme = {
          name: 'Black and White',
          primaryColour: '#e0e0e0',
          lightColour: '#ffffff',
          darkColour: '#aeaeae',
          backgroundColour: 'white',
          textColour: 'black',
        }
    }
  }
  changeFiat(text) {
    this.settingsObject.currency = text;
    switch(text){
      case 'BRL':
        this.settingsObject.symbol = 'R$';
        break;
      case 'CHF':
        this.settingsObject.symbol = 'CHF';
        break;
      case 'CNY':
      case 'JPY':
        this.settingsObject.symbol = '¥';
        break;
      case 'CZK':
        this.settingsObject.symbol = 'Kč';
        break;
      case 'DKK':
        this.settingsObject.symbol = 'kr.';
        break;
      case 'EUR':
        this.settingsObject.symbol = '€';
        break;
      case 'GBP':
        this.settingsObject.symbol = '£';
        break;
      case 'HUF':
        this.settingsObject.symbol = 'Ft';
        break;
      case 'IDR':
        this.settingsObject.symbol = 'Rp';
        break;
      case 'ILS':
        this.settingsObject.symbol = '₪';
        break;
      case 'INR':
        this.settingsObject.symbol = '₹';
        break;
      case 'KRW':
        this.settingsObject.symbol = '₩';
        break;
      case 'MYR':
        this.settingsObject.symbol = 'RM';
        break;
      case 'NOK':
      case 'SEK':
      case 'TRY':
        this.settingsObject.symbol = 'kr';
        break;
      case 'PHP':
        this.settingsObject.symbol = '₱';
        break;
      case 'PKR':
        this.settingsObject.symbol = '₨';
        break;
      case 'PLN':
        this.settingsObject.symbol = 'zł';
        break;
      case 'RUB':
        this.settingsObject.symbol = '₽';
        break;
      case 'THB':
        this.settingsObject.symbol = '฿';
        break;
      case 'ZAR':
        this.settingsObject.symbol = 'R';
        break;
      default:
        this.settingsObject.symbol = '$';
    }
  }
  render() {
    return (
	    <View style={CommonStyles.container}>
        <View style={[CommonStyles.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>{/*Top bar*/}
          <StatusBar
            backgroundColor={Globals.DefaultSettings.theme.darkColour}
          />
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/backIcon.png')} style={[CommonStyles.backIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
          </TouchableOpacity>
          <Text style={[CommonStyles.title, {color: Globals.DefaultSettings.theme.textColour}]}>Settings</Text>
        </View>
        <ScrollView>{/*Main View for Settings*/}
          {Object.keys(settings).map((setting: string) => (
            <View key={setting}>
              <View style={styles.settingRow}>
                <View style={styles.settingTextView}>
                  <Text style={styles.settingText}>{settings[setting].displayText}</Text>{/*Display text for setting.*/}
                </View>  
                <View style={styles.settingControl}>
                  {/*For Switch type Controls. Same concept for other types.*/}
                  {settings[setting].optionType === 'switch' &&
                    <Switch
                      value={(this.state)[settings[setting].stateName]}
                      tintColor="darkslategray"
                      onTintColor="green"
                      onValueChange={() => {
                        this.setState({[settings[setting].stateName]:!(this.state)[settings[setting].stateName]})
                      }}
                    />
                  }
                  {/*For number input takes max and min from options object specific for number type.*/}
                  {/*Does checking in onChangeText since no good text input for rn.*/}
                  {settings[setting].optionType === 'number' &&
                    <TextInput
                      keyboardType={'numeric'}
                      placeholderTextColor={'white'}
                      style={{color: 'black', backgroundColor: 'white', borderRadius: 5,}}
                      value={""+(this.state)[settings[setting].stateName]}
                      underlineColorAndroid="transparent"
                      onChangeText={(value) =>{
                        if(!(isNaN(value)) && value >= settings[setting].options.min && value <= settings[setting].options.max )
                        {
                          this.setState({[settings[setting].stateName]:value});
                        }
                      }}
                    />
                  }
                </View>
              </View>
              <View style={styles.menuLine}></View>
            </View>
          ))}
          <View style={styles.dropDownOuter}>
            <View style={styles.dropDownInner}>
              <Dropdown
                label='Theme'
                data={themeData}
                onChangeText={this.changeTheme}
              />
            </View>
          </View>
          <View style={styles.menuLine}></View>
          <View style={styles.dropDownOuter}>
            <View style={styles.dropDownInner}>
              <Dropdown
                label='Fiat Currency'
                data={fiatData}
                onChangeText={this.changeFiat}
              />
            </View>
          </View>
          <View style={styles.menuLine}></View>
          {Object.keys(buttons).map((button: string) => (
            <View key={button} style={styles.settingButton}>
              <Button 
                title={buttons[button].displayText}
                color={Globals.DefaultSettings.theme.primaryColour}
                onPress={() => {
                  //Switch Case because I couldn't figure out how to do the function call since buttons is outside class
                  //Switch Case was most painless way to implement. Tho most painful to maintain.
                  switch(buttons[button].functionCall){
                    case 'checkMasterList':
                      this.checkMasterList();
                      break;
                  }
                }}
              />
            </View>
          ))}
          <View style={[styles.creditBox, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <View style={[styles.creditTitleBox, {backgroundColor: Globals.DefaultSettings.theme.darkColour}]}>
              <Text style={[styles.creditsTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Credits</Text>
            </View>
            <Text style={[styles.creditsText, {color: Globals.DefaultSettings.theme.textColour}]}>This app makes use of the following two free APIs.</Text>
            <Text style={[styles.creditsText, styles.hyperlink]} onPress={()=>Linking.openURL('https://coinmarketcap.com/api/')}>CoinMarketCap</Text>
            <Text style={[styles.creditsText, {marginLeft: 20, marginRight: 20, color: Globals.DefaultSettings.theme.textColour}]}>This API is used to gather all of the data displayed within this app.</Text>
            <Text style={[styles.creditsText, styles.hyperlink]} onPress={()=>Linking.openURL('https://chasing-coins.com/api/')}>Chasing Coins</Text>
            <Text style={[styles.creditsText, {marginLeft: 20, marginRight: 20,marginBottom: 20, color: Globals.DefaultSettings.theme.textColour}]}>This API is used to pull the logos for each coin.</Text>
          </View>
        </ScrollView>
        <View style={[styles.footer, {backgroundColor: Globals.DefaultSettings.theme.darkColour}]}>
          <TouchableOpacity style={styles.footerButton} onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Cancel</Text>            
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={this.save.bind(this)}>
            <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  footer:{
    flexDirection: 'row', 
    height: 50, 
  },
  footerText: {
    fontSize: 20,   
  },
  footerButton: {
    width: win.width/2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  menuLine: {
    borderBottomColor: 'lightslategrey', 
    borderBottomWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    margin: 15,
  },
  settingText: {
    color: 'white',
  },
  settingTextView: {
    justifyContent: 'center',
    width: win.width-100,
  },
  settingControl: {
    flex: 1, 
    alignItems: 'flex-end',
  },
  settingButton: {
    margin: 15, 
  },
  creditBox: {
    margin: 15,
    borderRadius: 5,
  },
  creditTitleBox: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  creditsTitle:{
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,  
    marginTop: 3,
  },
  creditsText: {
    color: 'white',
    fontSize: 16,
    margin: 5,
  },
  hyperlink: {
    color: 'blue',
    fontSize: 18,
  },
  dropDownOuter: {
    backgroundColor: 'white', 
    margin: 15, 
    borderRadius: 5,
  },
  dropDownInner: {
    marginLeft: 15,
    marginRight: 15,
  },
});

export default Settings;