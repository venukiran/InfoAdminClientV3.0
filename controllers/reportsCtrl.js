(function() {
    var app = angular.module('infoBus');
    var reportsCtrl = function($scope, request, ctrlComm, $location, $filter) {
        console.log("-------------- reportsCtrl -------------------");
        $scope.tabActive('reports');
        $scope.viewby = 10;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 15;
        $scope.report = {};
        $scope.totalItems = 0;
        $scope.tableRows = [5, 10, 15, 20, 30, 40];
        $scope.report.startDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.report.endDate = $filter('date')(new Date(), 'yyyy-MM-dd');
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

        $scope.getReports = function(report) {
            var req = {};
            if (report.locId != undefined) {
                req.locationName = $filter('filter')($scope.busStationList, { locationId: report.locId })[0].name
            }

            req.endDate = report.endDate;
            req.startDate = report.startDate
            console.log(req)
            $scope.loader(true);
            request.service('playdata', 'post', req, {}, function(response) {
                $scope.loader(false);
                $scope.reportsList = [];
                $scope.reportsList = response;
                if(report.sponserId != undefined || report.sponserId != null){
                    $scope.reportsList = $filter('filter')(response, { sponser: $filter('filter')($scope.sponsorList, { sponserId: report.sponserId })[0].name });
                }else{
                    $scope.reportsList = response;
                }
                $scope.totalItems = $scope.reportsList.length;
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
        }

        $scope.exportFile = function() {
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        };



    }
    app.controller('reportsCtrl', ['$scope', 'request', 'ctrlComm', '$location', '$filter', reportsCtrl]);
}());
