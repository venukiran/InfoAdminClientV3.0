(function() {
    var app = angular.module('infoBus');
    var sponsorMasterCtrl = function($scope, request, ctrlComm, $location) {
        console.log("-------------- sponsorMasterCtrl -------------------");
        $scope.tabActive('sponsorMaster');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.sponsor = {};
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

        if (window.location.hash == "#/Sponsor-List") {
            $scope.getSponsorList(function() {
                $scope.totalItems = $scope.sponsorList.length;
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
        } else if (window.location.hash == "#/Add-Sponsor") {
            $scope.page.title = 'Add Sponsor';
            $scope.page.type = 'post';
        } else if (window.location.hash == "#/Update-Sponsor") {
            $scope.page.title = 'Update Sponsor';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('sponsorObj'));
        }

        var addSponsor = function() {
            window.location.hash = "#/Add-Sponsor";
        }

        function prePoppulateValues(sponsorObj) {
            if (sponsorObj) {
                $scope.sponsor = sponsorObj;
            } else {
                window.location.hash = "#/Sponsor-List";
            }
        }

        function validateSponsor(cb) {
            if (!$scope.sponsor.name) {
                $scope.err.name = true;
            } else {
                delete $scope.err.name;
            }

            if (!$scope.sponsor.address1) {
                $scope.err.address1 = true;
            } else {
                delete $scope.err.address1;
            }

            if (!$scope.sponsor.city) {
                $scope.err.city = true;
            } else {
                delete $scope.err.city;
            }

            if (!$scope.sponsor.state) {
                $scope.err.state = true;
            } else {
                delete $scope.err.state;
            }

            if (!$scope.sponsor.contactPerson) {
                $scope.err.contactPerson = true;
            } else {
                delete $scope.err.contactPerson;
            }

            if (!$scope.sponsor.phone) {
                $scope.err.phone = true;
            } else {
                if ($scope.sponsor.phone.length != 10) {
                    $scope.err.phone_cdn = true;
                } else {
                    delete $scope.err.phone;
                    delete $scope.err.phone_cdn;
                }
            }
            if (!$scope.sponsor.email) {
                $scope.err.email = true;
            } else {
                if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/).test($scope.sponsor.email)) {
                    $scope.err.email_cdn = true;

                } else {
                    delete $scope.err.email;
                    delete $scope.err.email_cdn;
                }
            }

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveSponsor = function(sponsorObj) {
            validateSponsor(function() {
                request.service('sponsers', 'post', sponsorObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully..");
                        window.location.hash = '#/Sponsor-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var updateSponsor = function(sponsorObj) {
            validateSponsor(function() {
                request.service('sponsers', 'put', sponsorObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully..");
                        window.location.hash = '#/Sponsor-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var editSponsor = function(sponsorObj) {
            ctrlComm.put('sponsorObj', sponsorObj);
            window.location.hash = "#/Update-Sponsor";
        }


        var cancelSponsor = function() {
            window.location.hash = "#/Sponsor-List"
        }

        var deleteSponsor = function(sponsorObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: sponsorObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(sponsorObj);
            });
        }

        function confirmDelete(sponsorObj) {
            request.service('sponsers', 'delete', sponsorObj.sponserId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Deleted Successfully..");
                    window.location.hash = '#/Add-Sponsor'
                } else {
                    $scope.notification("Not able to delete, please contact Administrator..");
                }
            })
        }

        var showAlltableRows = function() {
            $scope.viewby = $scope.totalItems;
            $scope.setItemsPerPage($scope.viewby);
        }



        $scope.showAlltableRows = showAlltableRows;
        $scope.addSponsor = addSponsor;
        $scope.saveSponsor = saveSponsor;
        $scope.updateSponsor = updateSponsor;
        $scope.editSponsor = editSponsor;
        $scope.deleteSponsor = deleteSponsor;
        $scope.cancelSponsor = cancelSponsor;
    }
    app.controller('sponsorMasterCtrl', ['$scope', 'request', 'ctrlComm', '$location', sponsorMasterCtrl]);
}());
