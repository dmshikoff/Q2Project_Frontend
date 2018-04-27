function request(path, method = 'get', body = null) {
  let bearerToken = ''
  const token = localStorage.getItem('token')

  if (token) {
    bearerToken = `Bearer ${token}`
  }

// https://obscure-stream-61170.herokuapp.com <---- deployed url

  return axios(`https://obscure-stream-61170.herokuapp.com${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': bearerToken
    },
    data: body
  })
}

function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}