(function() {
    var app = angular.module('infoBus');
    var usermasterctrl = function($scope, request, ctrlComm, $location) {
        console.log("-------------- usermasterctrl -------------------");
        $scope.tabActive('usermaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.userList = {};
        $scope.user = {};
        $scope.totalItems = 0;
        $scope.tableRows = [5, 10, 15, 20, 30, 40];
        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function() {
            // console.log('Page changed to: ' + $scope.currentPage);
        };
        $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1;
        }
        $scope.page = {};
        $scope.err = {};

        if (window.location.hash == "#/UserMaster-List") {
                $scope.loader(true);
                request.service('users', 'get', {} , {}, function(response) {
                console.log(response);
                $scope.loader(false);
                $scope.userList = response;    
                $scope.totalItems = $scope.userList.length;
                if ($scope.totalItems != 0 && $scope.tableRows.indexOf($scope.totalItems) == -1)
                    $scope.tableRows.push($scope.totalItems);

                if ($scope.totalItems != 0) {
                    $scope.tableRows = $scope.tableRows.sort(request.sort);
                    $scope.tableRows.splice($scope.tableRows.indexOf($scope.totalItems) + 1);
                    if ($scope.tableRows[1]) {
                        $scope.viewby = $scope.tableRows[1];
                    } else {
                        $scope.viewby = $scope.tableRows[0];
                    }
                    $scope.setItemsPerPage($scope.viewby);
                }
            })

        } else if (window.location.hash == "#/Add-User-Master") {

            $scope.page.title = 'Add User Master';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-User-Master") {
            $scope.page.title = 'Update User Master';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('userObj'));
        } else if (window.location.hash == '#/View-User-Master') {
            $scope.page.title = 'View User Master';
            $scope.page.type = 'view';
            prePoppulateValues(ctrlComm.get('userObj'));
        }

        var viewUserMaster = function(userObj) {
            ctrlComm.put('userObj', userObj);
            window.location.hash = '#/View-User-Master';
        }

        var addUserMaster = function() {
            window.location.hash = "#/Add-User-Master";
        }

        function prePoppulateValues(userObj) {
            //console.log("userObj")
            if (userObj) {
                $scope.user = userObj;
                $scope.user.roleId = $scope.user.roleId.toString();
            } else {
                window.location.hash = "#/UserMaster-List";
            }
        }

        function validateUserForm(cb){
            if (!$scope.user.firstName) {
                $scope.err.firstName = true;
            } else {
                delete $scope.err.firstName;
            }

            if (!$scope.user.lastName) {
                $scope.err.lastName = true;
            } else {
                delete $scope.err.lastName;
            }

            if (!$scope.user.loginId) {
                $scope.err.loginId = true;
            } else {
                delete $scope.err.loginId;
            }

            if (!$scope.user.password) {
                $scope.err.password = true;
            } else {
                delete $scope.err.password;
            }

            if (!$scope.user.address) {
                $scope.err.address = true;
            } else {
                delete $scope.err.address;
            }

            if (!$scope.user.phone) {
                $scope.err.phone = true;
            } else {
                if ($scope.user.phone.length != 10) {
                    $scope.err.phone_cdn = true;
                } else {
                    delete $scope.err.phone;
                    delete $scope.err.phone_cdn;
                }
            }
            if (!$scope.user.email) {
                $scope.err.email = true;
            } else {
                if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test($scope.user.email)) {
                    $scope.err.email_cdn = true;

                } else {
                    delete $scope.err.email;
                    delete $scope.err.email_cdn;
                }
            }


            if (!$scope.user.roleId) {
                $scope.err.roleId = true;
            } else {
                delete $scope.err.roleId;
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }

        var saveUserMaster = function(userObj) {
            console.log(userObj);
            validateUserForm(function(){
            request.service('registerUser', 'post', userObj , {}, function(response) {
               console.log(response);
                $scope.loader(false);
                if(response.statusCode == 200){
                    $scope.notification("Saved Successfully..");
                    window.location.hash = '#/UserMaster-List'
                }else{
                    $scope.notification("Not able to save, please contact Administrator..");
                }
            })
        })
            
        }

        var updateUserMaster = function(userObj) {        	
            validateUserForm(function(){
            request.service('registerUser', 'put', userObj , {}, function(response) {
               console.log(response);
               $scope.loader(false);
               if(response.statusCode == 200){
                    $scope.notification("Updated Successfully..");                    
                    window.location.hash = '#/UserMaster-List'
               }else{
                    $scope.notification("Not able to save, please contact Administrator..");
               }
            })
            })

        }

        var editUserMaster = function(userObj) {
            ctrlComm.put('userObj', userObj);
            window.location.hash = "#/Update-User-Master";
        }


        var cancelUserMaster = function() {
            window.location.hash = "#/UserMaster-List"
        }

        var deleteUserMaster = function(userObj) {
            console.log(userObj)
            var input = {
                text: 'Are you sure you want to delete',
                name: userObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(userObj);
            });
        }

        function confirmDelete(userObj) {
            request.service('users', 'delete', userObj.userId , {}, function(response) {
               //console.log(response)
               $scope.loader(false);
               if(response.statusCode == 200){
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-User-Master'
                    //$scope.viewby = $scope.tableRows[1];
               }else{
                    $scope.notification("Not able to delete, please contact Administrator..");
               }
            })
        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }



        $scope.showAlltableRows = showAlltableRows;
        $scope.addUserMaster = addUserMaster;
        $scope.saveUserMaster = saveUserMaster;
        $scope.updateUserMaster = updateUserMaster;
        $scope.editUserMaster = editUserMaster;
        $scope.deleteUserMaster = deleteUserMaster;
        $scope.cancelUserMaster = cancelUserMaster;
        $scope.viewUserMaster = viewUserMaster;
    }
    app.controller('usermasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', usermasterctrl]);
}());