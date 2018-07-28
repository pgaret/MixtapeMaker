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
        $rootScope.$broadcast('searchpl', {email: $scope.email})
    }
    $scope.changePlaylist = (index) => {
      $scope.currentVideo = -1
      $scope.currentPlaylist = $scope.playlists[index]
    }
    $scope.search = () => {
      $scope.searching = true
      $rootScope.$broadcast('searching')
    }
    $scope.searchMuse = () => {
      axios({method: 'GET', url: `/setlistfm/muse`}).then(result=>{
        if (result.status === 200) {
          console.log(result);
        }
        else { 
          console.log(result);
        }
      })
    }
    $scope.imgMouseOver = (index) => {
      document.getElementById('img'+index).children[1].src = document.location.href+"static/img/ytHover.png"
    }
    $scope.imgMouseLeave = (index) => {
      document.getElementById('img'+index).children[1].src = document.location.href+"static/img/ytPlay.png"
    }
    $scope.$on('youtube.player.ended', function($event, player){
      if ($scope.currentVideo === $scope.currentPlaylist.videos.length - 1){
        $scope.currentVideo = 0
      }
      else {
        $scope.currentVideo +=1
      }
    })
    $scope.startVideo = (index) => {
      $scope.currentVideo = index
    }
    $scope.imgStyle = (index) => {
      if (index % 3 === 0){
        return {}
      } else if (index % 3 === 1){
        return {margin: '0 2%'}
      } else {
        return {margin: '0'}
      }
    }
    $scope.imgUrl = (id) => {
      return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'
    }
    $scope.getMargin = (index) => {
      return (index*3) + 'vw'
    }
    $scope.getIframeSrc = function(src){
      return 'https://www.youtube.com/embed/'+src
    }
    $scope.$on('addVideo', function(event, next, current){
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
      $scope.currentVideo = -1
    })
    $scope.$on('addpl', function(event, next){
      axios({method: 'PUTS', url: '/playlists/'+next.plId+"/"+$scope.userId}).then(result=>{
        if (result.status === 200){
          $scope.$apply(function(){
            $scope.playlists.push({dbId: result.data[0]._id.$oid, name: result.data[0].name, users: result.data[0].users, videos: result.data[0].videos,})
            $scope.currentPlaylist = $scope.playlists[$scope.playlists.length - 1]
          })
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
                if ($scope.currentVideo === i) { $scope.currentVideo = -1 }
                $scope.currentPlaylist.videos.splice(i, 1)
          })}}
        } else {
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
    $scope.modifyingList = () => {
      $scope.modifying = !$scope.modifying
      $scope.playlisterror = ''
      $scope.playlistName = ''
    }
    $scope.$on('signedin', function(event, data){
      $scope.email = data.email
      $scope.userId = data.id
      $scope.playlists = []
      for (let i = 0; i < data.data.length; i++) {$scope.playlists.push({name: data.data[i].name, dbId: data.data[i]._id.$oid, videos: data.data[i].videos})}
      $scope.signedin = true
      $scope.currentPlaylist = $scope.playlists[0]
    })
    $scope.printScope = () => { console.log($scope) }
  }])
