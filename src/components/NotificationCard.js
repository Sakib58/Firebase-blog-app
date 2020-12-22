import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import { Card } from 'react-native-paper';

const NotificationCard=(props)=>{
    return(
        <View>
            <TouchableOpacity
                onPress={function(){
                    //console.log("Notification Button pressed!");
                }}
            >
                <Text>{props.username}+" "+{props.operation}+" on your post"</Text>
            </TouchableOpacity>
        </View>
    );
}

export default NotificationCard;