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
    height: 50,
    backgroundColor: 'green',
    flexDirection: 'row', 
  },
  backIcon: {
    height:32,
    width:32,
    marginLeft: 7,
    marginTop: 10,
    marginRight: 7,
  },
  title: {
    fontSize: 30, 
    marginLeft: 5,
    color: 'white', 
    alignSelf: 'center', 
  },
  topBarRight: {
    flex: 1, 
    alignItems: 'flex-end',
    marginRight: 10,
  },
  menuIcon: {
    height:32,
    width:32,
    marginLeft: 7,
    marginTop: 10,
    marginRight: 7,
  },
  topBarRigthInner:{
  	flexDirection: 'row', 
  }
});