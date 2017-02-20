angular.module('mixtapemaker')
  .controller('Playlist', ['$scope', '$timeout', '$rootScope', function($scope, $timeout, $rootScope){
    $scope.signedin = false
    $scope.searching = false
    $scope.modifying = false
    $scope.currentPlaylist = false
    $scope.gotVideos = false
    $scope.currentVideo = -1
    $scope.ytImgHover = 'img/ytHover.png'
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
    $scope.searchPlaylists = () => {
        $scope.searching = true
        $rootScope.$broadcast('searchpl')
    }
    $scope.changePlaylist = (index) => {
      $scope.currentPlaylist = $scope.playlists[index]
    }
    $scope.search = () => {
      $scope.searching = true
      $rootScope.$broadcast('searching')
    }
    $scope.imgMouseOver = (index) => {
      document.getElementById('img'+index).children[1].src = document.location.href+"static/img/ytHover.png"
    }
    $scope.imgMouseLeave = (index) => {
      document.getElementById('img'+index).children[1].src = document.location.href+"static/img/ytPlay.png"
    }
    $scope.$on('youtube.player.ended', function($event, player){
      debugger
      let index = $scope.playlists.findIndex(elem=>{return elem===$scope.currentPlaylist})
      let nextVideo = index >= $scope.currentPlaylist.videos.length-1 ? 'play1' : 'play'+(index+1)
      // debugger
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
    $scope.imgUrl = (id) => {
      return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'
    }
    $scope.getIframeSrc = function(src){
      return 'https://www.youtube.com/embed/'+src
    }
    $scope.$on('addVideo', function(event, next, current){
      // debugger
      axios({method: 'POST', url: `/playlists/`+$scope.currentPlaylist.dbId,
              data: {'videoId': next.ytId, 'videoName': next.name}
    }).then(result=>{
      if (result.status === 200) {
        $rootScope.$broadcast('addedVideo', {index: next.index})
        $scope.$apply(function(){
          $scope.currentPlaylist.videos.push({name: next.name, ytId: next.ytId})
        })
      }
      else { $scope.$apply( () =>  { $scope.addVideoError = true }) }
    })})
    $scope.$on('notsearching', function(){
      $scope.searching = false
    })
    $scope.$on('endsearchpl', function(){
      $scope.searching = false
    })
    $scope.$on('addpl', function(event, next){
      axios({method: 'PUTS', url: '/playlists/'+next.plId+"/"+$scope.userId}).then(result=>{
        if (result.status === 200){
          debugger
          $scope.playlists.push(result.data[0])
        }
        else {
          console.log("Nope")
        }
      })
    })
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
    $scope.$on('signout', function() {
      $scope.signedin = false
      $scope.playlists = []
    })
    $scope.signout = () => {
      $rootScope.$broadcast('signout')
    }
    $scope.modifyingList = () => { $scope.modifying = !$scope.modifying }
    $scope.$on('signedin', function(event, next, current){
      $scope.email = next.email
      $scope.userId = next.id
      $scope.playlists = []
      for (let i = 0; i < next.data.length; i++) {$scope.playlists.push({name: next.data[i].name, dbId: next.data[i]._id.$oid, videos: next.data[i].videos})}
      $scope.signedin = true
      $scope.currentPlaylist = $scope.playlists[0]
    })
    $scope.printScope = () => { console.log($scope) }
  }])
