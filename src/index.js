(function () {
  'use strict';



  // login form
  document.querySelector('.login-form').addEventListener('submit', function (event) {
    event.preventDefault()

    const username = event.target.username.value
    const password = event.target.password.value

    request('/auth/token', 'post', {
        username,
        password
      })
      .then(function (response) {
        document.querySelector('#error').classList.add('hide-auth-error')
        localStorage.setItem('token', response.data.token)
        window.location = 'library.html'
      })
      .catch(function (error) {
        document.querySelector('#error').classList.remove('hide-auth-error')
      })
  })
})();

//create login form
document.querySelector('.new-user-form').addEventListener('submit', event => {
  event.preventDefault()

  const username = event.target.createUsername.value
  const password = event.target.createPassword.value

  request('/users', 'post', {
    username,
    password
  })
  .then( response => {
    return request('/auth/token', 'post', {
      username,
      password
    })
  })
  .then( response => {
    document.querySelector('#error').classList.add('hide-auth-error')
        localStorage.setItem('token', response.data.token)
        window.location = 'library.html'
  })
  .catch(error => {
    console.log(error)
  })

})

function displayImgRotate(){
  bgImgArray = ['../img/landArt1.jpg','../img/landArt2.jpg', '../img/landArt3.jpg', '../img/landArt4.png', '../img/landArt5.png', '../img/landArt6.jpg', '../img/landArt7.png', '../img/landArt8.jpg', '../img/landArt9.png', '../img/landArt10.jpg']
  const imgCont = document.querySelector('.index-container')
  let counter = 0
  setInterval(()=>{
    imgCont.setAttribute('style', `background-image: url(${bgImgArray[counter]}); transition: all .5s ease`)
    counter++
    counter%=bgImgArray.length
  },10000)
}

displayImgRotate()