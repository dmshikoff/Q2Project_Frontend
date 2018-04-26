(function () {
  'use strict';
  let cards;

  // auth gate
  request('/auth/token')
    .then(function (response) {
      // user is logged in
      document.querySelector('.user-id').innerHTML = response.data.id
    })
    .catch(function (error) {
      // user is not logged in
      window.location = '/index.html'
    })
});

const decksButton = document.querySelector('.deck-button')
const libraryButton = document.querySelector('.library-button')
const libraryCont = document.querySelector('.library-cont')
const decksCont = document.querySelector('.decks-cont')
const newDeckCont = document.querySelector('.new-deck-cont')

decksButton.addEventListener('click', event => {
  libraryCont.classList.add('hide')
  decksCont.classList.remove('hide')
  newDeckCont.classList.add('hide')

  request(`/auth/token`)
  .then(response => {

   return request(`/users/${response.data.id}/decks`)    
  })
  .then(response => {

      response.data.data.forEach(deck => {
        renderMyDecks(deck.id, deck.name)
      })
  })
})

libraryButton.addEventListener('click', event => {
  libraryCont.classList.remove('hide')
  decksCont.classList.add('hide')
  newDeckCont.classList.add('hide')
})

const librarySearch = document.querySelector('.library-search-form')
librarySearch.addEventListener('submit', event => {
  event.preventDefault()
  const display = document.querySelector('.library-display')
  empty(display)
  let searchQuery = {}
  if (event.target.exampleRadios.value === 'name' && event.target.searchTerm.value) {
    searchQuery.name = textQueryCreator(event.target.searchTerm.value)
  }
  if (event.target.exampleRadios.value === 'type' && event.target.searchTerm.value) {
    searchQuery.type = textQueryCreator(event.target.searchTerm.value)
  }
  if (event.target.exampleRadios.value === 'subtype' && event.target.searchTerm.value) {
    searchQuery.subtype = textQueryCreator(event.target.searchTerm.value)
  }
  if (event.target.exampleRadios.value === 'text' && event.target.searchTerm.value) {
    searchQuery.text = textQueryCreator(event.target.searchTerm.value)
  }
  if (event.target.white.checked === true) {
    searchQuery.white = true
  }
  if (event.target.blue.checked === true) {
    searchQuery.blue = true
  }
  if (event.target.black.checked === true) {
    searchQuery.black = true
  }
  if (event.target.red.checked === true) {
    searchQuery.red = true
  }
  if (event.target.green.checked === true) {
    searchQuery.green = true
  }
  if (event.target.colorless.checked === true) {
    searchQuery.colorless = true
  }
  let queryText = `?`
  for (let key in searchQuery) {
    const keyValueText = `${key}=${searchQuery[key]}`
    queryText += `${keyValueText}&`
  }
  queryText = queryText.slice(0, queryText.length - 1)

  request('/auth/token')
    .then(response => {
      request(`/users/${response.data.id}/cards${queryText}`)
        .then(data => {
          let img = data.data.reduce((acc, ele) => {
            acc.push(ele.img)
            return acc
          }, []).forEach(ele => {

            createImgElement(ele)
          })
        })
    })

})

const addCardForm = document.querySelector('.add-card-form')
addCardForm.addEventListener('submit', event => {
  event.preventDefault()

  const display = document.querySelector('.add-card-modal-body')
  empty(display)

  let searchQuery = {}
  searchQuery.name = textQueryCreator(event.target.cardQuery.value)
  let queryText = `?`
  for (let key in searchQuery) {
    const keyValueText = `${key}=${searchQuery[key]}`
    queryText += `${keyValueText}&`
  }
  queryText = queryText.slice(0, queryText.length - 1)

  axios.get(`https://api.magicthegathering.io/v1/cards${queryText}`)
    .then(response => {

      cards = response.data.cards.map(card => {
        return returnDisplay(card)
      })

      // cards.reduce((acc, ele) => {
      //     acc.push({
      //       img: ele.img,
      //       id: ele.multiverseId
      //     })
      //     return acc
      //   }, [])

      cards.forEach(ele => {
        const putArray = []
        display.appendChild(createImgElementInModal(ele))
      })
      const cardArray = document.querySelectorAll('.library-img')
    })
})

const addCard = document.querySelector('.card-add')
addCard.addEventListener('click', event => {
  const successText = document.querySelector('.success-display')
  successText.classList.add('show')
  setTimeout(() => {
    successText.classList.remove('show')
  }, 2000)
  request('/auth/token')
    .then(response => {

      return request(`/users/${response.data.id}/cards`, 'post', selectedCards)
    })
    .then(response => {
      selectedCards = []
    })
})

const removeCardForm = document.querySelector('.remove-card-form')
removeCardForm.addEventListener('submit', event => {
  event.preventDefault()

  const display = document.querySelector('.remove-card-modal-body')
  empty(display)

  let searchQuery = {}
  searchQuery.name = textQueryCreator(event.target.removeCardQuery.value)
  let queryText = `?`
  for (let key in searchQuery) {
    const keyValueText = `${key}=${searchQuery[key]}`
    queryText += `${keyValueText}&`
  }
  queryText = queryText.slice(0, queryText.length - 1)

  request('/auth/token')
    .then(response => {

      request(`/users/${response.data.id}/cards${queryText}`)
        .then(response => {
          cards = response.data

          cards.reduce((acc, ele) => {
              acc.push({
                img: ele.img,
                id: ele.id
              })
              return acc
            }, [])
            .forEach(ele => {
              display.appendChild(createRemoveImgElementInModal(ele))
            })
          const cardArray = document.querySelectorAll('.library-img')
        })
    })
})

const removeCard = document.querySelector('.card-remove')
removeCard.addEventListener('click', event => {
  const successText = document.querySelector('.remove-success-display')
  successText.classList.add('show')
  setTimeout(() => {
    successText.classList.remove('show')
  }, 2000)
  request('/auth/token')
    .then(response => {

      request(`/users/${response.data.id}/cards`, 'delete', selectedCards)
    })
})

let selectedCards = [];

function createImgElementInModal(obj) {
  let img = document.createElement('img')
  img.setAttribute('src', obj.img)
  img.setAttribute('data-id', obj.id)
  img.classList.add('library-img')
  img.addEventListener('click', event => {
    img.classList.add('selected')
    selectedCards.push(obj)
  })
  return img
}

function createRemoveImgElementInModal(string) {
  let img = document.createElement('img')
  img.setAttribute('src', string.img)
  img.setAttribute('data-id', string.id)
  img.classList.add('library-img')
  img.addEventListener('click', event => {
    img.classList.add('selected')
    selectedCards.push(cards.find(obj => obj.id == event.target.getAttribute('data-id')))
  })
  return img
}

const addCardCancel = document.querySelector('.card-add-cancel')
addCardCancel.addEventListener('click', event => {
  const display = document.querySelector('.add-card-modal-body')
  empty(display)
})

const removeCardCancel = document.querySelector('.card-remove-cancel')
removeCardCancel.addEventListener('click', event => {
  const display = document.querySelector('.remove-card-modal-body')
  empty(display)
})

function returnDisplay(obj) {
  let resultObj = {}
  if (obj.colors) {
    resultObj = {
      multiverseId: obj.multiverseid,
      name: obj.name,
      cmc: obj.cmc,
      text: obj.text || 'none',
      red: obj.colors.includes('Red') ? true : false,
      black: obj.colors.includes('Black') ? true : false,
      green: obj.colors.includes('Green') ? true : false,
      white: obj.colors.includes('White') ? true : false,
      blue: obj.colors.includes('Blue') ? true : false,
      colorless: false,
      img: obj.imageUrl,
      type: obj.types,
      subtype: obj.subtypes || []
    }
  } else {
    resultObj = {
      multiverseId: obj.multiverseid,
      name: obj.name,
      cmc: obj.cmc,
      text: obj.text || 'none',
      red: false,
      black: false,
      green: false,
      white: false,
      blue: false,
      colorless: true,
      img: obj.imageUrl,
      type: obj.types,
      subtype: obj.subtypes || []
    }
  }
  return resultObj
}

function textQueryCreator(string) {
  let newString = string.trim()
    .split(' ')
    .join('%20')
  return newString
}

function createImgElement(string) {
  const display = document.querySelector('.library-display')
  let img = document.createElement('img')
  img.setAttribute('src', string)
  img.classList.add('library-img')
  display.appendChild(img)
}

// function createImgElementInModal(string){
//   const display = document.querySelector('.add-card-to-deck-modal-body')
//   let img = document.createElement('img')
//   img.setAttribute('src', string)
//   img.classList.add('library-img')
//   display.appendChild(img)
// }

function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

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
            window.location = `decks.html?id=${response.data.data.id}`

          // const newDeckNameTitle = document.querySelector('.new-deck-name-title')
          // newDeckNameTitle.innerHTML = event.target.cardNameValue.value
          // libraryCont.classList.add('hide')
          // decksCont.classList.add('hide')
          // newDeckCont.classList.remove('hide')

          // renderMyDecks(event.target.cardNameValue.value)

          $('#addDeckModal').modal('hide')
          }) 
})

function renderMyDecks(id, name){
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



const addCardToDeckForm = document.querySelector('.library-deck-form')
addCardToDeckForm.addEventListener('submit', event => {
  event.preventDefault()
  const display = document.querySelector('.add-card-to-deck-modal-body')
  empty(display)
  let searchQuery = {}
  if (event.target.createDeckRadios.value === 'name' && event.target.AddDeckSearchTerm.value) {
    searchQuery.name = textQueryCreator(event.target.AddDeckSearchTerm.value)
  }
  if (event.target.createDeckRadios.value === 'type' && event.target.AddDeckSearchTerm.value) {
    searchQuery.type = textQueryCreator(event.target.AddDeckSearchTerm.value)
  }
  if (event.target.createDeckRadios.value === 'subtype' && event.target.AddDeckSearchTerm.value) {
    searchQuery.subtype = textQueryCreator(event.target.AddDeckSearchTerm.value)
  }
  if (event.target.createDeckRadios.value === 'text' && event.target.AddDeckSearchTerm.value) {
    searchQuery.text = textQueryCreator(event.target.AddDeckSearchTerm.value)
  }
  if (event.target.white.checked === true) {
    searchQuery.white = true
  }
  if (event.target.blue.checked === true) {
    searchQuery.blue = true
  }
  if (event.target.black.checked === true) {
    searchQuery.black = true
  }
  if (event.target.red.checked === true) {
    searchQuery.red = true
  }
  if (event.target.green.checked === true) {
    searchQuery.green = true
  }
  if (event.target.colorless.checked === true) {
    searchQuery.colorless = true
  }
  let queryText = `?`
  for (let key in searchQuery) {
    const keyValueText = `${key}=${searchQuery[key]}`
    queryText += `${keyValueText}&`
  }
  queryText = queryText.slice(0, queryText.length - 1)

  request('/auth/token')
    .then(response => {
      request(`/users/${response.data.id}/cards${queryText}`)
        .then(data => {
          let cards = data.data
          cards.reduce((acc, ele) => {
            acc.push({
              img: ele.img
            })
            return acc
          }, [])
          cards.forEach(ele => {

            display.appendChild(createImgElementInModal(ele))
          })
        })
    })
})

// const addCardToDeck = document.querySelector('.card-add-to-deck')
// addCardToDeck.addEventListener('click', event => {

//   request(`/auth/token`)
//     .then(response => {
//       request(`/users/${response.data.id}/decks/`)
//     })
// })

