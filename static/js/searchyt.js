angular.module('mixtapemaker')
  .controller('SearchYT', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.searching = false
    $scope.addedVideos = []
    $scope.$on('searching', function(){
      $scope.searching = true
    })
    $scope.searchVideos = () => {
      let API_KEY= 'AIzaSyDCpSBcCWvzr4mqRS5b6LwYFwD6C9Nx_z4'
      axios.get(`https://www.googleapis.com/youtube/v3/search?q=${$scope.key}&part=snippet&key=${API_KEY}&type=video`)
          .then(result =>{
            debugger
            $scope.$apply(function(){
              $scope.addedVideos = []
              $scope.result = result.data.items
            })
          })
    }
    $scope.addVideo = (videoId, videoName, index) => {
      $rootScope.$broadcast('addVideo', {name: videoName, ytId: videoId, index: index})
    }
    $scope.$on('addedVideo', function(event, next, current){
      $scope.addedVideos.push(next.index)
    })
    $scope.end = () => {
      $scope.searching = false
      $scope.addedVideos = []
      $scope.result = []
      $rootScope.$broadcast('notsearching')
    }
  }])
