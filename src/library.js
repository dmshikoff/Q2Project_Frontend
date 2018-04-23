(function() {
    'use strict';
  
    // auth gate
    request('/auth/token')
    .then(function(response){
      // user is logged in
      document.querySelector('.user-id').innerHTML = response.data.id
    })
    .catch(function(error){
      // user is not logged in
      window.location = '/index.html'
    })
});

const librarySearch = document.querySelector('.library-search-form')
librarySearch.addEventListener('submit', event => {
  event.preventDefault()
  let searchQuery = {}
  if(event.target.exampleRadios.value === 'name' && event.target.searchTerm.value){
    searchQuery.name = textQueryCreator(event.target.searchTerm.value)
  }
  if(event.target.exampleRadios.value === 'type' && event.target.searchTerm.value){
    searchQuery.type = textQueryCreator(event.target.searchTerm.value)
  }
  if(event.target.exampleRadios.value === 'subtype' && event.target.searchTerm.value){
    searchQuery.subtype = textQueryCreator(event.target.searchTerm.value)
  }
  if(event.target.exampleRadios.value === 'text' && event.target.searchTerm.value){
    searchQuery.text = textQueryCreator(event.target.searchTerm.value)
  }
  if(event.target.white.checked === true){
    searchQuery.white = true
  }
  if(event.target.blue.checked === true){
    searchQuery.blue = true
  }
  if(event.target.black.checked === true){
    searchQuery.black = true
  }
  if(event.target.red.checked === true){
    searchQuery.red = true
  }
  if(event.target.green.checked === true){
    searchQuery.green = true
  }
  let queryText = `?`
  for(let key in searchQuery){
    const keyValueText = `${key}=${searchQuery[key]}`
    queryText += `${keyValueText}&`
  }
  queryText = queryText.slice(0, queryText.length - 1)

  axios.get(`http://localhost:3000/cards${queryText}`)
  .then(response => {
    let img = response.data.reduce((acc,ele) => {
      acc.push(ele.img)
      return acc
    },[]).forEach(ele => {
    
      createImgElement(ele)
    })
  })
})

const addCardForm = document.querySelector('.add-card-form')
addCardForm.addEventListener('submit', event => {
  event.preventDefault()
  let searchQuery = {}
  searchQuery.name = textQueryCreator(event.target.cardQuery.value)
  let queryText = `?`
  for(let key in searchQuery){
    const keyValueText = `${key}=${searchQuery[key]}`
    queryText += `${keyValueText}&`
  }
  queryText = queryText.slice(0, queryText.length - 1)

  axios.get(`https://api.magicthegathering.io/v1/cards${queryText}`)
  .then(response => {
    console.log(response)
    let img = response.data.cards.reduce((acc,ele) => {
      acc.push(ele.imageUrl)
      return acc
    },[]).forEach(ele => {
    
      createImgElementInModal(ele)
    })
  })
})


