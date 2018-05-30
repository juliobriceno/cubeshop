
// Cube Service Parameters
// URL Cube Service String
// var connServiceString = "http://localhost:9097/";
// var connServiceString = "https://cubeshop.herokuapp.com/";
var connServiceString = "http://cube-mia.com/api/";
// var connServiceString = "https://portal.cube-usa.com/api/";

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

.directive('angularCurrency', [function () {
    'use strict';

    return {
        'require': '?ngModel',
        'restrict': 'A',
        'scope': {
            angularCurrency: '=',
            variableOptions: '='
        },
        'compile': compile
    };

    function compile(tElem, tAttrs) {
        var isInputText = tElem.is('input:text');

        return function(scope, elem, attrs, controller) {
            var updateElement = function (newVal) {
                elem.autoNumeric('set', newVal);
            };

            elem.autoNumeric('init', scope.angularCurrency);
            if (scope.variableOptions === true) {
                scope.$watch('angularCurrency', function(newValue) {
                    elem.autoNumeric('update', newValue);
                });
            }

            if (controller && isInputText) {
                scope.$watch(tAttrs.ngModel, function () {
                    controller.$render();
                });

                controller.$render = function () {
                    updateElement(controller.$viewValue);
                };

                elem.on('keyup', function () {
                    scope.$applyAsync(function () {
                        controller.$setViewValue(elem.autoNumeric('get'));
                    });
                });
                elem.on('change', function () {
                    scope.$applyAsync(function () {
                        controller.$setViewValue(elem.autoNumeric('get'));
                    });
                });
            } else {
                if (isInputText) {
                    attrs.$observe('value', function (val) {
                        updateElement(val);
                    });
                }
            }
        };
    }
}])

.service('myMemoryService', ['$http', function($http) {
  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    this.myCart = JSON.parse(localStorage.myCart);
  }
  else{
    this.myCart = [];
  }
}])

.controller('ctrlCubeShopLoginController', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.myCart = myMemoryService.myCart;

  function getArray(object){
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    $http.get(connServiceString + 'CubeFileDownload.ashx?obj={"filename": "/cubefilemng/cl_00000001/vendors/productCategories/6/6.PNG"}', {headers: headers}).then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.Login = function(){

    $http.get(connServiceString + 'CubeECClientAuthentication.ashx?obj={"username": "' + $scope.UserEmail + '", "password": "' + $scope.UserPassword + '", "customercode": "' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {
      console.log(response);
      if (typeof response.data.CubeAuthentication.DATA != 'undefined'){
        $scope.myCart = [];
        localStorage.myCart = JSON.stringify($scope.myCart);
        window.location = 'index.html';
      }
      else{
        swal("Cube Service", "Invalid credentials.");
      }
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

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
      $scope.GetBase64Image(el, 'masterpage');
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

}])

.controller('ctrlCubeShopLoginRegister', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.myCart = myMemoryService.myCart;

  function getArray(object){
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    $http.get(connServiceString + 'CubeFileDownload.ashx?obj={"filename": "/cubefilemng/cl_00000001/vendors/productCategories/6/6.PNG"}', {headers: headers}).then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

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
      $scope.GetBase64Image(el, 'masterpage');
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


  // Customer Types
  $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"GetCustomerType","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {

    $scope.CustomerTypes = getArray(response.data.CubeFlexIntegration.DATA);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  // Countries
  $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"GetCustomerCountry","conncode":"' + cnnData.DBNAME + '"}', {headers: headers}).then(function (response) {

    $scope.Countries = getArray(response.data.CubeFlexIntegration.DATA);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  $scope.SaveCustomer = function() {
    $scope.userForm.$setSubmitted();

    if (!$scope.userForm.$valid)
    {
      swal("Cube Shop", "There are invalid field. Please review.");
      return 0
    }

    var strInsert = 'CubeFlexIntegration.ashx?obj={"method":"Insert_Customer","conncode":"' + cnnData.DBNAME + '", "customername": "' + $scope.CustomerName + '", "address": "' + $scope.StreetAddress1 + '", "addressline2": "' + $scope.StreetAddress2 + '", "city": "' + $scope.City + '", "state": "' + $scope.State + '", "zip": "' +
    $scope.Zip + '", "country": "' + $scope.selectedCountry.CountryISO3 + '", "offphone": "' + $scope.selectedCountry.Phone + '", "offfax": "' + $scope.Fax + '", "listid": "' + $scope.List + '", "billingname": "' + $scope.BillingName + '", "billingaddress": "' +
    $scope.BillingStreetAddress1 + '", "billingaddressline2": "' + $scope.BillingStreetAddress2 + '", "billingcity": "' + $scope.BillingCity + '", "billingstate": "' + $scope.BillingState + '", "billingzip": "' + $scope.BillingZip + '", "billingcountry": "' + $scope.selectedBillingCountry.CountryISO3 + '", "customertypeid": "' + $scope.selectedCustomerType.ID + '" }'

    // Save the Company
    $http.get(connServiceString + strInsert, {headers: headers}).then(function (response) {

      if (typeof response.data.CubeFlexIntegration.DATA.Column1 != 'undefined'){

        $scope.CustomerName = '';
        $scope.StreetAddress1 = '';
        $scope.StreetAddress2 = '';
        $scope.City = '';
        $scope.State = '';
        $scope.Zip = '';
        $scope.selectedCountry = null;
        $scope.Fax = '';
        $scope.List = '';
        $scope.BillingName = '';
        $scope.BillingStreetAddress1 = '';
        $scope.BillingStreetAddress2 = '';
        $scope.BillingCity = '';
        $scope.BillingState = '';
        $scope.BillingZip = '';
        $scope.selectedBillingCountry = null;

        $scope.userForm.$setPristine()

        swal("Cube Shop", "Your Company was created.");
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.SaveUser = function() {
    $scope.newAccount.$setSubmitted();

    if (!$scope.newAccount.$valid)
    {
      swal("Cube Shop", "There are invalid field. Please review.");
      return 0
    }

    if ($scope.UserPassword != $scope.UserConfirmPassword)
    {
      swal("Cube Shop", "Password not match.");
      return 0
    }

    var strInsert = 'CubeFlexIntegration.ashx?obj={"method":"Insert_EComm_User","conncode":"' + cnnData.DBNAME + '", "companyid": "' + $scope.UserCompanyID + '", "firstname": "' + $scope.UserFirstName + '", "lastname": "' + $scope.UserLastName + '", "email": "' + $scope.UserEmail + '", "password": "' + $scope.UserPassword + '", "passwordquestion": "' +
    $scope.UserSecurityQuestion + '", "passwordanswer": "' + $scope.UserSecurityAnswer + '"}'

    // Save the User
    $http.get(connServiceString + strInsert, {headers: headers}).then(function (response) {

      if (typeof response.data.CubeFlexIntegration.DATA.ID != 'undefined'){
        if (response.data.CubeFlexIntegration.DATA.ID != -1){
          swal("Cube Shop", "Your User was created.");

          $scope.UserCompanyID = '';
          $scope.UserFirstName = '';
          $scope.UserLastName = '';
          $scope.UserEmail = '';
          $scope.UserPassword = '';
          $scope.UserConfirmPassword = '';
          $scope.UserSecurityQuestion = '';
          $scope.UserSecurityAnswer = '';

          $scope.newAccount.$setPristine()

        }
        else{
          swal("Cube Shop", "Company does not exist.");
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

}])

.controller('ctrlCubeShopHomeController', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';

  $scope.myCart = myMemoryService.myCart;

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

    $scope.GetBase64Image = function(rowWithout64Img, source){

      $http.get(connServiceString + 'CubeFileDownload.ashx?obj={"filename": "/cubefilemng/cl_00000001/vendors/productCategories/6/6.PNG"}', {headers: headers}).then(function (response) {

        if (source == 'productsType'){
          if (response.data.imagedata == ''){
            // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
          }
          else{
            rowWithout64Img.CATIMAGE = response.data.imagedata;
          }
        }
        else if (source == 'carrousel'){
          if (response.data.imagedata == ''){
            // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
          }
          else{
            rowWithout64Img.CATIMAGE = response.data.imagedata;
          }
        }
        else if (source == 'masterpage'){
          if (response.data.imagedata == ''){
            // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
          }
          else{
            rowWithout64Img.HOMELOGO = response.data.imagedata;
          }
        }

      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });

    }

    $scope.FindMaincategories = function() {
      $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {

        $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

        var lFila = 1;
        var lContador = 1;

        $scope.ProductCards.forEach(function(el){
          el.Fila = lFila;
          el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
          el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
          el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
          if (lContador % 3 == 0){
            lFila = lFila + 1;
          }
          lContador = lContador + 1;
          $scope.GetBase64Image(el, 'productsType');
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
        $scope.GetBase64Image(el, 'masterpage');
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
        $scope.GetBase64Image(el, 'carrousel');
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

  $scope.FindSubcategories = function(HomeCardCategoryID, HomeCardHasChild, HomeCardName) {
    localStorage.HomeCardCategoryID = HomeCardCategoryID;
    localStorage.HomeCardHasChild = HomeCardHasChild;
    localStorage.HomeCardName = HomeCardName;
    window.location = 'products.html';
  }

  $scope.FindProductByText = function() {
    localStorage.HometxtSearch = $scope.HometxtSearch;
    window.location = 'products.html';
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

.controller('ctrlCubeShopHomeProducts', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  $scope.myCart = myMemoryService.myCart;

  $scope.GetBase64Image = function(rowWithout64Img, source){
    console.log('Llegó aquí');
    console.log(rowWithout64Img);

    $http.get(connServiceString + 'CubeFileDownload.ashx?obj={"filename": "/cubefilemng/cl_00000001/vendors/productCategories/6/6.PNG"}', {headers: headers}).then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.minimum = 0;
  $scope.maximum = 0;

  // S�lo para validar n�meros
  $scope.options2 = {
      aSign: '',
      mDec: '2',
      vMin: '0'
  };

  $scope.html = '<p>No results</p>';

  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';

  var cnnData = JSON.parse(localStorage.cnnData2);

  var headers = {"Authorization": ServerAuth};

  $scope.ShowTable = false;

  $scope.txtSearch = '';

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
      $scope.GetBase64Image(el, 'masterpage');
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

  $scope.ViewDetail = function(ProductCardsItem) {
    localStorage.ActiveProductCardsItem = JSON.stringify(ProductCardsItem);
    window.location = 'details-product.html';
  }

  $scope.AddToCart = function(ProductCardsItem) {
    $scope.myCarttmp = $scope.myCart.filter(function(el){
      return el.NUM == ProductCardsItem.NUM;
    })
    if ($scope.myCarttmp.length > 0){
      return 0;
    }
    ProductCardsItem.Identifer = $scope.myCart.length + 1;
    ProductCardsItem.QTY = 0;
    $scope.myCart.push(ProductCardsItem);
    localStorage.myCart = JSON.stringify($scope.myCart);
  }

  $scope.filterByPrice = function() {
    if ($scope.minimum > 0 && $scope.minimum > 0){
      $scope.ProductCards = $scope.ProductCardsSaved.filter(function (el){
        return (el.PRICE >= $scope.minimum && el.PRICE <= $scope.maximum);
      })
    }
    else if ($scope.minimum > 0){
      $scope.ProductCards = $scope.ProductCardsSaved.filter(function (el){
        return (el.PRICE >= $scope.minimum);
      })
    }
    else if ($scope.maximum > 0){
      $scope.ProductCards = $scope.ProductCardsSaved.filter(function (el){
        return (el.PRICE <= $scope.maximum);
      })
    }
    else {
      $scope.ProductCards = $scope.ProductCardsSaved;
    }
  }

  $scope.FindProductByText = function() {

    $scope.minimum = 0;
    $scope.maximum = 0;

    $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomParts","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {

      $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

      $scope.ShowDetail = true;

      $scope.ProductCards = $scope.ProductCards.filter(function (el){
        return ((el.NUM.toUpperCase().indexOf($scope.txtSearch.toUpperCase()) > -1 || el.DESCRIPTION.toUpperCase().indexOf($scope.txtSearch.toUpperCase()) > -1));
      })

      var lFila = 1;
      var lContador = 1;

      $scope.ProductCards.forEach(function(el){
        el.Fila = lFila;
        el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
        if (lContador % 3 == 0){
          lFila = lFila + 1;
        }
        lContador = lContador + 1;
      })

      $scope.ProductCardsSaved = $scope.ProductCards;

      $scope.html = '<p> ' + $scope.ProductCards.length + ' results for text: <b>' + $scope.txtSearch + '</b> </p>';

      $scope.Es = true;

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  function getArray(object){
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

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

  $scope.FindSubcategories = function(parentid, HasChild, Name) {

    $scope.minimum = 0;
    $scope.maximum = 0;

    if (HasChild == 1){

      $scope.ShowDetail = false;
      $scope.ShowTable = false;
      $scope.html = '<p>No results</p>';

      $http.get(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}', {headers: headers}).then(function (response) {

        $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

        var lFila = 1;
        var lContador = 1;

        $scope.ProductCards.forEach(function(el){
          el.Fila = lFila;
          el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
          el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
          if (lContador % 3 == 0){
            lFila = lFila + 1;
          }
          lContador = lContador + 1;
          $scope.GetBase64Image(el, 'productsType');
        })

        $scope.ProductCardsSaved = $scope.ProductCards;

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

        var lFila = 1;
        var lContador = 1;

        $scope.ProductCards.forEach(function(el){
          el.Fila = lFila;
          if (lContador % 3 == 0){
            lFila = lFila + 1;
          }
          lContador = lContador + 1;
        })

        $scope.html = '<p> ' + $scope.ProductCards.length + ' results for Category: <b>' + Name + '</b></p>';

        $scope.ProductCardsSaved = $scope.ProductCards;

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
        el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
        el.DESCRIPTION = 'Falta la descripción el servicio no devuelve description. Una pequeña descripción de la categoría';
        if (lContador % 3 == 0){
          lFila = lFila + 1;
        }
        lContador = lContador + 1;
        $scope.GetBase64Image(el, 'productsType');
      })

      $scope.ProductCardsMainMenu = getArray(response.data.CubeFlexIntegration.DATA);

      // Si viene de HOME click en categorías muestra las subcategorías o los productos de esa categoría
      if (typeof localStorage.HomeCardCategoryID != 'undefined' && localStorage.HomeCardCategoryID != ''){
        $scope.FindSubcategories(localStorage.HomeCardCategoryID, localStorage.HomeCardHasChild, localStorage.HomeCardName)
        localStorage.HomeCardCategoryID = '';
      }

      // Si viene de HOME con search
      if (typeof localStorage.HometxtSearch != 'undefined' && localStorage.HometxtSearch != ''){
        $scope.txtSearch = localStorage.HometxtSearch;
        $scope.FindProductByText();
        localStorage.HometxtSearch = '';
      }

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

.controller('ctrlCubeShopHomeProductDetail', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {
  $scope.myCart = myMemoryService.myCart;
  $scope.ProductCardsItem = JSON.parse(localStorage.ActiveProductCardsItem);
  $scope.AddToCart = function(ProductCardsItem) {
    $scope.myCarttmp = $scope.myCart.filter(function(el){
      return el.NUM == ProductCardsItem.NUM;
    })
    if ($scope.myCarttmp.length > 0){
      return 0;
    }
    ProductCardsItem.Identifer = $scope.myCart.length + 1;
    ProductCardsItem.QTY = 0;
    $scope.myCart.push(ProductCardsItem);
    localStorage.myCart = JSON.stringify($scope.myCart);
  }
}])

.controller('ctrlCubeShopHomeProductCart', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {
  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);
  }
  else{
    $scope.myCart = [];
  }
  $scope.removeCart = function(NUM) {
    $scope.myCart = $scope.myCart.filter(function(el){
      return el.NUM != NUM
    })
    localStorage.myCart = JSON.stringify($scope.myCart);
  }
}])
