var App = {posts:{},users:{},handles:{},follows:{},handle:"",me:""}

function getHandle(who,callbackFn) {
    send("getHandle",who,function(handle) {
        cacheUser({handle:handle,hash:who})
        if (callbackFn!=undefined) {
            callbackFn(who,handle)
        }
    })
}

function getMyHandle(callbackFn) {
    getHandle(App.me,function(hash,handle){
        if (handle != "") {
          App.handle = handle
          if (callbackFn!=undefined) {
              callbackFn()
          }
        }
    })
}

function getFollow(who,type,callbackFn) {
    send("getFollow",JSON.stringify({from:who,type:type}),function(data) {
        var j =  JSON.parse(data)
        var following = j.result
        if (following != undefined) {
            var len = following.length
            for (var i = 0; i < len; i++) {
                cacheFollow(following[i])
            }
            if (callbackFn!=undefined) {
                callbackFn()
            }
        }
    })
}

function getProfile() {
    send("appProperty","App_Key_Hash", function(me) {
        App.me = me
        getMyHandle()
        getFollow(me,"following",getMyFeed)
    })
}

function addPost(message) {
    var now = new(Date)
    var post = {
        message: message,
        stamp: now.valueOf()
    }
    send("post",JSON.stringify(post),function(data) {
        post.key = JSON.parse(data) // save the key of our post to the post
        post.author = App.me
        cachePost(post)
    })
}

function doEditPost(id, message) {
    var now = new(Date)
    var post = {
        message: message,
        stamp: now.valueOf()
    }
    send("postMod",JSON.stringify({hash:App.posts[id].key,post:post}),function(data) {
        post.key = JSON.parse(data) // save the key of our post to the post
        post.author = App.me
        id = cachePost(post)
    })
}

function follow(w) {
    send("follow",w,function(data) {
        cacheFollow(w)
    })
}

function getUserHandle(user) {
    var author = App.handles[user]
    var handle
    if (author == undefined) {
        handle = user
    } else {
        handle = author.handle
    }
    return handle
}

function getUserPosts(user) {
    getPosts([user])
}

function getMyFeed() {
    var users = Object.keys(App.follows)
    if (!users.includes(App.me)) {
        users.push(App.me)
    }
    getPosts(users)
}

function getPosts(by) {

    // check to see if we have the author's handles
    for (var i=0; i<by.length; i++) {
        var author = by[i]
        var handle = App.handles[author]
        if (handle == undefined) {
            getHandle(author)
        }
    }
    send("getPostsBy",JSON.stringify(by),function(arr) {
        arr = JSON.parse(arr)

        var len = len = arr.length
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var post = arr[i].post
                post.author = arr[i].author
                var id = cachePost(post)
            }
        }
        displayPosts()
    },
    true)
}

function cachePost(p) {
    var id = p.stamp
    App.posts[id] = p
    return id
}

function cacheUser(u) {
    App.users[u.handle] = u
    App.handles[u.hash] = u
}

function cacheFollow(f) {
    console.log("caching: "+f)
    App.follows[f] = true
}

function uncacheFollow(f) {
    delete App.follows[f]
}

function doFollow(handle) {

    send("getAgent",handle,function(data) {
        if (data != "") {
            follow(data)
        }
        else {
            alert(handle+" not found")
        }
    })
}

function doSetHandle(handle) {
    send("newHandle",handle,function(data) {
        if (data != "") {
            getMyHandle()
        }
    })
}

function unfollow(handle) {
    var user = App.users[handle].hash
    send("unfollow",user,function(data) {
        uncacheFollow(user)
    })
}
