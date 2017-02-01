function search(){
  let API_KEY= 'AIzaSyDCpSBcCWvzr4mqRS5b6LwYFwD6C9Nx_z4'
  let searchTerm = document.getElementById("input").value
  let list = document.getElementById("list")
  axios.get(`https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&part=snippet&key=${API_KEY}&type=video`)
      .then(result =>{
          result.data.items.forEach((item)=>{
            let bullet = document.createElement("LI")
            let btn = document.createElement("BUTTON")
            btn.id = item.id.videoId; btn.append('Save'); btn.onclick = postSong
            bullet.append(item.snippet.title); bullet.append(btn); list.append(bullet)
          })
      })
  }

function postSong(){
  debugger
}
