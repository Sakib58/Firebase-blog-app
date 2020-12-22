import React from "react";
import { TouchableOpacity, View,Alert } from "react-native";
import { Card, Button, Text, Avatar } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";



const PostCard = (props) => {

  const deleteThisPost=()=>{
    firebase.firestore().collection("posts").doc(props.item.id).delete().then(()=>{
      alert("Post deleted successfully");
    }).catch((error)=>{
      alert(error);
    })
  }

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Delete post:",
      "Are you sure to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteThisPost() }
      ],
      { cancelable: false }
    );

  var commentBtnName="Comment ("+props.item.data.comments.length+")";
  var likeBtnName="Like ("+props.item.data.likes.length+")";
  var date=new Date(props.item.data.created_at.seconds*1000).toLocaleDateString("en-us");
  var time=new Date(props.item.data.created_at.seconds*1000).toLocaleTimeString("en-us");
  var datetime=date+" "+time;
  return (
    <TouchableOpacity
    onLongPress={()=>{
      if(props.item.data.userId==props.currentUser.uid){
        createTwoButtonAlert();
      }else{
        alert("You don't have permission to modify to this post!");
      }
    }}
    >
      <Card>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            containerStyle={{ backgroundColor: "#ffab91" }}
            rounded
            icon={{ name: "user", type: "font-awesome", color: "black" }}
            activeOpacity={1}
          />
          <Text h4Style={{ padding: 10 }} h4>
            {props.item.data.author}
          </Text>
        </View>
        <Text style={{ fontStyle: "italic" }}> {datetime}</Text>
        <Text
          style={{
            paddingVertical: 10,
            fontSize:20,
            color:"blue",
          }}
        >
          {props.item.data.body}
        </Text>
        <Card.Divider />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            type="outline"
            title={likeBtnName}
            icon={<AntDesign name="like2" size={24} color="dodgerblue" />}
            onPress={()=>{
              if(props.item.data.likes.includes(props.currentUser.uid)){
                alert("You already liked this post!");
              }else{
                props.item.data.likes.push(props.currentUser.uid);
                if(props.currentUser.uid!=props.item.data.userId){
                  firebase.firestore().collection("notifications").add({
                  post:props.item,
                  user:props.currentUser.displayName,
                  operation:"Liked",
                  created_at: firebase.firestore.Timestamp.now(),
                })
                }
                
                firebase
                    .firestore()
                    .collection("posts")
                    .doc(props.item.id)
                    .update(
                      {
                        "likes":props.item.data.likes,
                      }
                    )
                    .then(
                      alert("Liked successfully")
                    )
                    .catch((error)=>{
                      alert(error)
                    });
                }
              }
            }
              
          />
          <Button 
          type="solid" 
          title={commentBtnName}
          onPress={()=>{
            props.props.navigation.navigate("Comment",
            {
              item:props.item,
            })
          }}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default PostCard;