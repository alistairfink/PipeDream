//Imports
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
  Switch,
  AsyncStorage,
  TextInput,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import CommonStyles from './CommonStyles';

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
    displayText: 'Change Number of Top Cryptos Shown in Side Menu',
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

class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refreshOnOpen: true,
      menuEntries: 10,
    };
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
    this.props.navigation.state.params.onGoBack('list');//Refresh list on save settings
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
        let masterList = [];
        for(let i = 0; i<responseJson.length; i++)
        {
          masterList.push(responseJson[i].name);
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
  render() {
    return (
	    <View style={CommonStyles.container}>
        <View style={CommonStyles.topBar}>{/*Top bar*/}
          <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/backIcon.png')} style={CommonStyles.backIcon}/>
          </TouchableOpacity>
          <Text style={CommonStyles.title}>Settings</Text>
        </View>
        <ScrollView>{/*Main View for Settings*/}
          {Object.keys(settings).map((setting: string) => (
            <View key={setting}>
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>{settings[setting].displayText}</Text>{/*Display text for setting.*/}  
                <View style={styles.settingControl}>
                  {/*For Switch type Controls. Same concept for other types.*/}
                  {settings[setting].optionType === 'switch' &&
                    <Switch
                      value={(this.state)[settings[setting].stateName]}
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
                      style={{color: 'white'}}
                      value={""+(this.state)[settings[setting].stateName]}
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
          {Object.keys(buttons).map((button: string) => (
            <View key={button}>
              <Button 
                title={buttons[button].displayText}
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
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Text style={styles.footerText}>Cancel</Text>            
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={this.save.bind(this)}>
            <Text style={styles.footerText}>Save</Text>
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
    height: 40, 
    backgroundColor: 'green',
  },
  footerText: {
    color: 'white',
    fontSize: 20,   
  },
  footerButton: {
    width: win.width/2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  menuLine: {
    borderBottomColor: 'chartreuse', 
    borderBottomWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
  },
  settingText: {
    color: 'white',
  },
  settingControl: {
    flex: 1, 
    alignItems: 'flex-end',
  }
});

export default Settings;