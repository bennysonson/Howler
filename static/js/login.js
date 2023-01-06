const loginButton = document.querySelector('#loginButton');
let username = document.getElementById('username');

loginButton.addEventListener('click', e => {
    fetch('/users/' + username.value).then(res => {
        console.log(res);
        res.json().then(res => {
            console.log(res);
            localStorage.setItem('loggedInUser', JSON.stringify(res))
            window.location="/howler";
        }).catch(() => {
            console.log('User not found');
        })
    })
});