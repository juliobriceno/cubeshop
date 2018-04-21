
// Cube Service Parameters
// URL Cube Service String
// var connServiceString = "http://localhost:9097/";
//var connServiceString = "https://cubeshop.herokuapp.com/";
var connServiceString = "https://portal.cube-usa.com/api/";

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


    $scope.FindMaincategories = function() {
      $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {

        $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

        var lFila = 1;
        var lContador = 1;

        $scope.ProductCards.forEach(function(el){
          el.Fila = lFila;
          el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
          if (lContador % 3 == 0){
            lFila = lFila + 1;
          }
          lContador = lContador + 1;
        })

        $scope.ProductCardsMainMenu = getArray(response.data.CubeFlexIntegration.DATA);

      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });
    }

    $scope.FindMaincategories();

    $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {

      var MasterData = response.data.CubeFlexIntegration.DATA;

      var MasterInfo = {};

      MasterInfo.Home = true;
      MasterInfo.Products = true;
      MasterInfo.Service = true;
      MasterInfo.Apps = true;
      MasterInfo.ID = 0;
      MasterInfo.AboutCube = 'El SP no devuelve información de about la empresa que es la que está usando éste sistema. Está pendiente';
      MasterInfo.CubeEmail = 'no@faltaenservice.com'

      var MasterLocation = '';
      var MasterCity = '';
      var MasterState = '';

      MasterData.forEach(function(el){
        MasterInfo.ID = MasterInfo.ID + 1;
        if (el.NAME == 'CompanyLogo'){MasterInfo.HOMELOGO = 'img/' + el.VALUE};
        if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
        if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
        if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
        if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      })

      MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

      $scope.MasterInfo = [];
      $scope.MasterInfo.push(MasterInfo);

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

    $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomMainPageCarrousel","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {

      $scope.slides = getArray(response.data.CubeFlexIntegration.DATA);

      var lFila = 0;

      $scope.slides.forEach(function(el){
        el.Image = 'img/cameras1100x700.png';
        el.ID = lFila;
        lFila = lFila + 1;
      })

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

    $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomPageLinks","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {

      var lLinks = getArray(response.data.CubeFlexIntegration.DATA);

      lLinks.forEach(function(el){
        el.PageLinks = 'http://' + el.PageLinks;
      })

      $scope.Links1 = lLinks.filter(function(el){
        return el.PageSection == "1"
      })

      $scope.Links2 = lLinks.filter(function(el){
        return el.PageSection == "2"
      })

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

  // Cosas de carousel
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;
  //
  // $scope.slides = [
  //   {Image: "img/cameras1100x700.png", Title: "Nice image", Message: "AAAAAAA", ButtonText: "READ MORE", ID: 0},
  //   {Image: "img/cameras1100x700.png", Title: "Nice super", Message: "BBBBBB", ButtonText: "READ MORE", ID: 1},
  //   {Image: "img/cameras1100x700.png", Title: "Nice macdonal", Message: "CCCCCC", ButtonText: "READ MORE", ID: 2},
  //   {Image: "img/cameras1100x700.png", Title: "Nice thing", Message: "DDDDD", ButtonText: "READ MORE", ID: 3}
  // ]
  // Fin de cosas de carousel

  function getArray(object){
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

}])

.controller('ctrlCubeShopHomeProducts', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  $scope.html = '<p> 3 results for <b>Tools and Service Equipment:</b> <b style="color:#93190C">"au"</b></p>';

  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';

  $scope.ShowTable = false;

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


    // $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomMainCategories","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {
    //
    //   $scope.ProductCards = response.data.CubeFlexIntegration.DATA;
    //
    //   var lFila = 1;
    //   var lContador = 1;
    //
    //   $scope.ProductCards.forEach(function(el){
    //     el.Fila = lFila;
    //     el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
    //     if (lContador % 6 == 0){
    //       lFila = lFila + 1;
    //     }
    //     lContador = lContador + 1;
    //   })
    //
    // })
    // .catch(function (data) {
    //   console.log('Error 16');
    //   console.log(data);
    //   swal("Cube Service", "Unexpected error. Check console Error 16.");
    // });
    //
    // $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {
    //
    //   $scope.CategoriesProducts = getArray(response.data.CubeFlexIntegration.DATA);
    //
    //   console.log($scope.CategoriesProducts);
    //
    // })
    // .catch(function (data) {
    //   console.log('Error 16');
    //   console.log(data);
    //   swal("Cube Service", "Unexpected error. Check console Error 16.");
    // });

  }
  else{
    window.location = 'index.html';
  }

  $scope.FindSubcategories = function(parentid, HasChild) {

    if (HasChild == 1){

      $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}', {headers: headers}).then(function (response) {

        $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

        console.log('Mira lo que está devolviendooOOOO');
        console.log($scope.ProductCards);

        var lFila = 1;
        var lContador = 1;

        $scope.ProductCards.forEach(function(el){
          el.Fila = lFila;
          el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
          if (lContador % 3 == 0){
            lFila = lFila + 1;
          }
          lContador = lContador + 1;
        })

        $scope.Es = true;

      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });

    }

  else {

      $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomParts","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}', {headers: headers}).then(function (response) {

        $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

        $scope.ShowDetail = true;

        console.log('Mira lo que está devolviendooOOOO');
        console.log($scope.ProductCards);

        var lFila = 1;
        var lContador = 1;

        $scope.ProductCards.forEach(function(el){
          el.Fila = lFila;
          if (lContador % 3 == 0){
            lFila = lFila + 1;
          }
          lContador = lContador + 1;
        })

        $scope.Es = true;

      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });

    }
  }

  $scope.Es = false;
  $scope.ShowDetail = false;

  $scope.FindMaincategories = function() {
    $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {

      $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

      var lFila = 1;
      var lContador = 1;

      $scope.ProductCards.forEach(function(el){
        el.Fila = lFila;
        el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
        if (lContador % 3 == 0){
          lFila = lFila + 1;
        }
        lContador = lContador + 1;
      })

      $scope.ProductCardsMainMenu = getArray(response.data.CubeFlexIntegration.DATA);

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });
  }

  $scope.FindMaincategories();

  // Cosas de carousel
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;
  //
  // $scope.slides = [
  //   {Image: "img/cameras1100x700.png", Title: "Nice image", Message: "AAAAAAA", ButtonText: "READ MORE", ID: 0},
  //   {Image: "img/cameras1100x700.png", Title: "Nice super", Message: "BBBBBB", ButtonText: "READ MORE", ID: 1},
  //   {Image: "img/cameras1100x700.png", Title: "Nice macdonal", Message: "CCCCCC", ButtonText: "READ MORE", ID: 2},
  //   {Image: "img/cameras1100x700.png", Title: "Nice thing", Message: "DDDDD", ButtonText: "READ MORE", ID: 3}
  // ]
  // Fin de cosas de carousel

  function getArray(object){
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

}])
