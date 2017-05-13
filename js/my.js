/**
 * Created by dima on 28.03.2017.
 */

var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/',{
            template:''
        })
        .when('/search/:text/page/:pagenamber', {
            templateUrl: 'search-result.html',
            controller: 'firstCtrl'
        })
        .otherwise({
            template: '<h1>404 no such page</h1>'
        })
});

app.controller('firstCtrl', function($http, $scope, $location, $routeParams) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
         if(!$scope.result) return 0;
        return Math.ceil($scope.result.length/$scope.pageSize);
    };
    if ($scope.result&&$routeParams.pagenamber){
        if ($routeParams.pagenamber <=0 || $routeParams.pagenamber > $scope.pageSize){
            $location.path("search/"+$scope.search+"/page/"+ 1);
            return;
        }
            $scope.currentPage = $routeParams.pagenamber-1;
    } else{
        $location.path("/");
    }
    $scope.startSearch = function (text) {

        $http.get('https://api.github.com/search/repositories?q='+text+'&per_page=99')
            .then(function (result) {
                $scope.result = result.data.items;
                $location.path("search/"+$scope.search+"/page/"+ 1);
              })
            .catch(function (err) {
                console.log(err);
            })
    };
    $scope.pressEnter = function (event) {
        if (event.which === 13)
            $scope.startSearch($scope.search);
    };
    $scope.prev = function () {
        $scope.currentPage--;
        $location.path("search/"+$scope.search+"/page/"+ ($scope.currentPage+1));
    };
    $scope.next = function () {
        $scope.currentPage++;
        $location.path("search/"+$scope.search+"/page/"+ ($scope.currentPage+1));
    };


});

app.filter('dataFilter', function () {
    return function (str) {
        return str.split("T")[0];
    }
});
app.filter('startFrom', function() {
    return function(input, start) {
        if(!input) return;
        start = +start;
        return input.slice(start);
    }
});