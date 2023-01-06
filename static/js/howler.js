const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//Authenticate user and set navbar
let authenticatedUser = JSON.parse(localStorage.getItem('loggedInUser'));
console.log(authenticatedUser);
document.getElementById('profileLink').innerHTML = '@' + authenticatedUser.username;
document.getElementById('profilePic').src = authenticatedUser.avatar;

//Retrieve howls from followed users
//First get list of users authenticated user follows
fetch('/follows/' + authenticatedUser.id).then(res => {
    res.json().then(res => {
        let follows = res.toString();

        //Add current authenticated user to list of who to retrieve howls from to display in feed
        follows += ',' + authenticatedUser.id;

        //Then get the howls by the followed users
        fetch('/howls/' + follows).then(res => {
            res.json().then(res => {
                let followedPosts = res;
                console.log(followedPosts);

                //Append howls to feed
                for (var post of followedPosts) {
                    appendPost(post);
                }
            }).catch(() => {
                console.log('Posts not found')
            })
        })
    }).catch(() => {
        console.log('User not found');
    })
})

//Append howl to feed
function appendPost(howl) {
    //get poster info
    fetch('/users/Id/' + howl.userId).then(res => {
        res.json().then(res => {
            let userinfo = res;
            console.log(howl);

            let howlDiv = document.createElement("div");
            howlDiv.className = 'howlContainer';
            //Append header info
            let howlDivHeader = document.createElement("div");
            howlDivHeader.classList.add('howlContainerHeader');
            howlDiv.append(howlDivHeader);

            //User avatar
            let howlProfilePic = document.createElement('img');
            howlProfilePic.id = 'howlProfilePic';
            howlProfilePic.className = 'howlProfilePic';
            howlProfilePic.src = userinfo.avatar;
            howlProfilePic.alt = 'Profile Pic';
            howlDivHeader.append(howlProfilePic);
            //Clicking on avatar navigates to that profile
            howlProfilePic.addEventListener('click', e => {
                localStorage.setItem('viewProfile', JSON.stringify(userinfo));
                window.location = "/profile";
            })


            let howlDivName = document.createElement('div');
            howlDivName.className = 'howlDivName';
            howlDivName.append(userinfo.first_name + ' ' + userinfo.last_name);
            howlDivHeader.append(howlDivName);

            let howlDivUsername = document.createElement('div');
            howlDivUsername.className = 'howlDivUsername';
            howlDivUsername.append('@' + userinfo.username);
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

        })
    }).catch(() => {
        console.log('User not found 2');
    })
}

//Post a howl
document.getElementById('postHowlButton').addEventListener('click', e => {
    //create howl JSON object
    //Get newewst ID
    let howlId;

    fetch('/howls').then(res => {
        res.json().then(res => {
            howlId = Object.keys(res).length + 1;
            let howlUserId = authenticatedUser.id;

            let date = new Date().toJSON().slice(0, 19) + 'Z';

            let howlText = document.getElementById('newHowlText').value;

            fetch('/howls', {
                method: 'POST',
                body: JSON.stringify({
                    id: howlId,
                    userId: howlUserId,
                    datetime: date,
                    text: howlText
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(res => res.json())
                .then(json => appendPost(json))
                .catch(error => console.log(error));
        })
    })
});

//View authenticated users profile
document.getElementById('profilePic').addEventListener('click', e => {
    localStorage.setItem('viewProfile', JSON.stringify(authenticatedUser));
    window.location = "/profile";
})

//Logout
document.getElementById('logout').addEventListener('click', e => {
    localStorage.setItem('loggedInUser', null);
    window.location = "/";
})