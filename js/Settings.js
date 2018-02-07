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
} from 'react-native';
import Drawer from 'react-native-drawer';
import { 
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

const win = Dimensions.get('window');//Viewport

class Settings extends React.Component {
  render() {
    return (
	 <View style={styles.container}>
        <View style={styles.topBar}>{/*Top ar*/}
          <TouchableWithoutFeedback onPress={() => {this.props.navigation.goBack()}}>
            <Image source={require('../assets/backIcon.png')} style={styles.backIcon}/>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView>{/*Main View for Settings*/}
        </ScrollView>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  container: {
    height: win.height,
    width: win.width,
    backgroundColor: '#000000',
  },
  topBar: {
    width: win.width,
    height: 35,
    backgroundColor: 'green',
  },
  backIcon: {
    height:25,
    width:25,
    marginLeft: 3,
    marginTop: 5,
  },
});

export default Settings;