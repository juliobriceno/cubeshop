
// Cube Service Parameters
// URL Cube Service String
// var connServiceString = "http://localhost:9097/";
var connServiceString = "https://cubeshop.herokuapp.com/";
// var connServiceString = "http://cube-mia.com/api/";

// var connServiceStringGateway = "http://localhost:61093/BodApp.asmx/";
var connServiceStringGateway = "http://asp.joka.com.ve/BodApp.asmx/";
//var connServiceStringGateway = "http://cubeshope.joka.com.ve/BodApp.asmx/";
// var connServiceString = "https://portal.cube-usa.com/api/";

// Server Authorization
var ServerAuth = "Basic Y3ViZXU6Y3ViZTIwMTc=";
// End Cube Service Parameters

angular.element(function() {
    angular.bootstrap(document, ['JokaModule']);
});

angular.module('JokaModule', ['darthwade.loading', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngPatternRestrict'])

.controller('ctrlInsertCmmment', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  $scope.SaveComments = function() {

    $scope.newAccount.$setSubmitted();

    if (!$scope.newAccount.$valid)
    {
      swal("Joka", "Hay datos inválidos.");
      return 0
    }

    var strInsert = 'Insert_Comments?obj={"method":"Insert_Comments", "nombre": "' + $scope.MsgNombre + '", "email": "' + $scope.MsgCorreo + '", "mensaje": "' + $scope.MsgMensaje + '"}'

    // Save the User
    $http.get(connServiceStringGateway + strInsert).then(function (response) {

      $scope.MsgNombre = '';
      $scope.MsgCorreo = '';
      $scope.MsgMensaje = '';

      swal("Joka", "Su mensaje fue entregado.");
      return 0

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

}])
