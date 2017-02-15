angular.module('mixtapemaker')
  .controller('Account', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.currentState = 'signin'
    $scope.signinerror = false
    $scope.signedin = false
    $scope.printScope = () => {
      console.log($scope)
    }
    $scope.switchState = (state) => {
      $scope.currentState = state
    }
    $scope.signup = () => {
      $scope.signingup = true
      axios({method: 'POST', url: '/users',
        data: {'email': $scope.uemail, 'password': $scope.upassword}
      }).then(result=>{
        if (result.status === 200){
          $scope.$apply(function(){
            $scope.signingup = false
            $scope.signedin = true
            $scope.signuperror = false
            $scope.signinerror = false
            $scope.$parent.$broadcast('signedin', {email: $scope.uemail, data: []})
          })
        } else {
          $scope.$apply(function(){
            $scope.signingup = false
            $scope.signuperror = true
            $scope.signinerror = false
            $scope.signedin = false
          })
        }
      })
    }
    $scope.signin = () => {
      $scope.signingin = true
      axios({method: 'POST', url: '/sessions',
        data: {'email': $scope.iemail, 'password': $scope.ipassword}
      }).then(result=>{
        if (result.status === 200){
          $scope.$apply(function(){
            $scope.signingin = false
            $scope.upassword = ""; $scope.ipassword = "";
            $scope.$parent.$broadcast('signedin', {email: $scope.iemail, data: result.data})
            $scope.iemail = "";  $scope.uemail = "";
            $scope.signedin = true
            $scope.signinerror = false
            $scope.signuperror = false
            $scope.currentState = 'signin'
          })
        } else {
          $scope.$apply(function(){
            $scope.signingin = false
            $scope.upassword = ""; $scope.ipassword = "";
            $scope.signinerror = true
            $scope.signuperror = false
            $scope.signedin = false
          })
        }
      })
    }
    $scope.$on('signout', function(){
      $scope.signedin = false
      $scope.signinerror = false
      $scope.signuperror = false
      $scope.iemail = ""; $scope.uemail = ""; $scope.ipassword = ""; $scope.upassword = ""
    })
  }])
