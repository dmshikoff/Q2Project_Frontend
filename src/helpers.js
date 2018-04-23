function request(path, method = 'get', body = null) {
  let bearerToken = ''
  const token = localStorage.getItem('token')

  if (token) {
    bearerToken = `Bearer ${token}`
  }

  return axios(`http://localhost:3000${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': bearerToken
    },
    data: body
  })
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
  display.appendChild(img)
}

function createImgElementInModal(string) {
  const display = document.querySelector('.add-card-modal-body')
  let img = document.createElement('img')
  img.setAttribute('src', string)
  display.appendChild(img)
}