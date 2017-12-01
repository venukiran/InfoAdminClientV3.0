(function() {
    var app = angular.module('infoBus');
    var scrollTextCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- scrollTextCtrl -------------------");
        $scope.tabActive('scrollText');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.scrollText = {};
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

        if (window.location.hash == "#/Scroll-Text-List") {
            /*$scope.scrollTextList = [{
                "CITY": "Vijayawada",
                "LOCATION": "Bandar",
                "CITY_ID": "1",
                "LOC_ID": "1",
                "Message": "Hello this is scroll text",
                "message_type": "Scroll",
                "status": 'Active'
            }, {
                "CITY": "Anantapur",
                "LOCATION": "Anantapur",
                "CITY_ID": "4",
                "LOC_ID": "2",
                "Message": "Hello this is fixed text",
                "message_type": "Fixed",
                "status": 'In-Active'
            }]*/
            $scope.loader(true);
            request.service('msgcontent', 'get', {}, {}, function(response) {
                $scope.loader(false);
                $scope.scrollTextList = response;
                angular.forEach($scope.scrollTextList, function(obj) {
                    obj.locationName = $filter('filter')($scope.busStationList, { locationId: obj.locId })[0].name
                })
                $scope.totalItems = $scope.scrollTextList.length;
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
        } else if (window.location.hash == "#/Add-Scroll-Text") {
            $scope.page.title = 'Add Scroll Text';
            $scope.page.type = 'post';
            $scope.scrollText.status = true;
        } else if (window.location.hash == "#/Update-Scroll-Text") {
            $scope.page.title = 'Update Scroll Text';
            $scope.page.type = 'put'
            prePoppulateValues(ctrlComm.get('scrollTextObj'));
        }


        var addScrollText = function() {
            window.location.hash = "#/Add-Scroll-Text";
        }

        function prePoppulateValues(scrollTextObj) {
            if (scrollTextObj) {
                if (scrollTextObj.status == 'Active') {
                    scrollTextObj.status = true;
                } else {
                    scrollTextObj.status = false;
                }
                $scope.scrollText = scrollTextObj;
            } else {
                window.location.hash = "#/Scroll-Text-List";
            }
        }

        function validateScrollText(cb) {
            if (!$scope.scrollText.locId) {
                $scope.err.locId = true;
            } else {
                delete $scope.err.locId;
            }

            if (!$scope.scrollText.msgContent) {
                $scope.err.msgContent = true;
            } else {
                delete $scope.err.msgContent;
            }

            if (!$scope.scrollText.msgType) {
                $scope.err.msgType = true;
            } else {
                delete $scope.err.msgType;
            }

          



            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                console.log("ERROR OBJECT ", $scope.err);
            }
        }


        var saveScrollText = function(scrollTextObj) {
            validateScrollText(function() {
                request.service('msgcontent', 'post', scrollTextObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Saved Successfully..");
                        window.location.hash = '#/Scroll-Text-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var updateScrollText = function(scrollTextObj) {
            validateScrollText(function() {
                request.service('msgcontent', 'put', scrollTextObj, {}, function(response) {
                    console.log(response);
                    $scope.loader(false);
                    if (response.statusCode == 200) {
                        $scope.notification("Updated Successfully..");
                        window.location.hash = '#/Scroll-Text-List'
                    } else {
                        $scope.notification("Not able to save, please contact Administrator..");
                    }
                })
            })
        }

        var editScrollText = function(scrollTextObj) {
            ctrlComm.put('scrollTextObj', scrollTextObj);
            window.location.hash = "#/Update-Scroll-Text";
        }


        var cancelScrollText = function() {
            window.location.hash = "#/Scroll-Text-List";
        }

        var deleteScrollText = function(scrollTextObj) {
            var input = {
                text: 'Are you sure you want to delete',
                name: scrollTextObj.display_name
            }
            $scope.confirmation(input, function() {
                confirmDelete(scrollTextObj);
            });
        }

        function confirmDelete(scrollTextObj) {
            request.service('msgcontent', 'delete', scrollTextObj.msgId, {}, function(response) {
                console.log(response);
                $scope.loader(false);
                if (response.statusCode == 200) {
                    $scope.notification("Delted Successfully..");
                    window.location.hash = '#/Add-Scroll-Text'
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
        $scope.addScrollText = addScrollText;
        $scope.saveScrollText = saveScrollText;
        $scope.updateScrollText = updateScrollText;
        $scope.editScrollText = editScrollText;
        $scope.deleteScrollText = deleteScrollText;
        $scope.cancelScrollText = cancelScrollText;
    }
    app.controller('scrollTextCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', scrollTextCtrl]);
}());
