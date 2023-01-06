const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//Authenticate user and set navbar
let authenticatedUser = JSON.parse(localStorage.getItem('loggedInUser'));
console.log(authenticatedUser);
document.getElementById('profileLink').innerHTML = '@' + authenticatedUser.username;
document.getElementById('profilePic').src = authenticatedUser.avatar;

//Current user we are viewing
let viewingUser = JSON.parse(localStorage.getItem('viewProfile'));

//set Profile info
document.getElementById('profileHeaderPic').src = viewingUser.avatar;
document.getElementById('profileHeaderName').innerHTML = viewingUser.first_name + ' ' + viewingUser.last_name;
document.getElementById('profileHeaderUsername').innerHTML = '@' + viewingUser.username;

//Follow button
let followButton = document.getElementById('profileHeaderFollow');
//Disabled if viewing authenticated user
if (viewingUser.id == authenticatedUser.id) {
    followButton.className = 'd-none';
} else {
    fetch('/follows/' + authenticatedUser.id).then(res => {
        res.json().then(res => {
            //If viewing user is already followed by authenticated user, make button say unfollow
            if (inArray(viewingUser.id, res)) {
                followButton.innerHTML = 'Following';
            }

            //When clicking follow button, change follow status
            followButton.addEventListener('click', e => {
                if (followButton.innerHTML == 'Following') {
                    followButton.innerHTML = 'Follow';
                    fetch('/follows/unfollow/' + authenticatedUser.id, {
                        method: 'DELETE',
                        body: JSON.stringify({
                            viewingUserId: viewingUser.id,
                        }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(res => res.json())
                } else {
                    followButton.innerHTML = 'Following';
                    fetch('/follows/follow/' + authenticatedUser.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            viewingUserId: viewingUser.id,
                        }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(res => res.json())
                }
            });
        });
    });
}

//Get followers list
fetch('/follows/followers/' + viewingUser.id).then(res => {
    res.json().then(res => {
        document.getElementById('numbFollowers').innerHTML = res.length;
        //Populate followers list
        for (var userId of res) {
            //Get this users info
            fetch('/users/Id/' + userId).then(res => {
                res.json().then(res => {
                    appendToFollowList(res, 'followerList')
                })
            })
        }
    })
})

//Get following list
fetch('/follows/' + viewingUser.id).then(res => {
    res.json().then(res => {
        document.getElementById('numbFollowing').innerHTML = res.length;
        //Populate following list
        for (var userId of res) {
            //Get this users info
            fetch('/users/Id/' + userId).then(res => {
                res.json().then(res => {
                    appendToFollowList(res, 'followingList')
                })
            })
        }
    })
})

function appendToFollowList(userinfo, list) {
    let user = document.createElement('li');
    user.classList.add('list-group-item');

    //User avatar
    let userImg = document.createElement('img');
    userImg.src = userinfo.avatar;
    userImg.style.width = '30px';
    userImg.style.height = '30px';
    user.append(userImg);
    //Clicking on avatar navigates to that profile
    userImg.addEventListener('click', e => {
        localStorage.setItem('viewProfile', JSON.stringify(userinfo));
        window.location = "/profile";
    })

    let followName = document.createElement('span');
    followName.className = 'followName';
    followName.append(userinfo.first_name + ' ' + userinfo.last_name);
    user.append(followName);

    let followUsername = document.createElement('span');
    followUsername.className = 'followUsername';
    followUsername.style.color = 'darkgray';
    followUsername.append(' @' + userinfo.username);
    user.append(followUsername);

    document.getElementById(list).append(user);
}

//Get user howls
fetch('/howls/' + viewingUser.id).then(res => {
    res.json().then(res => {
        //Append howls to feed
        for (var post of res) {
            appendPost(post);
        }
    })
})

//Append howl to feed
function appendPost(howl) {
    let howlDiv = document.createElement("div");
    howlDiv.className = 'howlContainer';
    //Append header info
    let howlDivHeader = document.createElement("div");
    howlDivHeader.classList.add('howlContainerHeader');
    howlDiv.append(howlDivHeader);
    let howlProfilePic = document.createElement('img');
    howlProfilePic.className = 'howlProfilePic';
    howlProfilePic.src = viewingUser.avatar;
    howlProfilePic.alt = 'Profile Pic';
    howlDivHeader.append(howlProfilePic);


    let howlDivName = document.createElement('div');
    howlDivName.className = 'howlDivName';
    howlDivName.append(viewingUser.first_name + ' ' + viewingUser.last_name);
    howlDivHeader.append(howlDivName);

    let howlDivUsername = document.createElement('div');
    howlDivUsername.className = 'howlDivUsername';
    howlDivUsername.append('@' + viewingUser.username);
    howlDivUsername.style.color = 'darkgray';
    howlDivUsername.style.justifyContent = 'center';
    howlDivHeader.append(howlDivUsername);


    //Build date string
    let howlDivDate = document.createElement('div');
    howlDivDate.className = 'howlDivDate';
    let postDateObj = new Date(howl.datetime);
    let postMonth = months[postDateObj.getMonth()];
    let postYear = postDateObj.getFullYear().toString();
    let postDay = postDateObj.getDate().toString();
    let postHour = postDateObj.getHours();
    let postMinutes = postDateObj.getMinutes();
    if (postMinutes < 10) {
        postMinutes = '0' + postMinutes;
    }

    let postDate = postMonth + ' ' + postDay;
    if (postDay[postDay[postDay.length - 2] != 1 && postDay.length - 1] == 1) {
        postDate += 'st';
    } else if (postDay[postDay.length - 2] != 1 && postDay[postDay.length - 1] == 2) {
        postDate += 'nd';
    } else if (postDay[postDay.length - 2] != 1 && postDay[postDay.length - 1] == 3) {
        postDate += 'rd';
    } else {
        postDate += 'th';
    }

    postDate += ', ';

    let currentYear = new Date().getFullYear();

    if (currentYear - postYear > 0) {
        postDate += postYear + '. '
    }

    if (postHour - 12 >= 0) {
        if (postHour == 12) {
            postDate += postHour + ':' + postMinutes + 'pm';
        } else {
            postHour -= 12;
            postDate += postHour + ':' + postMinutes + 'pm';
        }
    } else {
        if (postHour == 0) {
            postDate += '12:' + postMinutes + 'am';
        } else {
            postDate += postHour + ':' + postMinutes + 'am';
        }
    }
    howlDivDate.append(postDate);
    howlDivHeader.append(howlDivDate);


    howlDiv.append(howl.text);
    document.getElementById('howls').append(howlDiv);
}

//Clicking on Brand name brings back to Howler homepage
document.getElementById('brandName').addEventListener('click', e => {
    window.location = "/howler";
})

//View authenticated users profile
document.getElementById('profilePic').addEventListener('click', e => {
    localStorage.setItem('viewProfile', JSON.stringify(authenticatedUser));
    window.location = "/profile";
});

function inArray(needle, haystack) {
    for (let i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle)
            return true;
    }
    return false;
}

//Logout
document.getElementById('logout').addEventListener('click', e => {
    localStorage.setItem('loggedInUser', null);
    window.location = "/";
})