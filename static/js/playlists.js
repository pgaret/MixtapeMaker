angular.module('playlister')
  .controller('Playlist', ['$scope', function($scope){
    $scope.signedin = false
    $scope.modifying = false
    $scope.currentPlaylist = false
    $scope.gotVideos = false
    $scope.playlists = []
    $scope.videos = []
    $scope.result = []
    $scope.createPlaylist = () => {
      axios({method: 'POST', url: '/playlists',
            data: {'playlistName': $scope.playlistName}
      }).then(result=>{
          if (result.status === 200) {
            $scope.$apply(function(){
              $scope.playlists.push({name: $scope.playlistName, dbId: result.data[0]._id.$oid, videos: []})
              console.log($scope.playlists)
              $scope.currentPlaylist = $scope.playlists.length - 1
          }) } else {
            $scope.$apply(function(){ $scope.playlisterror = true; }) } })
    }
    $scope.searchVideos = () => {
      let API_KEY= 'AIzaSyDCpSBcCWvzr4mqRS5b6LwYFwD6C9Nx_z4'
      axios.get(`https://www.googleapis.com/youtube/v3/search?q=${$scope.searchTerm}&part=snippet&key=${API_KEY}&type=video`)
          .then(result =>{
              $scope.$apply(function(){
                  $scope.result = result.data.items
                  $scope.gotVideos = true
              })
          })
    }
    $scope.getIframeSrc = function(src){
      return 'https://www.youtube.com/embed/'+src
    }
    $scope.addVideo = (videoId, videoName) => {
      axios({method: 'POST', url: `/playlists/`+$scope.playlists[$scope.currentPlaylist].dbId,
              data: {'videoId': videoId, 'videoName': videoName}
    }).then(result=>{
      if (result.status === 200) {
        $scope.$apply(function(){
          $scope.playlists[$scope.currentPlaylist].videos.push({name: videoName, ytId: videoId, dbId: result.data[0]._id.$oid})
        })
      }
      else { $scope.$apply( () =>  { $scope.addVideoError = true }) }
    })}
    $scope.removeVideo = (videoId) => {
      axios({method: 'DELETE', url: '/playlists/'+$scope.playlists[$scope.currentPlaylist].dbId+"/"+videoId}
      ).then(result=>{
        if (result.status === 200){
          for (let i = 0; i < $scope.playlists[$scope.currentPlaylist].videos.length; i++){
            if ($scope.playlists[$scope.currentPlaylist].videos[i].name === videoId){
              $scope.$apply(()=>{
                $scope.playlists[$scope.currentPlaylist].videos.splice(i, 1)
                return null
              })
            }
          }
        }
        else {
          console.log("failure to delete")
        }
    })
    }
    $scope.modifyingList = () => { $scope.modifying = true }
    $scope.$on('signedin', function(event, next, current){
      $scope.email = next.email
      for (let i = 0; i < next.data.length; i++) {$scope.playlists.push({name: next.data[i].name, dbId: next.data[i]._id.$oid, videos: next.data[i].videos})}
      $scope.signedin = true
      $scope.currentPlaylist = 0
    })
    $scope.$on('signedout', function(){ $scope.signedin = false })
    $scope.printScope = () => { console.log($scope) }
  }])
