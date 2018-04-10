
// Cube Service Parameters
// URL Cube Service String
var connServiceString = "http://localhost:9097/";
//var connServiceString = "https://portal.cube-usa.com/api/";

// Server Authorization
var ServerAuth = "Basic Y3ViZXU6Y3ViZTIwMTc=";
// End Cube Service Parameters

angular.element(function() {
    angular.bootstrap(document, ['CubeShopModule']);
});

function testInterceptor() {
  return {
    request: function(config) {
      if (!config.url.startsWith(connServiceString + "CubeClientAuthentication.ashx")) {
        if (localStorage.cnnData2 == 'undefined'){
          window.location = 'index.html';
        }
      }
      return config;
    },
  }
}

angular.module('CubeShopModule', ['angularFileUpload', 'darthwade.loading', 'ngTagsInput', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.toggle', 'dndLists', 'ngPatternRestrict', 'angular.filter'])

        .controller('ctrlCubeShopHomeController', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

          localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';

          var cnnData = JSON.parse(localStorage.cnnData2);

          function getArray(object){
              if (Array.isArray(object)){
                return object;
              }
              else{
                return [object]
              }
          }

          var headers = {"Authorization": ServerAuth};

          if (typeof localStorage.cnnData2 != 'undefined'){

            $loading.start('myloading');

            $scope.cnnData = cnnData;

            $scope.ProductCards = [];

            $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_Services_History_Customer","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {

              $scope.ProductCards = response.data.CubeFlexIntegration.DATA;

              var lFila = 1;
              var lContador = 1;

              $scope.ProductCards.forEach(function(el){
                el.Fila = lFila;
                if (lContador % 3 == 0){
                  lFila = lFila + 1;
                }
                lContador = lContador + 1;
              })

              console.log($scope.ProductCards);

            })
            .catch(function (data) {
              console.log('Error 16');
              console.log(data);
              swal("Cube Service", "Unexpected error. Check console Error 16.");
            });

          }
          else{
            window.location = 'index.html';
          }

        }])
