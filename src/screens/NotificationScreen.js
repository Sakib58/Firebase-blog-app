import React, { useState,useEffect } from "react";
import { View, StyleSheet, AsyncStorage,FlatList,TouchableOpacity,ActivityIndicator } from "react-native";
import { Text, Card, Button, Avatar, Header } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import * as firebase from "firebase";
import "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";

const NotificationScreen = (props) => {
  const netinfo = useNetInfo();
  if (netinfo.type != "unknown" && !netinfo.isInternetReachable) {
    alert("No Internet!");
  }
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);


  const loadNotifications = async () => {
    setLoading(true);
    firebase
      .firestore()
      .collection("notifications")
      .orderBy("created_at", "desc")
      .onSnapshot((querySnapshot) => {
        let temp_notifications = [];
        querySnapshot.forEach((doc) => {
          temp_notifications.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setNotifications(temp_notifications);
        //console.log(temp_notifications);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
  };

  useEffect(() => {
    loadNotifications();
  }, []);
  
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <Header
            leftComponent={{
              icon: "menu",
              color: "#fff",
              onPress: function () {
                props.navigation.toggleDrawer();
              },
            }}
            centerComponent={{ text: "The Office", style: { color: "#fff" } }}
            rightComponent={{
              icon: "lock-outline",
              color: "#fff",
              onPress: function () {
                auth.setIsLoggedIn(false);
                auth.setCurrentUser({});
              },
            }}
          />
          <ActivityIndicator size="large" color="red" animating={loading} />
          <FlatList
            data={notifications}
            renderItem={({ item }) => {
              var time=Math.ceil((-item.data.created_at.seconds+firebase.firestore.Timestamp.now().seconds)/60);
              var timeStr=undefined;
              if(time>60 && time<24*60){
                timeStr=Math.floor(time/60)+" hours "+Math.floor(time%60)+" minutes";
              }
              else if(time>24*60){
                timeStr=Math.floor(time/(24*60))+" days ";
                var th=Math.floor(time%(24*60))
                if(th>60){
                  timeStr+=Math.floor(th/60)+" hours "+Math.floor(th%(th/60))+" minutes"
                }else{
                  timeStr+=Math.floor(time%(time/(24*60)))+" minutes"
                }
              }
              else{
                timeStr=time+" minutes";
              }
              if(auth.CurrentUser.uid==item.data.post.data.userId){
                return (
                  <TouchableOpacity
                    onPress={()=>{
                      props.navigation.navigate("Comment",
                      {
                        item:item.data.post,
                      }
                      )
                    }}
                  >
                    <Card>
                      <Text style={{fontSize:16,color:"blue"}}>{item.data.user} {item.data.operation} on your post!</Text>
                      <Text style={{fontSize:11}}>{timeStr} ago</Text>
                    </Card>
                  </TouchableOpacity>
                  
                );
              }
            }}
          />

            
          
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default NotificationScreen;
