'use strict';
let cards;

// auth gate
request('/auth/token')
.catch(function (error) {
    console.log(error)
    // user is not logged in
    window.location = '/index.html'
})
.then(function (response) {
    return request(`/users/${response.data.id}/decks`)
})
.then(response => {
    response.data.data.forEach(deck => {
        renderMyDecks(deck.id, deck.name)
    })
})

const accountName = document.querySelector('.your-account-name')
request(`/auth/token`)
.then(response => {
  return request(`/users/${response.data.id}`)
})
.then(response => {
  accountName.innerHTML = `Welcome, ${response.data.data[0].username}`
})

    const decksButton = document.querySelector('.decks-button')
    const libraryButton = document.querySelector('.library-button')

    decksButton.addEventListener('click', event => {
        request('/auth/token')
            .then(response => {
                window.location = 'yourDecks.html'
            })
    })

    libraryButton.addEventListener('click', event => {
        request('/auth/token')
            .then(response => {
                window.location = 'library.html'
            })
    })

    const logout = document.querySelector('.logout-button')
logout.addEventListener('click', event => {
  window.location = 'index.html'
  localStorage.removeItem('token')
})

function displayImgRotate(){
    bgImgArray = ['../img/landArt1.jpg','../img/landArt2.jpg', '../img/landArt3.jpg', '../img/landArt4.png']
    const imgCont = document.querySelector('.img-row')
    let counter = 0
    setInterval(()=>{
      imgCont.setAttribute('style', `background-image: url(${bgImgArray[counter]}); transition: all .5s ease`)
      counter++
      counter%=bgImgArray.length
    },5000)
  }
  
  displayImgRotate()



    const newDeckForm = document.querySelector('.new-deck-name-form')
    newDeckForm.addEventListener('submit', event => {
        event.preventDefault()

        request('/auth/token')
            .then(response => {
                return request(`/users/${response.data.id}/decks`, 'post', {
                    name: event.target.cardNameValue.value
                })
            })
            .then(response => {
                console.log('!!!!!!!!', response.data)
                window.location = `decks.html?id=${response.data.data.id}`

                $('#addDeckModal').modal('hide')
            })
    })

    function renderMyDecks(id, name) {
        const decksDisplay = document.querySelector('.all-decks-display')
        const img = document.createElement('img')
        const deckDiv = document.createElement('div')
        const deckName = document.createElement('h2')

        deckName.innerHTML = name
        deckDiv.classList.add('library-img')
        deckDiv.setAttribute('data-name', name)
        deckDiv.setAttribute('data-id', id)
        deckDiv.classList.add('size')
        img.setAttribute('src', '../img/Magic_Card_Back.png')
        deckDiv.appendChild(deckName)
        deckDiv.appendChild(img)
        deckDiv.addEventListener('click', event => {
            window.location = `decks.html?id=${id}`
        })

        decksDisplay.appendChild(deckDiv)
    }

    function empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }