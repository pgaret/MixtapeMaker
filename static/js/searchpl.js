angular.module('mixtapemaker')
  .controller('SearchPl', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.addedPlaylists = []
    $scope.searching = false
    $scope.key = ''
    $scope.$on('searchpl', function(event, data){
      $scope.searching = true
      $scope.email = data.email
    })
    $scope.end = () => {
      $scope.searching = false
      $scope.addedPlaylists = []
      $scope.playlists = []
      $scope.key = ''
      $rootScope.$broadcast('notsearching')
    }
    $scope.searchMixtapes = () => {
      axios({method: 'GET', url:'/playlists/search/'+$scope.key}).then(result=>{
        $scope.$apply(function(){
          $scope.playlists = result.data
        })
      })
    }
    $scope.addPlaylist = (index) => {
      $scope.addedPlaylists.push(index)
      $rootScope.$broadcast('addpl', {'plId': $scope.playlists[index]._id.$oid})
    }
    $scope.printScope = () => { console.log($scope) }
  }])
