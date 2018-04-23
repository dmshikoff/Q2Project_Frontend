(function () {
  'use strict';

  request('/auth/token')
    .then(function (response) {
      // user is authenticated

    })
    .catch(function (error) {
      // user is not authenticated
    })



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



// request(`/cards?white=true&blue=true`)