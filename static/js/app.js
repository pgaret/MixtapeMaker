angular.module('mixtapemaker', ['youtube-embed'])
  .config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{a')
    $interpolateProvider.endSymbol('a}')
  }])
  .config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://www.youtube.com/**'
      ])
  })
  .controller('Main', ['$scope', '$rootScope', function($scope, $rootScope){
    window.onbeforeunload = function(){
      axios.post('/signout').then(result=>{
        $rootScope.$broadcast('signout')
      })
    }
  }])
