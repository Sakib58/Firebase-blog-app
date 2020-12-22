import React, { useState,useEffect } from "react";
import { View, StyleSheet, AsyncStorage,FlatList,ActivityIndicator } from "react-native";
import {Input} from "react-native-elements";
import { Text, Card, Button, Avatar, Header } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import * as firebase from "firebase";
import "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";


const CommentScreen = (props) => {
  const netinfo = useNetInfo();
  if (netinfo.type != "unknown" && !netinfo.isInternetReachable) {
    alert("No Internet!");
  }
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");


  const loadPosts = async () => {
    setLoading(true);
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.item.id)
      .get()
      .then((post)=>{
        setPosts(post.data());
        setLoading(false);
      }).catch((error)=>{
        alert(error);
        setLoading(false);
      })
        
  };

  useEffect(() => {
    loadPosts();
    loadPosts();
  }, []);
  
  
  var date=new Date(props.route.params.item.data.created_at.seconds*1000).toLocaleDateString("en-us");
  var time=new Date(props.route.params.item.data.created_at.seconds*1000).toLocaleTimeString("en-us");
  var datetime=date+" "+time;

  


  
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
          
          <ActivityIndicator size="large" color="red" animating={loading}/>
          <View style={{alignItems:"flex-start",height:"20%"}}>
            <Card>
                <Text style={{fontSize:20,fontStyle:"italic",color:"blue"}}>{posts.author}</Text>
                <Text style={{fontSize:10,color:"blue"}}>{datetime}</Text>
                <Text style={{fontSize:17,color:"black"}}>{posts.body}</Text>
            </Card>
              
          </View>
          <View style={{height:"80%"}}>
            <View style={{alignItems:"flex-end",height:"58%"}}>
              <Text style={{fontSize:20,color:"red"}}>Comments of this post    </Text>
              <FlatList
                data={posts.comments}
                renderItem={function({item}){
                  return(
                    <View style={{alignItems:"flex-end",width:"100%"}}>
                      <Card>
                        <Text style={{fontSize:18,color:"blue"}}>{item.Author}</Text>
                        <Text style={{fontSize:10,color:"blue"}}>{item.DateTime}</Text>
                        <Text style={{fontSize:15,color:"black"}}>{item.Comment}</Text>
                      </Card>
                    </View>
                  
                  )
                }}
              />
            </View>
            <View style={{alignItems:"flex-end"}}>
              <Input
              placeholder="Write comment"
              onChangeText={
                  function(currentInput){
                      setComment(currentInput);
                  }
              }
              />
              <Button
                  title="Comment"
                  onPress={function(){
                    setLoading(true);
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime=date+" "+time;
                    props.route.params.item.data.comments.push(
                      {
                        Author:auth.CurrentUser.displayName,
                        UID:auth.CurrentUser.uid,
                        Comment:comment,
                        DateTime:dateTime,
                      }
                    )
                    //console.log(props.route.params.item.data.comments);
                    
                    firebase
                    .firestore()
                    .collection("posts")
                    .doc(props.route.params.item.id)
                    .update(
                      {
                        "comments":props.route.params.item.data.comments
                      }
                    )
                    .then(()=>{
                      setLoading(false);
                      loadPosts();
                    }) 
                    .catch((error)=>{
                      setLoading(false);
                      alert(error)
                    });
                    if(auth.CurrentUser.uid!=props.route.params.item.data.userId){
                      firebase
                      .firestore()
                      .collection("notifications")
                      .add(
                      {
                        post:props.route.params.item,
                        operation:"Commented",
                        user:auth.CurrentUser.displayName,
                        created_at: firebase.firestore.Timestamp.now(),
                      }
                      )
                    }

                  }}
                  
              />
              <ActivityIndicator size="large" color="red" animating={loading}/>
            </View>
          </View>
          
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

export default CommentScreen;
