
// Cube Service Parameters
// URL Cube Service String
// var connServiceString = "http://localhost:9097/";
var connServiceString = "https://cubeshop.herokuapp.com/";
// var connServiceString = "http://cube-mia.com/api/";

// var connServiceStringGateway = "http://localhost:61093/BodApp.asmx/";
// var connServiceStringGateway = "http://biip.joka.com.ve/BodApp.asmx/";
var connServiceStringGateway = "http://cubeshope.joka.com.ve/BodApp.asmx/";
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

.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})

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
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('@@', '"')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("@@@", "'")
        }
      })
    })
    var myarrayStr = JSON.stringify(myarrayObj)
    return myarrayStr;
  }

  $scope.Login = function(){

    $http.get(connServiceStringGateway + 'CubeECClientAuthentication?obj={"username": "' + $scope.UserEmail + '", "password": "' + $scope.UserPassword + '"}').then(function (response) {

      console.log(response);

      if (typeof response.data.CubeAuthentication.DATA != 'undefined'){

        var lActiveUserID = response.data.CubeAuthentication.DATA.ID;
        localStorage.UserName = response.data.CubeAuthentication.DATA.Name;

        // Call service to get temp cart
        $http.get(connServiceStringGateway + 'Get_Ecom_TempCart?obj={"method":"Get_Ecom_TempCart","conncode":"' + cnnData.DBNAME + '", "userid": "' + lActiveUserID + '"}').then(function (response) {

          $scope.myCart = [];

          if (typeof response.data.CubeFlexIntegration.DATA != 'undefined' && response.data.CubeFlexIntegration.DATA.DATA != ''){
              response.data.CubeFlexIntegration.DATA = getArray(response.data.CubeFlexIntegration.DATA);
              response.data.CubeFlexIntegration.DATA.forEach(function(eachProduct){
                var ProductCart = {};
                ProductCart.TEMPORDERID = eachProduct.TempOrderID;
                ProductCart.PARTID = eachProduct.ProductID;
                ProductCart.NUM = eachProduct.ProductID;
                ProductCart.DESCRIPTION = eachProduct.DESCRIPTION;
                ProductCart.DETAILS = eachProduct.DETAILS;
                ProductCart.WEIGHT = eachProduct.WEIGHT;
                ProductCart.WIDTH = eachProduct.WIDTH;
                ProductCart.HEIGHT = eachProduct.HEIGHT;
                ProductCart.LEN = eachProduct.LEN;
                ProductCart.PRODUCTTREEID = "0";
                ProductCart.PRICE = eachProduct.Price;
                ProductCart.CATIMAGE = eachProduct.CATIMAGE;
                ProductCart.QTY = eachProduct.Quantity;
                $scope.myCart.push(ProductCart);
              })
          }

          localStorage.myCart = JSON.stringify($scope.myCart);
          localStorage.ActiveUserID = lActiveUserID;
          delete localStorage.productsparentid;

          // Get User Credit Cards
          $http.get(connServiceStringGateway + 'Get_Ecom_Temp?obj={"method":"Get_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + lActiveUserID + '", "datatype": "creditcard"}').then(function (response) {
            if (typeof response.data.CubeFlexIntegration.DATA != 'undefined'){
              localStorage.myPaymentsInfo = response.data.CubeFlexIntegration.DATA.DATA;
            }

            // Get User Shippings
            $http.get(connServiceStringGateway + 'Get_Ecom_CustomerShipTo?obj={"method":"Get_Ecom_CustomerShipTo","conncode":"' + cnnData.DBNAME + '", "userid": "' + lActiveUserID + '"}').then(function (response) {
              if (typeof response.data.CubeFlexIntegration.DATA != 'undefined'){
                var myshippingstring = '';
                response.data.CubeFlexIntegration.DATA = getArray(response.data.CubeFlexIntegration.DATA);

                response.data.CubeFlexIntegration.DATA.forEach(function(eachShipment){
                  if (myshippingstring != ''){
                    myshippingstring = myshippingstring + ', ' + '{"ID": "' + eachShipment.ID + '", "Address1":"' + eachShipment.ADDRESS + '","Address2":"' + eachShipment.ADDRESSLINE2 + '","City":"' + eachShipment.CITY + '","State":"' + eachShipment.STATE + '"}';
                  }
                  else{
                    myshippingstring = '{"ID": "' + eachShipment.ID + '", "Address1":"' + eachShipment.ADDRESS + '","Address2":"' + eachShipment.ADDRESSLINE2 + '","City":"' + eachShipment.CITY + '","State":"' + eachShipment.STATE + '"}';
                  }
                })
                localStorage.myShippingsInfo = '[' + myshippingstring + ']';
              }
              window.location = 'index.html';

            })
            .catch(function (data) {
              console.log('Error 16');
              console.log(data);
              swal("Cube Service", "Unexpected error. Check console Error 16.");
            });

          })
          .catch(function (data) {
            console.log('Error 16');
            console.log(data);
            swal("Cube Service", "Unexpected error. Check console Error 16.");
          });

        })
        .catch(function (data) {
          console.log('Error 16');
          console.log(data);
          swal("Cube Service", "Unexpected error. Check console Error 16.");
        });

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

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })

    $scope.GetBase64Image(MasterInfo, 'masterpage');


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

  $scope.sameaddress = false;

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.myCart = myMemoryService.myCart;

  function getArray(object){
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  $scope.changevalue = function(){
    if ($scope.sameaddress == true){
      $scope.BillingStreetAddress1 = $scope.StreetAddress1;
      $scope.BillingStreetAddress2 = $scope.StreetAddress2;
      $scope.BillingCity = $scope.City;
      $scope.BillingState = $scope.State;
      $scope.BillingZip = $scope.Zip;
      $scope.selectedBillingCountry = $scope.selectedCountry;
    }
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    console.log(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}');

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $loading.start('myloading');

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');

    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

    $loading.finish('myloading');

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });


  // Customer Types
  $http.get(connServiceStringGateway + 'GetCustomerType?obj={"method":"GetCustomerType","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

    $scope.CustomerTypes = getArray(response.data.CubeFlexIntegration.DATA);
    $scope.selectedCustomerType = $scope.CustomerTypes[0];


  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  // Countries
  $http.get(connServiceStringGateway + 'GetCustomerCountry?obj={"method":"GetCustomerCountry","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

    $scope.Countries = getArray(response.data.CubeFlexIntegration.DATA);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  $scope.SaveCustomer = function() {

    $scope.List = '1';

    if ($scope.UserPassword != $scope.UserConfirmPassword)
    {
      swal("Cube Shop", "Password not match.");
      return 0
    }

    $scope.userForm.$setSubmitted();

    if (!$scope.userForm.$valid)
    {
      swal("Cube Shop", "There are invalid field. Please check.");
      return 0
    }

    $loading.start('myloading');

    var CustomerTypeID = 0;
    if (typeof $scope.selectedCustomerType != 'undefined'){
      CustomerTypeID = $scope.selectedCustomerType.ID;
      console.log($scope.selectedCustomerType.ID);
    }

    var strInsert = 'Insert_Customer?obj={"method":"Insert_Customer", "customername": "' + $scope.CustomerName + '", "address": "' + $scope.StreetAddress1 + '", "addressline2": "' + $scope.StreetAddress2 + '", "city": "' + $scope.City + '", "state": "' + $scope.State + '", "zip": "' +
    $scope.Zip + '", "country": "' + $scope.selectedCountry.CountryISO3 + '", "offphone": "' + $scope.selectedCountry.Phone + '", "offfax": "' + $scope.Fax + '", "listid": "' + $scope.List + '", "billingname": "' + $scope.BillingName + '", "billingaddress": "' +
    $scope.BillingStreetAddress1 + '", "billingaddressline2": "' + $scope.BillingStreetAddress2 + '", "billingcity": "' + $scope.BillingCity + '", "billingstate": "' + $scope.BillingState + '", "billingzip": "' + $scope.BillingZip + '", "billingcountry": "' + $scope.selectedBillingCountry.CountryISO3 + '", "customertypeid": "' + CustomerTypeID + '" }'

    // Save the Company
    $http.get(connServiceStringGateway + strInsert).then(function (response) {

      $scope.UserCompanyID = response.data.CubeFlexIntegration.DATA.Column1;
      var CompanyCode = $scope.UserCompanyID;

      var strInsert = 'Insert_EComm_User?obj={"method":"Insert_EComm_User", "companyid": "' + $scope.UserCompanyID + '", "firstname": "' + $scope.UserFirstName + '", "lastname": "' + $scope.UserLastName + '", "email": "' + $scope.UserEmail + '", "password": "' + $scope.UserPassword + '", "passwordquestion": "' +
      $scope.UserSecurityQuestion + '", "passwordanswer": "' + $scope.UserSecurityAnswer + '"}'

      // Save the User
      $http.get(connServiceStringGateway + strInsert).then(function (response) {

        console.log('Este es el usuario');
        console.log(response);

        localStorage.UserName = $scope.UserLastName + ',' + $scope.UserFirstName;

        if (typeof response.data.CubeFlexIntegration.DATA.ID != 'undefined'){
          if (response.data.CubeFlexIntegration.DATA.ID != -1){

            localStorage.ActiveUserID = response.data.CubeFlexIntegration.DATA.ID;
            delete localStorage.productsparentid;

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
            $scope.UserCompanyID = '';
            $scope.UserFirstName = '';
            $scope.UserLastName = '';
            $scope.UserEmail = '';
            $scope.UserPassword = '';
            $scope.UserConfirmPassword = '';
            $scope.UserSecurityQuestion = '';
            $scope.UserSecurityAnswer = '';

            $scope.userForm.$setPristine()

            swal("Cube Shop", "Your Company was created.");

            window.location = 'index.html';

            $loading.finish('myloading');

          }
        }
      });

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

    // var strInsert = 'http://localhost:61093/BodApp.asmx/Insert_EComm_User?customername=NombreEmpresa'
    //
    // $loading.start('myloading');
    //
    // // Save the User
    // $http.get(connServiceStringGateway + strInsert).then(function (response) {
    //
    //   console.log(response);
    //
    //   if (typeof response.data.CubeFlexIntegration.DATA.ID != 'undefined'){
    //     if (response.data.CubeFlexIntegration.DATA.ID != -1){
    //       swal("Cube Shop", "Your User was created.");
    //
    //       $scope.UserCompanyID = '';
    //       $scope.UserFirstName = '';
    //       $scope.UserLastName = '';
    //       $scope.UserEmail = '';
    //       $scope.UserPassword = '';
    //       $scope.UserConfirmPassword = '';
    //       $scope.UserSecurityQuestion = '';
    //       $scope.UserSecurityAnswer = '';
    //
    //       $scope.newAccount.$setPristine()
    //
    //       $loading.finish('myloading');
    //
    //     }
    //     else{
    //       swal("Cube Shop", "Company does not exist.");
    //     }
    //   }
    //
    // })
    // .catch(function (data) {
    //   console.log('Error 16');
    //   console.log(data);
    //   swal("Cube Service", "Unexpected error. Check console Error 16.");
    // });


    var strInsert = 'Insert_EComm_User?obj={"method":"Insert_EComm_User", "companyid": "' + $scope.UserCompanyID + '", "firstname": "' + $scope.UserFirstName + '", "lastname": "' + $scope.UserLastName + '", "email": "' + $scope.UserEmail + '", "password": "' + $scope.UserPassword + '", "passwordquestion": "' +
    $scope.UserSecurityQuestion + '", "passwordanswer": "' + $scope.UserSecurityAnswer + '"}'

    $loading.start('myloading');

    // Save the User
    $http.get(connServiceStringGateway + strInsert).then(function (response) {

      if (typeof response.data.CubeFlexIntegration.DATA.ID != 'undefined'){
        if (response.data.CubeFlexIntegration.DATA.ID != -1){

          $scope.UserCompanyID = '';
          $scope.UserFirstName = '';
          $scope.UserLastName = '';
          $scope.UserEmail = '';
          $scope.UserPassword = '';
          $scope.UserConfirmPassword = '';
          $scope.UserSecurityQuestion = '';
          $scope.UserSecurityAnswer = '';

          $scope.newAccount.$setPristine()

          $loading.finish('myloading');

          localStorage.UserName = response.data.CubeFlexIntegration.DATA.Name;

          window.location = 'index.html';

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

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';

  $scope.myCart = myMemoryService.myCart;

  var cnnData = JSON.parse(localStorage.cnnData2);

  function getArray(object){
      if (typeof object == 'undefined'){
        return [];
      }
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

      var imgPath = '';
      if (source == 'productsType' || source == 'carrousel'){
        imgPath = rowWithout64Img.CATIMAGE;
      }
      else{
        imgPath = rowWithout64Img.HOMELOGO;
      }

      $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

        if (source == 'productsType'){
          if (response.data.imagedata == ''){
            // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
          }
          else{
            rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
          }
        }
        else if (source == 'carrousel'){
          if (response.data.imagedata == ''){
            // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
          }
          else{
            rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
          }
        }
        else if (source == 'masterpage'){
          if (response.data.imagedata == ''){
            // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
          }
          else{
            rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
          }
        }

      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });

    }

    $scope.CloseSession = function() {
      $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
        $scope.UserName = '';
        localStorage.UserName = '';
        localStorage.myCreditCardsBilling = [];
        localStorage.myPaymentsInfo = [];
        localStorage.myShippingsInfo = [];
        localStorage.myCart = [];
        delete localStorage.productsparentid;
        window.location = 'index.html';
      })
    }

    $scope.FindMaincategories = function() {
      $http.get(connServiceStringGateway + 'Get_EcomSubCategories?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}').then(function (response) {

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

    $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation"}').then(function (response) {

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
        if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
        if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
        if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
        if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
        if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
        if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
      })


      $scope.GetBase64Image(MasterInfo, 'masterpage');

      MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

      $scope.MasterInfo = [];
      $scope.MasterInfo.push(MasterInfo);

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

    $http.get(connServiceStringGateway + 'Get_EcomMainPageCarrousel?obj={"method":"Get_EcomMainPageCarrousel"}').then(function (response) {

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

    $http.get(connServiceStringGateway + 'Get_EcomPageLinks?obj={"method":"Get_EcomPageLinks","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

}])

.controller('ctrlCubeShopHomeProducts', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  $scope.myCart = myMemoryService.myCart;

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
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

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


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

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.AddToCart = function(ProductCardsItem) {
    // Check if user is connected
    if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
      window.location = 'login.html';
      return 0;
    }

    $scope.myCarttmp = $scope.myCart.filter(function(el){
      return el.NUM == ProductCardsItem.NUM;
    })

    if ($scope.myCarttmp.length > 0){
      return 0;
    }

    // Save cart in server
    var myCartLocal = $scope.myCart;
    var myCartStr = RemoveQuote($scope.myCart);

    ProductCardsItem.Identifer = $scope.myCart.length + 1;
    ProductCardsItem.QTY = 1;

    $http.get(connServiceStringGateway + 'Save_Ecom_TempCart?obj={"method":"Save_Ecom_TempCart","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "productid": "' + ProductCardsItem.PARTID + '", "quantity": "' + ProductCardsItem.QTY + '", "price": "' + ProductCardsItem.PRICE  + '"}').then(function (response) {
      console.log(response);
      ProductCardsItem.TEMPORDERID = response.data.CubeFlexIntegration.DATA.ID;
      $scope.myCart.push(ProductCardsItem);
      localStorage.myCart = JSON.stringify(myCartLocal);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });
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

    $http.get(connServiceStringGateway + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomParts","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {

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
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  if (typeof localStorage.cnnData2 != 'undefined'){

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

    localStorage.productsparentid = parentid;
    localStorage.productsHasChild = HasChild;
    localStorage.productsName = Name;

    $scope.minimum = 0;
    $scope.maximum = 0;

    if (HasChild == 1){

      $scope.ShowDetail = false;
      $scope.ShowTable = false;
      $scope.html = '<p>No results</p>';

      $loading.start('myloading');

      $http.get(connServiceStringGateway + 'Get_EcomSubCategories?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}').then(function (response) {

        if (typeof response.data.CubeFlexIntegration.DATA == 'undefined'){
          $loading.finish('myloading');
          swal("Cube Service", "There is not more subcategories.");
          return 0;
        }

        $loading.finish('myloading');

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

      $loading.start('myloading');

      $http.get(connServiceStringGateway + 'Get_EcomParts?obj={"method":"Get_EcomParts","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}').then(function (response) {

        $loading.finish('myloading');

        if (typeof response.data.CubeFlexIntegration.DATA == 'undefined'){
          swal("Cube Service", "There is not products in this category.");
          return 0;
        }

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
    $http.get(connServiceStringGateway + 'Get_EcomSubCategories?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}').then(function (response) {

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

  // If User was in a subcategory return to it Else Mail categories
  if (typeof localStorage.productsparentid != 'undefined'){
    $scope.FindSubcategories(localStorage.productsparentid, localStorage.productsHasChild, localStorage.productsName);
    return 0;
  }
  else {
    $scope.FindMaincategories();
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
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

}])

.controller('ctrlCubeShopHomeApplications', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  $scope.myCart = myMemoryService.myCart;

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
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

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


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

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.AddToCart = function(ProductCardsItem) {
    // Check if user is connected
    if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
      window.location = 'login.html';
      return 0;
    }

    $scope.myCarttmp = $scope.myCart.filter(function(el){
      return el.ID == ProductCardsItem.ID;
    })

    if ($scope.myCarttmp.length > 0){
      return 0;
    }

    // Save cart in server
    var myCartLocal = $scope.myCart;
    var myCartStr = RemoveQuote($scope.myCart);

    ProductCardsItem.Identifer = $scope.myCart.length + 1;
    ProductCardsItem.QTY = 1;

    $http.get(connServiceStringGateway + 'Save_Ecom_TempCart?obj={"method":"Save_Ecom_TempCart","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "productid": "' + ProductCardsItem.ID + '", "quantity": "0", "price": "0"}').then(function (response) {
      console.log(response);
      ProductCardsItem.TEMPORDERID = response.data.CubeFlexIntegration.DATA.ID;
      $scope.myCart.push(ProductCardsItem);
      localStorage.myCart = JSON.stringify(myCartLocal);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });
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

    $http.get(connServiceStringGateway + 'CubeFlexIntegration.ashx?obj={"method":"Get_EcomParts","conncode":"' + cnnData.DBNAME + '", "parentid": "1"}', {headers: headers}).then(function (response) {

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
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  if (typeof localStorage.cnnData2 != 'undefined'){

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

    localStorage.productsparentid = parentid;
    localStorage.productsHasChild = HasChild;
    localStorage.productsName = Name;

    $scope.minimum = 0;
    $scope.maximum = 0;

    if (HasChild == 1){

      $scope.ShowDetail = false;
      $scope.ShowTable = false;
      $scope.html = '<p>No results</p>';

      $loading.start('myloading');

      $http.get(connServiceStringGateway + 'Get_EcomSubCategories?obj={"method":"Get_EcomSubCategories","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}').then(function (response) {

        if (typeof response.data.CubeFlexIntegration.DATA == 'undefined'){
          $loading.finish('myloading');
          swal("Cube Service", "There is not more subcategories.");
          return 0;
        }

        $loading.finish('myloading');

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

      $loading.start('myloading');

      $http.get(connServiceStringGateway + 'Get_EcomMainCategoriesApSys?obj={"method":"Get_EcomMainCategoriesApSys","conncode":"' + cnnData.DBNAME + '", "parentid": "' + parentid + '"}').then(function (response) {

        $loading.finish('myloading');

        if (typeof response.data.CubeFlexIntegration.DATA == 'undefined'){
          swal("Cube Service", "There is not products in this category.");
          return 0;
        }

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
    $http.get(connServiceStringGateway + 'Get_EcomMainCategoriesAp?obj={"method":"Get_EcomMainCategoriesAp","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

      console.log(response);

      $scope.ProductCards = getArray(response.data.CubeFlexIntegration.DATA);

      console.log('Vale');

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

  // If User was in a subcategory return to it Else Mail categories
  if (typeof localStorage.productsparentid != 'undefined'){
    $scope.FindSubcategories(localStorage.productsparentid, localStorage.productsHasChild, localStorage.productsName);
    return 0;
  }
  else {
    $scope.FindMaincategories();
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
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

}])

.controller('ctrlCubeShopHomeProductDetail', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.AddToCart = function(ProductCardsItem) {
    // Check if user is connected
    if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
      window.location = 'login.html';
      return 0;
    }

    $scope.myCarttmp = $scope.myCart.filter(function(el){
      return el.NUM == ProductCardsItem.NUM;
    })

    if ($scope.myCarttmp.length > 0){
      return 0;
    }

    // Save cart in server
    var myCartLocal = $scope.myCart;
    var myCartStr = RemoveQuote($scope.myCart);

    ProductCardsItem.Identifer = $scope.myCart.length + 1;
    ProductCardsItem.QTY = 1;

    $http.get(connServiceStringGateway + 'Save_Ecom_TempCart?obj={"method":"Save_Ecom_TempCart","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "productid": "' + ProductCardsItem.PARTID + '", "quantity": "' + ProductCardsItem.QTY + '", "price": "' + ProductCardsItem.PRICE  + '"}').then(function (response) {
      console.log(response);
      ProductCardsItem.TEMPORDERID = response.data.CubeFlexIntegration.DATA.ID;
      $scope.myCart.push(ProductCardsItem);
      localStorage.myCart = JSON.stringify(myCartLocal);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });
  }

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  $scope.myCart = myMemoryService.myCart;

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.ActiveProductCardsItem =JSON.parse(localStorage.ActiveProductCardsItem);

  $scope.GetBase64Image($scope.ActiveProductCardsItem, 'productsType');
  console.log($scope.ActiveProductCardsItem);

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

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


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

.controller('ctrlCubeShopHomeProductCart', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  // If user is not authenticate
  if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
    window.location = 'login.html';
    return 0;
  }

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.AllPrice = 0;

  $scope.CalcPrices = function(){
    $scope.AllPrice = 0;
    $scope.myCart.forEach(function(eachProduct){
      $scope.AllPrice = $scope.AllPrice + (eachProduct.PRICE * eachProduct.QTY);
    })
  }

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);
    $scope.CalcPrices();

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

  }
  else{
    $scope.myCart = [];
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.removeCart = function(NUM) {
    $scope.myCart = $scope.myCart.filter(function(el){
      return el.NUM != NUM
    })

    // Save cart in server
    var myCartLocal = $scope.myCart;
    var myCartStr = RemoveQuote($scope.myCart);

    $http.get(connServiceStringGateway + 'Save_Ecom_Temp?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "cart", "id": "0", "data": ' + myCartStr + '}').then(function (response) {
      localStorage.myCart = JSON.stringify($scope.myCart);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

}])

.controller('ctrlCubeShopHomePaymentInformation', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  // If Payment Informations Exists
  if (typeof localStorage.myPaymentsInfo != 'undefined' && localStorage.myPaymentsInfo != '' ){
    console.log(localStorage.myPaymentsInfo);
    $scope.PaymentsInfo = JSON.parse(localStorage.myPaymentsInfo);
  }
  else{
    $scope.PaymentsInfo = [];
  }

  $scope.CreditCardNumberSelected = {};

  // By default show cards lists
  $scope.shownewItem = false;

  $scope.AlternateNewListCard = function(){
    $scope.shownewItem = !$scope.shownewItem;
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.SaveCreditCard = function(){
    $scope.newCreditCard.$setSubmitted();
    if (!$scope.newCreditCard.$valid)
    {
      swal("Cube Shop", "There are invalid field. Please review.");
      return 0
    }
    // One one credit card same number
    var PaymentsInfo = $scope.PaymentsInfo.filter(function(payment){
      return payment.CreditCardNumber == $scope.CreditCardNumber;
    })
    if (PaymentsInfo.length > 0 ){
      swal("Cube Shop", "Credit card number exists.");
      return 0;
    }
    $scope.PaymentInfo = {FirstName: $scope.FirstName, LastName: $scope.LastName, CreditCardType: $scope.CreditCardType, CreditCardNumber: $scope.CreditCardNumber, CreditCardCode: $scope.CreditCardCode, ExpirationDate: $scope.ExpirationDate};
    $scope.PaymentsInfo.push($scope.PaymentInfo);
    $scope.FirstName = '';
    $scope.LastName = '';
    $scope.CreditCardType = '';
    $scope.CreditCardNumber = '';
    $scope.CreditCardCode = '';
    $scope.ExpirationDate = '';
    $scope.newCreditCard.$setPristine()
    $scope.AlternateNewListCard()

    // Save cart in server
    var myPaymentInfoLocal = $scope.PaymentsInfo;
    var myPaymentInfoStr = RemoveQuote($scope.PaymentsInfo);

    console.log(connServiceString + 'CubeFlexIntegration.ashx?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "creditcard", "id": "0", "data": ' + myPaymentInfoStr + '}');

    $http.get(connServiceStringGateway + 'Save_Ecom_Temp?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "creditcard", "id": "0", "data": ' + myPaymentInfoStr + '}').then(function (response) {
      console.log(response);
      localStorage.myPaymentsInfo = JSON.stringify($scope.PaymentsInfo);
      console.log(localStorage.myPaymentsInfo);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });


  }

  $scope.DeleteCreditCard = function(CreditCardNumber){
    $scope.PaymentsInfo = $scope.PaymentsInfo.filter(function(payment){
      return payment.CreditCardNumber != CreditCardNumber;
    })
    // Save card at server
    var myPaymentsInfo = JSON.stringify($scope.PaymentsInfo);
    var myPaymentsInfoBack = myPaymentsInfo.replaceAll("'", "@@");
    myPaymentsInfoBack = myPaymentsInfoBack.replaceAll('"', '@@@');

    $http.get(connServiceStringGateway + 'Save_Ecom_Temp?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "creditcard", "id": "0", "data": "' + myPaymentsInfoBack + '"}').then(function (response) {
      localStorage.myPaymentsInfo = JSON.stringify($scope.PaymentsInfo);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });
  }

  $scope.Continue = function(){
    if (typeof $scope.CreditCardNumberSelected.FirstName == 'undefined'){
      swal("Cube Shop", "Must select a Credit Card.");
      return 0;
    }
    window.location = 'shipping-address.html';
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.AllPrice = 0;

  $scope.CalcPrices = function(){
    $scope.AllPrice = 0;
    $scope.myCart.forEach(function(eachProduct){
      $scope.AllPrice = $scope.AllPrice + (eachProduct.PRICE * eachProduct.QTY);
    })
  }

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });


  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);
    $scope.CalcPrices();

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

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

  // Fin s�lo para validar n�meros
  // S�lo para que funcione el control de fecha
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  // Fin s�lo para que funcione el control de fecha

}])

.controller('ctrlCubeShopHomeShippingInformation', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  // If Payment Informations Exists
  if (typeof localStorage.myShippingsInfo != 'undefined' && localStorage.myShippingsInfo != '' ){
    $scope.ShippingsInfo = JSON.parse(localStorage.myShippingsInfo);
  }
  else{
    $scope.ShippingsInfo = [];
  }

  $scope.ShippingSelected = {};

  $scope.shownewItem = false;

  $scope.AlternateNewListCard = function(){
    $scope.shownewItem = !$scope.shownewItem;
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  $scope.SaveShipping = function(){
    $scope.newShipping.$setSubmitted();
    if (!$scope.newShipping.$valid)
    {
      swal("Cube Shop", "There are invalid field. Please review.");
      return 0
    }
    // One one credit card same number
    var ShippingsInfo = $scope.ShippingsInfo.filter(function(shipping){
      return shipping.Address1 == $scope.Address1;
    })
    if (ShippingsInfo.length > 0 ){
      swal("Cube Shop", "Shipping Address exists.");
      return 0;
    }
    $scope.ShippingInfo = {Address1: $scope.Address1, Address2: $scope.Address2, City: $scope.City, State: $scope.State, Phone: $scope.Phone, Fax: $scope.Fax};
    $scope.ShippingsInfo.push($scope.ShippingInfo);
    $scope.Address1 = '';
    $scope.Address2 = '';
    $scope.City = '';
    $scope.State = '';
    $scope.Phone = '';
    $scope.Fax = '';
    $scope.newShipping.$setPristine();
    $scope.AlternateNewListCard();

    // Save card at server
    var myShippingsInfo = JSON.stringify($scope.ShippingsInfo);
    var myShippingsInfoBack = myShippingsInfo.replaceAll("'", "@@");
    myShippingsInfoBack = myShippingsInfoBack.replaceAll('"', '@@@');

    $http.get(connServiceStringGateway + 'Save_Ecom_Temp?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "creditcard", "id": "0", "data": "' + myShippingsInfoBack + '"}').then(function (response) {
      localStorage.myShippingsInfo = JSON.stringify($scope.ShippingsInfo);
      console.log(localStorage.myShippingsInfo);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.DeleteShipping = function(Address1){
    $scope.ShippingsInfo = $scope.ShippingsInfo.filter(function(shipping){
      return shipping.Address1 != Address1;
    })

    // Save card at server
    var myShippingsInfo = JSON.stringify($scope.ShippingsInfo);
    var myShippingsInfoBack = myShippingsInfo.replaceAll("'", "@@");
    myShippingsInfoBack = myShippingsInfoBack.replaceAll('"', '@@@');

    $http.get(connServiceStringGateway + 'Save_Ecom_Temp?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "shipping", "id": "0", "data": "' + myShippingsInfoBack + '"}').then(function (response) {
      localStorage.myShippingsInfo = JSON.stringify($scope.ShippingsInfo);
      console.log(localStorage.myShippingsInfo);
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.Continue = function(){
    if (typeof $scope.ShippingSelected.Address1 == 'undefined'){
      swal("Cube Shop", "Must select a Shipping Address.");
      return 0;
    }
    window.location = 'creditcard-address.html';
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.AllPrice = 0;

  $scope.CalcPrices = function(){
    $scope.AllPrice = 0;
    $scope.myCart.forEach(function(eachProduct){
      $scope.AllPrice = $scope.AllPrice + (eachProduct.PRICE * eachProduct.QTY);
    })
  }

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });


  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);
    $scope.CalcPrices();

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

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

  // Fin s�lo para validar n�meros
  // S�lo para que funcione el control de fecha
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  // Fin s�lo para que funcione el control de fecha

}])

.controller('ctrlCubeShopHomeShippingCardInformation', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  $scope.ShippingsInfo = [];
  $scope.ShippingSelected = {};

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  // If Payment Informations Exists
  if (typeof localStorage.myCreditCardsBilling != 'undefined' && localStorage.myCreditCardsBilling != '' ){
    $scope.CreditCardsBilling = JSON.parse(localStorage.myCreditCardsBilling);
  }
  else{
    $scope.CreditCardsBilling = [];
  }

  $scope.CreditCardSelected = {};

  $scope.shownewItem = false;

  $scope.SaveCreditCardBilling = function(){
    $scope.newCreditCard.$setSubmitted();
    if (!$scope.newCreditCard.$valid)
    {
      swal("Cube Shop", "There are invalid field. Please review.");
      return 0
    }
    // One one credit card same number
    var CreditCardInfo = $scope.CreditCardsBilling.filter(function(creditcardbilling){
      return creditcardbilling.Address1 == $scope.Address1;
    })
    if (CreditCardInfo.length > 0 ){
      swal("Cube Shop", "Credit Card Billing Address exists.");
      return 0;
    }
    $scope.ShippingInfo = {Address1: $scope.Address1, Address2: $scope.Address2, City: $scope.City, State: $scope.State, Phone: $scope.Phone, Fax: $scope.Fax};
    $scope.ShippingsInfo.push($scope.ShippingInfo);
    $scope.Address1 = '';
    $scope.Address2 = '';
    $scope.City = '';
    $scope.State = '';
    $scope.Phone = '';
    $scope.Fax = '';
    $scope.newShipping.$setPristine()
    swal("Cube Shop", "Credit Card Address was saved.");
  }

  $scope.DeleteShipping = function(Address1){
    $scope.ShippingsInfo = $scope.ShippingsInfo.filter(function(shipping){
      return shipping.Address1 != Address1;
    })
  }

  $scope.Continue = function(){
    if (typeof $scope.ShippingSelected.Address1 == 'undefined'){
      swal("Cube Shop", "Must select a Shipping Address.");
      return 0;
    }
    window.location = 'details-product.html';
  }

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $scope.AllPrice = 0;

  $scope.CalcPrices = function(){
    $scope.AllPrice = 0;
    $scope.myCart.forEach(function(eachProduct){
      $scope.AllPrice = $scope.AllPrice + (eachProduct.PRICE * eachProduct.QTY);
    })
  }

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');

    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });


  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);
    $scope.CalcPrices();

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

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

  // Fin s�lo para validar n�meros
  // S�lo para que funcione el control de fecha
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  // Fin s�lo para que funcione el control de fecha

}])

.controller('ctrlCubeShopHomeCArdCheckOut', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  // If user is not authenticate
  if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
    window.location = 'login.html';
    return 0;
  }

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  // Trae los datos de billing address
  $http.get(connServiceStringGateway + 'Get_Ecom_CustomerBillTo?obj={"method":"Get_Ecom_CustomerBillTo","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '"}').then(function (response) {
    if (typeof response.data.CubeFlexIntegration != 'undefined'){
      var BillingAddressInfo = response.data.CubeFlexIntegration.DATA;
      $scope.BillingAddress1 = BillingAddressInfo.ADDRESS;
      $scope.BillingAddress2 = BillingAddressInfo.ADDRESSLINE2;
      $scope.BillingCity = BillingAddressInfo.CITY;
      $scope.BillingState = BillingAddressInfo.STATE;
    }
  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  // Add Fila Field to each array passed interval
  $scope.AddFila = function(arr, eachmany){
    var lFila = 1;
    var lContador = 1;
    arr.forEach(function(el){
      el.Fila = lFila;
      if (lContador % eachmany == 0){
        lFila = lFila + 1;
      }
      lContador = lContador + 1;
    })
  }

  $scope.CreditCardSelected = {CreditCardNumber:""};
  $scope.ShippingSelected = {Address1:""};
  $scope.CreditBillingSelected = {Address1:""};

  // If Payment Informations Exists
  if (typeof localStorage.myPaymentsInfo != 'undefined' && localStorage.myPaymentsInfo != '' ){
    $scope.PaymentsInfo = JSON.parse(localStorage.myPaymentsInfo);
    // Check first Credir Card If Exist
    if ($scope.PaymentsInfo.length > 0){
      $scope.CreditCardSelected.CreditCardNumber = $scope.PaymentsInfo[0].CreditCardNumber;
    }
    $scope.AddFila($scope.PaymentsInfo, 4);
  }
  else{
    $scope.PaymentsInfo = [];
    $scope.CreditCardSelected.CreditCardNumber = 'NA';
  }

  // IfShippings address Exists
  if (typeof localStorage.myShippingsInfo != 'undefined' && localStorage.myShippingsInfo != '' ){
    $scope.ShippingsInfo = JSON.parse(localStorage.myShippingsInfo);
    if ($scope.ShippingsInfo.length > 0){
      $scope.ShippingSelected.Address1 = $scope.ShippingsInfo[0].Address1;
    }
    $scope.AddFila($scope.ShippingsInfo, 2);
  }
  else{
    $scope.ShippingsInfo = [];
    $scope.ShippingSelected.Address1 = 'NA';
  }

  // If Credit card Billing address Exists
  if (typeof localStorage.myCreditCardsBilling != 'undefined' && localStorage.myCreditCardsBilling != '' ){
    $scope.myCreditCardsBilling = JSON.parse(localStorage.myCreditCardsBilling);
    if ($scope.myCreditCardsBilling.length > 0){
      $scope.CreditBillingSelected.Address1 = $scope.myCreditCardsBilling[0].Address1;
    }
    $scope.AddFila($scope.myCreditCardsBilling, 2);
  }
  else{
    $scope.myCreditCardsBilling = [];
    $scope.CreditBillingSelected.Address1 = 'NA';
  }

  $scope.AllPrice = 0;

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.SaveItemsCount = 0;

  $scope.FinishSave = function(){
    if ($scope.SaveItemsCount == 0){
      $scope.CreditCardSelected.CreditCardNumber = $scope.PaymentsInfo[0].CreditCardNumber;
      $scope.ShippingSelected.Address1 = $scope.ShippingsInfo[0].Address1;
      swal("Cube Shop", "Order was created");
      $loading.finish('myloading');
    }
  }

  $scope.PlaceOrder = function(){

    if ($scope.CreditCardSelected.CreditCardNumber == 'NA'){

      swal("Cube Shop", "You must select a payment method.");
      return 0

      // $scope.newCreditCard.$setSubmitted();
      //
      // if (!$scope.newCreditCard.$valid)
      // {
      //   swal("Cube Shop", "There are invalid field in credit card data. Please check.");
      //   return 0
      // }
      //
      // $scope.SaveItemsCount = $scope.SaveItemsCount + 1;

    }

    if ($scope.ShippingSelected.Address1 == 'NA'){

      swal("Cube Shop", "You must select a shipping address.");
      return 0
      // $scope.SaveItemsCount = $scope.SaveItemsCount + 1;
    }

    if ($scope.CreditBillingSelected.Address1 == 'NA'){
      $scope.newBilling.$setSubmitted();
      if (!$scope.newBilling.$valid)
      {
        swal("Cube Shop", "There are invalid field in billing address data. Please check.");
        return 0
      }
      $scope.SaveItemsCount = $scope.SaveItemsCount + 1;
    }

    $loading.start('myloading');

    $scope.newBilling.$setPristine();

    // Save card billing at server
    $http.get(connServiceStringGateway + 'Update_CustomerBAddress?obj={"method":"Update_CustomerBAddress","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "billingname": "NA", "billingaddress": "' + $scope.BillingAddress1 + '", "billingaddressline2": "' +
    $scope.BillingAddress2 + '", "billingcity": "' + $scope.BillingCity + '", "billingstate": "' + $scope.BillingState + '", "billingzip": "Changes", "billingcountry": "Changes"}' ).then(function (response) {

      var shippingselected = $scope.ShippingsInfo.filter(function(eachshipping){ return eachshipping.Address1 == $scope.ShippingSelected.Address1 })[0];

      // Call Place order finish
      $http.get(connServiceStringGateway + 'Insert_EcomOrder?obj={"method":"Insert_EcomOrder","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "shiptoid": "' + shippingselected.ID + '"}' ).then(function (response) {

        console.log('Dale');

        console.log(response);

        $scope.CreditCardSelected.CreditCardNumber = $scope.PaymentsInfo[0].CreditCardNumber;
        $scope.ShippingSelected.Address1 = $scope.ShippingsInfo[0].Address1;
        swal("Cube Shop", "Order was created");
        $loading.finish('myloading');
        // $scope.FinishSave();
      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

    // $scope.FinishSave();

  }

  $scope.SaveCreditCard = function(){

    if ($scope.CreditCardSelected.CreditCardNumber == 'NA'){

      $scope.newCreditCard.$setSubmitted();

      if (!$scope.newCreditCard.$valid)
      {
        swal("Cube Shop", "There are invalid field in credit card data. Please check.");
        return 0
      }

      $scope.PaymentInfo = {FirstName: $scope.FirstName, LastName: $scope.LastName, CreditCardType: $scope.CreditCardType, CreditCardNumber: $scope.CreditCardNumber, CreditCardCode: $scope.CreditCardCode, ExpirationDate: $scope.ExpirationDate};
      $scope.PaymentsInfo.push($scope.PaymentInfo);
      $scope.CreditCardSelected.CreditCardNumber = $scope.CreditCardNumber;
      $scope.AddFila($scope.PaymentsInfo, 4);
      $scope.FirstName = '';
      $scope.LastName = '';
      $scope.CreditCardType = '';
      $scope.CreditCardNumber = '';
      $scope.CreditCardCode = '';
      $scope.ExpirationDate = '';
      $scope.newCreditCard.$setPristine()

      // Save cart in server
      var myPaymentInfoLocal = $scope.PaymentsInfo;
      var myPaymentInfoStr = RemoveQuote($scope.PaymentsInfo);

      $http.get(connServiceStringGateway + 'Save_Ecom_Temp?obj={"method":"Save_Ecom_Temp","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "datatype": "creditcard", "id": "0", "data": ' + myPaymentInfoStr + '}').then(function (response) {
        localStorage.myPaymentsInfo = JSON.stringify($scope.PaymentsInfo);
      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });
    }
  }

  $scope.SaveShippingAddress = function(){

    $scope.newShipping.$setSubmitted();
    if (!$scope.newShipping.$valid)
    {
      swal("Cube Shop", "There are invalid field in credit shipping address data. Please check.");
      return 0
    }

    // Save shipping address
    if ($scope.ShippingSelected.Address1 == 'NA'){

      $scope.ShippingInfo = {};
      $scope.ShippingInfo = {Address1: $scope.Address1, Address2: $scope.Address2, City: $scope.City, State: $scope.State, Phone: $scope.Phone, Fax: $scope.Fax};
      $scope.ShippingsInfo.push($scope.ShippingInfo);
      $scope.ShippingSelected.Address1 = $scope.Address1;
      $scope.AddFila($scope.ShippingsInfo, 2);

      $http.get(connServiceStringGateway + 'Save_Ecom_CustomerShipTo?obj={"method":"Save_Ecom_CustomerShipTo","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "address": "' + $scope.Address1 + '", "addressline2": "' +
      $scope.Address2 + '", "city": "' + $scope.City + '", "state": "' + $scope.State + '", "name": "NAME", "zip": "ZIP", "country": "COUNTRY"}').then(function (response) {

        // Agrega el ID a la shipping address
        $scope.ShippingInfo.ID = response.data.CubeFlexIntegration.DATA.ID;

        $scope.Address1 = '';
        $scope.Address2 = '';
        $scope.City = '';
        $scope.State = '';
        $scope.newShipping.$setPristine();
        localStorage.myShippingsInfo = JSON.stringify($scope.ShippingsInfo);
        $scope.SaveItemsCount = $scope.SaveItemsCount - 1;
      })
      .catch(function (data) {
        console.log('Error 16');
        console.log(data);
        swal("Cube Service", "Unexpected error. Check console Error 16.");
      });
    }
  }

  $scope.CalcPrices = function(){
    $scope.AllPrice = 0;
    $scope.myCart.forEach(function(eachProduct){
      $scope.AllPrice = $scope.AllPrice + (eachProduct.PRICE * eachProduct.QTY);
    })
  }

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);
    $scope.CalcPrices();

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

  }
  else{
    $scope.myCart = [];
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  function RemoveQuote(arrayObj){
    var myarrayObj = _.cloneDeep(arrayObj);
    myarrayObj.forEach(function(eachRecord){
      var keys = Object.keys(eachRecord);
      keys.forEach(function(eachKey){
        if (typeof eachRecord[eachKey] == 'string'){
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll('"', '@@')
          eachRecord[eachKey] = eachRecord[eachKey].replaceAll("'", '@@@')
        }
      })
    })
    var myarrayStr = "'" + JSON.stringify(myarrayObj) + "'"
    return myarrayStr;
  }

  $scope.removeCart = function(TEMPORDERID) {
    $scope.myCart = $scope.myCart.filter(function(el){
      return el.TEMPORDERID != TEMPORDERID
    })

    // Remove from cart al server
    $http.get(connServiceStringGateway + 'Delete_Ecom_TempCartItem?obj={"method":"Delete_Ecom_TempCartItem","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '", "id": "' + TEMPORDERID + '"}').then(function (response) {
      localStorage.myCart = JSON.stringify($scope.myCart);
      $scope.CalcPrices();
    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }
  // Fin s�lo para validar n�meros
  // S�lo para que funcione el control de fecha
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  // Fin s�lo para que funcione el control de fecha

}])

.controller('ctrlYourOrder', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  // If user is not authenticate
  if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
    window.location = 'login.html';
    return 0;
  }

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  $scope.ShowOrderDetail = function(ORDERID) {
    localStorage.OrderID = ORDERID;
    window.location = 'order-details.html';
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

  $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
      if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
      if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
      if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
      if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
      if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
      if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
    })


    $scope.GetBase64Image(MasterInfo, 'masterpage');


    MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

    $scope.MasterInfo = [];
    $scope.MasterInfo.push(MasterInfo);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });

  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

  }
  else{
    $scope.myCart = [];
  }

  function getArray(object){
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  $http.get(connServiceStringGateway + 'Get_EcomPageLinks?obj={"method":"Get_EcomPageLinks","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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

  $http.get(connServiceStringGateway + 'Get_Ecom_OrderHistory?obj={"method":"Get_Ecom_OrderHistory","conncode":"' + cnnData.DBNAME + '", "userid": "' + localStorage.ActiveUserID + '"}').then(function (response) {

    $scope.UserOrders = getArray(response.data.CubeFlexIntegration.DATA);

    console.log($scope.UserOrders);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });


}])

.controller('ctrlOrderDetail', ['$scope', '$http', '$loading', '$uibModal', 'myMemoryService', function ($scope, $http, $loading, $uibModal, myMemoryService) {

  $scope.UserName = '';

  if (typeof localStorage.UserName != 'undefined'){
    if (typeof localStorage.UserName != ''){
      $scope.UserName = localStorage.UserName;
    }
  }

  // If user is not authenticate
  if (typeof localStorage.ActiveUserID == 'undefined' || localStorage.ActiveUserID =='' ){
    window.location = 'login.html';
    return 0;
  }

  $scope.CloseSession = function() {
    $http.get(connServiceStringGateway + 'CloseSession?obj={"method":"CloseSession"}').then(function (response) {
      $scope.UserName = '';
      localStorage.UserName = '';
      localStorage.myCreditCardsBilling = [];
      localStorage.myPaymentsInfo = [];
      localStorage.myShippingsInfo = [];
      localStorage.myCart = [];
      delete localStorage.productsparentid;
      window.location = 'index.html';
    })
  }

  $scope.ShowOrderDetail = function(ORDERID) {
    localStorage.OrderID = ORDERID;
    window.location = 'order-details.html';
  }

  var headers = {"Authorization": ServerAuth};
  localStorage.cnnData2 = '{ "DBNAME":"cube00000011"}';
  var cnnData = JSON.parse(localStorage.cnnData2);

  $scope.GetBase64Image = function(rowWithout64Img, source){

    var imgPath = '';
    if (source == 'productsType' || source == 'carrousel'){
      imgPath = rowWithout64Img.CATIMAGE;
    }
    else{
      imgPath = rowWithout64Img.HOMELOGO;
    }

    $http.get(connServiceStringGateway + 'CubeFileDownload?obj={"filename": "' + imgPath + '"}').then(function (response) {

      if (source == 'productsType'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "/img/SCNoImage.jpg";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'carrousel'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.CATIMAGE = "img/cameras1100x700.png";
        }
        else{
          rowWithout64Img.CATIMAGE = "data:image/png;base64, " + response.data.imagedata;
        }
      }
      else if (source == 'masterpage'){
        if (response.data.imagedata == ''){
          // rowWithout64Img.CATIMAGE = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
          rowWithout64Img.HOMELOGO = "/img/1339313133186.png";
        }
        else{
          rowWithout64Img.HOMELOGO = "data:image/png;base64, " + response.data.imagedata;
        }
      }

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  }

    $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
        if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
        if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
        if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
        if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
        if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
        if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
      })


      $scope.GetBase64Image(MasterInfo, 'masterpage');


      MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

      $scope.MasterInfo = [];
      $scope.MasterInfo.push(MasterInfo);

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

    $http.get(connServiceStringGateway + 'Get_EcomCustomerInformation?obj={"method":"Get_EcomCustomerInformation","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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
        if (el.NAME == 'Logo'){MasterInfo.HOMELOGO = el.VALUE};
        if (el.NAME == 'CompanyPhone'){MasterInfo.CubeLocalPhone = el.VALUE};
        if (el.NAME == 'CompanyAddress'){MasterLocation = el.VALUE};
        if (el.NAME == 'CompanyCity'){MasterCity = el.VALUE};
        if (el.NAME == 'CompanyState'){MasterState = el.VALUE};
        if (el.NAME == 'Color'){MasterInfo.BackColor = el.VALUE};
      })


      $scope.GetBase64Image(MasterInfo, 'masterpage');


      MasterInfo.CubeLocation = MasterLocation + ', ' + MasterState + ', ' + MasterCity;

      $scope.MasterInfo = [];
      $scope.MasterInfo.push(MasterInfo);

    })
    .catch(function (data) {
      console.log('Error 16');
      console.log(data);
      swal("Cube Service", "Unexpected error. Check console Error 16.");
    });

  // Valida si variable del carrito existe caso contrario la crea
  if (typeof localStorage.myCart != 'undefined' && localStorage.myCart != ''){
    $scope.myCart = JSON.parse(localStorage.myCart);

    $scope.myCart.forEach(function(el){
      el.CATIMAGE = el.CATIMAGE.replace(".JPG", ".jpg");
      el.CATIMAGE = el.CATIMAGE.replace(".PNG", ".png");
      $scope.GetBase64Image(el, 'productsType');
    })

  }
  else{
    $scope.myCart = [];
  }

  function getArray(object){
      if (typeof object == 'undefined'){
        return [];
      }
      if (Array.isArray(object)){
        return object;
      }
      else{
        return [object]
      }
  }

  $http.get(connServiceStringGateway + 'Get_EcomPageLinks?obj={"method":"Get_EcomPageLinks","conncode":"' + cnnData.DBNAME + '"}').then(function (response) {

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

  $http.get(connServiceStringGateway + 'Get_Ecom_OrderHistoryDetail?obj={"method":"Get_Ecom_OrderHistoryDetail","conncode":"' + cnnData.DBNAME + '", "orderid": "' + localStorage.OrderID + '"}').then(function (response) {

    $scope.UserOrders = getArray(response.data.CubeFlexIntegration.DATA);

    $scope.UserOrderShip = $scope.UserOrders[0];

    console.log($scope.UserOrders);

  })
  .catch(function (data) {
    console.log('Error 16');
    console.log(data);
    swal("Cube Service", "Unexpected error. Check console Error 16.");
  });


}])
