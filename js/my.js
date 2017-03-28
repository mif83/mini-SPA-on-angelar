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

app.controller('firstCtrl', function($http, $scope, $location) {
 $scope.startSearch = function (text,num) {

     var num = num || "1";
     $http.get('https://api.github.com/search/repositories?q='+text+'&per_page=10&page='+num)
         .then(function (result) {
             console.log('success', result);
             $scope.result = result.data.items;
             $location.path("search/"+$scope.search+"/page/"+ num);
            // $scope.search = null;
         })
         .catch(function (err) {
             console.log(err);
         })
 };
 $scope.pressEnter = function (event) {
     if (event.which === 13)
         $scope.startSearch($scope.search);
 }
});

app.filter('dataFilter', function () {
    return function (str) {
        return str.split("T")[0];
    }
});