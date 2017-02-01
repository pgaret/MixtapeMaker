angular.module('playlister', [])
  .config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{a')
    $interpolateProvider.endSymbol('a}')
  }])
  .controller('Account', ['$scope', function($scope) {
    window.onbeforeunload = function(){
      $scope.$apply(function(){
        $scope.signinerror = false
      })
    }
    $scope.signinerror = false
    $scope.signedin = false
    $scope.signup = () => {
      axios({method: 'POST', url: '/users',
        data: {email: $scope.uemail, password: $scope.upassword}
      }).then(result=>{
        if (result.status === 200){
          $scope.$apply(function(){
            $scope.signedin = true
            $scope.signuperror = false
          })
        } else {
          $scope.$apply(function(){
            $scope.signuperror = true
            $scope.signedin = false
          })
        }
      })
    }
    $scope.signin = () => {
      axios({method: 'POST', url: '/sessions',
        data: {email: $scope.iemail, password: $scope.ipassword}
      }).then(result=>{
        if (result.status === 200){
          $scope.$apply(function(){
            $scope.signedin = true
            $scope.signinerror = false
          })
        } else {
          $scope.$apply(function(){
            $scope.signinerror = true
            $scope.signedin = false
          })
        }
      })
    }
    $scope.signout = () => {
      axios.post('/signout').then(result=>{
        console.log("Logged out")
      })
    }
  }])
