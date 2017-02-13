angular.module('playlister')
  .controller('Playlist', ['$scope', '$timeout', '$rootScope', function($scope, $timeout, $rootScope){
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
              $scope.currentPlaylist = $scope.playlists[$scope.playlists.length - 1]
              $scope.modifying = false
          }) } else {
            $scope.$apply(function(){ $scope.playlisterror = true; }) } })
    }
    $scope.changePlaylist = (index) => {
      $scope.currentPlaylist = $scope.playlists[index]
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
    $scope.$on('youtube.player.ended', function($event, player){
      let nextVideo = player.g >= $scope.currentPlaylist.videos.length ? 'play1' : 'play'+(player.g+1)
      $timeout(function(){
        // debugger
        document.getElementById(nextVideo).click()
      })
    })
    $scope.parseName = function(name){
      if (name.length > 25){
        return name.substring(0, 25)+"..."
      } else{
        return name
      }
    }
    $scope.getIframeSrc = function(src){
      return 'https://www.youtube.com/embed/'+src
    }
    $scope.addVideo = (videoId, videoName) => {
      axios({method: 'POST', url: `/playlists/`+$scope.currentPlaylist.dbId,
              data: {'videoId': videoId, 'videoName': videoName}
    }).then(result=>{
      if (result.status === 200) {
        $scope.$apply(function(){
          $scope.currentPlaylist.videos.push({name: videoName, ytId: videoId, dbId: result.data[0]._id.$oid})
        })
      }
      else { $scope.$apply( () =>  { $scope.addVideoError = true }) }
    })}
    $scope.removeVideo = (videoId) => {
      axios({method: 'DELETE', url: '/playlists/'+$scope.currentPlaylist.dbId+"/"+videoId}
      ).then(result=>{
        if (result.status === 200){
          for (let i = 0; i < $scope.currentPlaylist.videos.length; i++){
            if ($scope.currentPlaylist.videos[i].name === videoId){
              $scope.$apply(()=>{
                $scope.currentPlaylist.videos.splice(i, 1)
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
    $scope.signout = () => {
      $rootScope.$broadcast('signout')
      $scope.signedin = false
    }
    $scope.modifyingList = () => { $scope.modifying = true }
    $scope.$on('signedin', function(event, next, current){
      $scope.email = next.email
      for (let i = 0; i < next.data.length; i++) {$scope.playlists.push({name: next.data[i].name, dbId: next.data[i]._id.$oid, videos: next.data[i].videos})}
      $scope.signedin = true
      $scope.currentPlaylist = $scope.playlists[0]
    })
    $scope.printScope = () => { console.log($scope) }
  }])
