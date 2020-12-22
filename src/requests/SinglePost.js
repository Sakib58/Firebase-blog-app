import { removeData,getDataJSON, storeDataJSON, addDataJSON } from "../functions/AsyncStorageFunctions";

const getSinglePost=async (id)=>{
    const response = await getDataJSON("Posts");
    response.forEach(element=> {
        if(element.PostID==id){
            //console.log(element);
            return element;
        }
    });
}

const savePostComment=async (postId,postUser,postComment, date, time)=>{
    const response = await getDataJSON("Posts");
    let posts=[];
    response.forEach(element => {
        if(element.PostID==postId){
            let comments=element.Comments;
            comments.push({"Author":postUser,"Comment":postComment,"Date":date,"Time":time});
            element.Comments=comments;
            posts.push(element);
        }else{
            posts.push(element);
        }
    });
    removeData("Posts");
    storeDataJSON("Posts",posts);
    //console.log(posts)
    
}

const saveCommentNotification=async (postId,userInfo,date,time)=>{
    await addDataJSON("Notifications",{"PostId":postId,userInfo:userInfo,"Operation":"Commented","Date":date,"Time":time});
    }

const getMyNotification=async (user)=>{
    var myNotification=[];
    var allNotification=await getDataJSON("Notifications");
    var allPosts=await getDataJSON("Posts");
    allNotification.forEach(notification=>{
        allPosts.forEach(post=>{
            if(notification.PostId==post.PostID && post.Author.email==user.email && notification.userInfo.email!=user.email){
                myNotification.push(notification);
            }
        })
    })
    //console.log(myNotification);
    return myNotification;
}

export {savePostComment,saveCommentNotification,getMyNotification, getSinglePost};