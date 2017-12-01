(function() {
    var app = angular.module('infoBus');

    var request = function($http, secure) {
        var setup = {
            'protocol': 'http',
            'host': 'localhost',
            'port': '8080',
            'prefix': 'infobusadmin',
            'paths': {
                'login': 'login',
                'locations': 'locations',
                'screens': 'screens',
                'screenPosition': 'screenPosition',
                'msgcontent': 'msgcontent',
                'sponsers': 'sponsers',
                'servers': 'servers',
                'videos': 'videos',
                'bookslots': 'bookslots',
                'slotTracker': 'slotTracker',
                'platforms': 'platforms',
                'users': 'users',
                'registerUser': 'registerUser',
                'bookslot': 'bookslot',
                'playdata': 'playdata'
            },
            'url': function(key) {
                if (setup.paths.hasOwnProperty(key)) {
                   //return setup.protocol + '://' + setup.host + ':' + setup.port + '/' + setup.paths[key]

                   return setup.protocol + '://' + setup.host + ':' + setup.port + '/' + setup.prefix + '/' + setup.paths[key]
                } else {
                    return 'invalid service'
                }
            }
        }

        // Making a service call
        var serviceCall = function(key, type, input, config, cb) {
            /*if (key != 'login' && key != 'forgotPassword') {
                config.headers['Content-Type'] = 'application/json';
            }*/
            if (type == 'delete') {
                console.log("Type : ", type, ' :: ', setup.url(key), ' :: ', input);
                input = JSON.stringify(input);
                $.ajax({
                    url: setup.url(key) + '/' + input,
                    type: 'DELETE',
                    data: '',
                    headers: config.headers,
                    cache: false,
                    success: function(data) {
                        console.log("DELETE SUCCESS :: ", data);
                        cb(data);
                    },
                    error: function(err) {
                        console.log("ERROR DELETE EVENT :: ", err)
                        var data = { statusMessage: 'Server is down. Please try after some time.' }
                        cb(data);
                    }
                });

            } else {
                /*                console.log(type, ' :: ', key, ' :: ', setup.url(key), ' :::: ', input, ' ::::: ', config);*/
                $http[type](setup.url(key), input, config)
                    .success(function(data) {
                        cb(data);
                    })
                    .error(function(err) {
                        console.log('ERROR :: ', err);
                        var data = { statusMessage: 'Server is down. Please try after some time.' }
                        cb(data);
                    });
            }
        }

        var setObj = function(key, data) {
            window.sessionStorage.setItem(secure.encode(key), secure.encode(JSON.stringify(data)))
        }
        var getObj = function(key) {
            var obj = window.sessionStorage.getItem(secure.encode(key));
            if (obj) {
                var obj = secure.decode(obj);
                try {
                    return JSON.parse(obj);
                } catch (e) {
                    return { distrub: true }
                }
            } else {
                return null;
            }
        }

        var setItem = function(key, data) {
            window.sessionStorage.setItem(secure.encode(key), secure.encode(data));
        }
        var getItem = function(key) {
            var item = window.sessionStorage.getItem(secure.encode(key));
            if (item) {
                return secure.decode(item);
            } else {
                return null;
            }
        }

        var removeItem = function(key) {
            window.sessionStorage.removeItem(secure.encode(key));
        }

        var sortNumber = function(a, b) {
            return a - b;
        }

        return {
            'service': serviceCall,
            'setObj': setObj,
            'getObj': getObj,
            'setItem': setItem,
            'getItem': getItem,
            'removeItem': removeItem,
            'setup': setup,
            'sort': sortNumber,
        }
    }
    app.factory('request', ['$http', 'secure', request]);



    app.service('ctrlComm', function() {
        var ctrlPocket = {};
        var put = function(key, value) {
            ctrlPocket[key] = value;
        };
        var get = function(key) {
            return ctrlPocket[key];
        };
        var del = function(key) {
            delete ctrlPocket[key];
        };
        return {
            put: put,
            get: get,
            del: del
        };
    });

    app.controller('confirmBoxCtrl', ['$scope', '$modalInstance', 'input', function($scope, $modalInstance, input) {
        $scope.input = input;
        $scope.ok = function() {
            $modalInstance.close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }]);


    app.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    app.directive('callDate', function($timeout, $parse) {
        return {
            //scope: true,   // optionally create a child scope
            link: function(scope, element, attrs) {
                var model = $parse(attrs.callDate);
                scope.$watch(model, function(value) {
                    console.log("scope" + value)
                    if (value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });


    app.directive('nameDir', function() {
        var regexp = /^[a-z\s]+$/i;
        return {
            link: function(scope, elem, attrs, ctrl) {
                var char;
                var model;
                elem.on("keypress", function(event) {
                    char = String.fromCharCode(event.which)
                    model = elem.val() + char;
                    if (!regexp.test(model) || model.length > 50)
                        event.preventDefault();
                })
            }
        };
    });

    app.directive('pincodeDir', function() {
        var regexp = /^[0-9]{1,6}$/;
        return {
            link: function(scope, elem, attrs, ctrl) {
                var char;
                var model;
                elem.on("keypress", function(event) {
                    char = String.fromCharCode(event.which)
                    model = elem.val() + char;
                    if (!regexp.test(model) || model.length > 50)
                        event.preventDefault();
                })
            }
        };
    });

    app.directive('platformDir', function() {
        var regexp = /^[0-9]{1,2}$/;
        return {
            link: function(scope, elem, attrs, ctrl) {
                var char;
                var model;
                elem.on("keypress", function(event) {
                    char = String.fromCharCode(event.which)
                    model = elem.val() + char;
                    if (!regexp.test(model) || model.length > 50)
                        event.preventDefault();
                })
            }
        };
    });

    app.directive('phoneNumDir', function() {
        var regexp = /^[0-9]{1,10}$/;
        return {
            link: function(scope, elem, attrs, ctrl) {
                var char;
                var model;
                elem.on("keypress", function(event) {
                    char = String.fromCharCode(event.which)
                    model = elem.val() + char;
                    if (!regexp.test(model) || model.length > 50)
                        event.preventDefault();
                })
            }
        };
    });



    app.service('fileUpload', ['$http', 'request', function($http, request) {
        this.uploadFileToUrl = function(file, key, obj, url, config, callType, cb) {
            var fd = new FormData();
            fd.append(key, file);
            fd.append('jsondata', JSON.stringify(obj))
            config.headers['Content-Type'] = undefined;
            $http[callType](request.setup.url(url), fd, {
                    transformRequest: angular.identity,
                    headers: config.headers
                })
                .success(function(data) {
                    if (cb) cb(data);
                    console.log("-------- success ", data);
                })
                .error(function(err) {
                    if (cb) cb(err);
                    console.log("-------- error ", err);
                });
        }
    }]);

})();
