import { 
  StyleSheet, 
  Dimensions, 
} from 'react-native';

const win = Dimensions.get('window');//Viewport

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    width: win.width,
    height: 40,
    backgroundColor: 'green',
    flexDirection: 'row', 
  },
  backIcon: {
    height:27,
    width:27,
    marginLeft: 7,
    marginTop: 7,
    marginRight: 7,
  },
  title: {
    fontSize: 30, 
    marginLeft: 5,
    color: 'white', 
  },
  topBarRight: {
    flex: 1, 
    alignItems: 'flex-end',
    marginRight: 10,
  },
  menuIcon: {
    height:27,
    width:27,
    marginLeft: 12,
    marginTop: 7,
    marginRight: 7,
  },
  topBarRigthInner:{
  	flexDirection: 'row', 
  }
});