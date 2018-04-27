
//ON PAGE LOAD DISPLAY//

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

const accountName = document.querySelector('.your-account-name')
request(`/auth/token`)
.then(response => {
  return request(`/users/${response.data.id}`)
})
.then(response => {
  accountName.innerHTML = `Welcome, ${response.data.data[0].username}`
})

const logout = document.querySelector('.logout-button')
logout.addEventListener('click', event => {
  window.location = 'index.html'
  localStorage.removeItem('token')
})


const searchString = window.location.search.slice(1).split('&').map(ele => {
    const [key, value] = ele.split('=')
    return {
        [key]: value
    }
}).reduce((acc, ele) => {
    return { ...acc,
        ...ele
    }
}, {})

const newDeckNameTitle = document.querySelector('.new-deck-name-title')
request('/auth/token')
    .then(response => {
        return request(`/users/${response.data.id}/decks/${searchString.id}`, 'get')
    })
    .then(response => {
        newDeckNameTitle.innerHTML = response.data.data[0].name
    })

request('/auth/token')
    .then(response => {
        return request(`/users/${response.data.id}/decks/${searchString.id}/cards`, 'get')
    })
    .then(response => {
        const newDeckDisplay = document.querySelector('.new-deck-display')
        response.data.data.forEach(obj => {
            newDeckDisplay.appendChild(createImgElement(obj))
        })
    })

// PAGE BUTTON FUNCTIONALITY //

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

let selectedCards = []
const addCardToDeck = document.querySelector('.card-add-to-deck')
addCardToDeck.addEventListener('click', event => {

    request('/auth/token')
        .then(response => {

            return request(`/users/${response.data.id}/decks/${searchString.id}/cards`, 'post', selectedCards)
        })
        .then(response => {
            return request(`/users/${response.data.id}/someCards`, 'post', response.data.data)
        })
        .then(response => {
            const newDeckDisplay = document.querySelector('.new-deck-display')
            response.data.data.map(dataArray => {
                dataArray.forEach(obj => {
                    newDeckDisplay.appendChild(createImgElement(obj))
                })
            })
        })
})

// HELPER FUNCTIONS SPECIFIC TO THIS PAGE //

function textQueryCreator(string) {
    let newString = string.trim()
        .split(' ')
        .join('%20')
    return newString
}

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

function createImgElement(obj) {
    let img = document.createElement('img')
    img.setAttribute('src', obj.img)
    img.setAttribute('data-id', obj.id)
    img.classList.add('library-img')
    return img
}

