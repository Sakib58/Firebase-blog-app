import React from 'react';
import {View,Text} from 'react-native';
import { Avatar, Card ,Accessory} from 'react-native-elements';
import {AuthContext} from '../providers/AuthProvider';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen=()=>{
  return(
    <AuthContext.Consumer>
      {(auth)=>(
        <View style={{alignItems:"center",flex:1}}>
          <View>
            <Card>
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri:"https://globalheart.nl/wp-content/uploads/2016/06/charlie-chaplin.jpg",
                }}
              >
                <Accessory/>
              </Avatar>
              </Card>
          </View>
          
            <Card>            
            <Text>Name: {auth.CurrentUser.displayName}</Text>
            <Text>Email: {auth.CurrentUser.email}</Text>
          </Card>
          
        </View>
      )}
    </AuthContext.Consumer>
    
  );
}
export default ProfileScreen;