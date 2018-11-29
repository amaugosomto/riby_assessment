(function () {
    'use strict';

    angular.module('savingsApp', [
        'ngMaterial', 'ngMessages', "ui.router", 
        "angular-storage", "angularMoment", "angularUtils.directives.dirPagination",
        "ngAnimate", "ngSanitize", "ui.bootstrap"
    ])
})();

angular.module('savingsApp').config(['$mdThemingProvider', theme_provider])
    .config(['$stateProvider', '$httpProvider', state_http_provider])
    .run(['$rootScope', '$state', 'store', 'Auth', 'moment', initialize]);


function theme_provider($mdThemingProvider) {
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });

    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('blue', {
            'default': '800',
            'hue-1': '800'
        })
        .accentPalette('blue', {
            'default': '500',
            'hue-1': '100'
        });
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');
}

function state_http_provider($stateProvider, $httpProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'main': {
                    templateUrl: './components/Home/home.html'
                }
            }
        })
        .state('services', {
            url: '/services',
            views: {
                'main': {
                    templateUrl: './components/Home/services.html'
                }
            }
        })
        .state('team', {
            url: '/team',
            views: {
                'main': {
                    templateUrl: './components/Home/team.html'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'main': {
                    templateUrl: "./components/Login/login.html",
                    controller: "loginController as login"
                }
            }
        })
        .state('logout', {
            url: "/logout",
            views: {
                'main': {
                    templateUrl: "./components/Logout/logout.html",
                    controller: "logoutController as vm"
                }
            }
        })
        .state('register', {
            url: "/register",
            views: {
                'main': {
                    templateUrl: "./components/Register/register.html",
                    controller: "registerController as register"
                }
            }

        })
        .state('reset', {
            url: '/reset/:token', 
            views: {
                'main': {
                    templateUrl: './components/Profile/Password_reset/password.html',
                    controller: 'reset_controller as vm'
                }
            }
        })
        .state('dashboard', {
            url: "/dashboard",
            resolve: {
                result: async function (dashBoardService, $state, store) {
                    let userId = store.get('user').userId;
                    let permission = store.get('user').user_permission;
                    let token = store.get('user').token;

                    if (!token) $state.go('login');

                    payload = {};
                    if (permission[0] == 'supAdmin') {
                        payload.counts = await dashBoardService.getCount();
                    } else {
                        payload.saves = await dashBoardService.getSaves(userId);
                    }
                    return payload;
                }
            },
            views: {
                'main': {
                    templateUrl: "./components/Dashboard/dashboard.html",
                    controller: "dashController as dashboard",
                },
                'main.saves@dashboard': {
                    templateUrl: "./components/Dashboard/dashboardSaves.html",
                    controller: "dashController as dashboard",
                }
            },
            requiresAutentication : true
        })
        .state('dashboard.payment', {
            url: "/payment/:saveId/:amount/:plan",
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Payment/payment.html",
                    controller: "paymentController as vm",
                }
            },
            permissions: ["admin", "user"]
            // authenticated: true
        })
        .state('dashboard.withdraw', {
            url: "/withdraw/:date/:saveId",
            resolve: {
                result: function (profileService, store) {
                    let userId = store.get('user').userId;

                    return profileService.getUser(userId);
                }
            },
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Withdraw/withdraw.html",
                    controller: "withdrawController as withdraw"
                }
            },
            permissions: ["admin", "user"]
        })
        .state('dashboard.pending', {
            url: "/pending",
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Pending/pending.html",
                    controller: "pendingController as vm",
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "user"]
        })
        .state('dashboard.profile', {
            url: '/profile',
            resolve: {
                result: function (profileService, $state, store) {
                    let userId = store.get('user').userId;
                    let token = store.get('user').token;

                    if (!token) $state.go('login');

                    return profileService.getUser(userId);
                }
            },
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Profile/profile.html",
                    controller: 'profileController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "user"]
        })
        .state('dashboard.profile.account', {
            url: '/account',
            views: {
                'main.saves@dashboard': {
                    templateUrl: './components/Profile/Account/account.html',
                    controller: 'accountController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "user"]
        })
        .state('dashboard.saving', {
            url: "/saving",
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Saving/savingOpt.html",
                    controller: 'saveController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "user"]
        })
        .state('dashboard.saving.saveOption', {
            url: "/:state",
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Saving/savingOptions.html",
                    controller: "saveController as saving",
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "user"]
        })
        .state('dashboard.saving.saveOption.save', {
            url: "/:option",
            views: {
                'main.saves@dashboard': {
                    templateUrl: "./components/Saving/savings.html",
                    controller: "saveController as save",
                }
            },
            permissions: ["admin", "user"]
        })
        .state('dashboard.viewSave', {
            url: '/save/:id',
            resolve: {
                result: function (historyService, $state, store) {
                    let saveId = store.get('saveId');
                    let token = store.get('user').token;

                    if (!token) $state.go('login');

                    return historyService.getSave(saveId);
                }
            },
            views: {
                'main.saves@dashboard': {
                    templateUrl: './components/Saving/Single/save.html',
                    controller: 'historyController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "user"]
        })
        .state('dashboard.reports', {})
        .state('dashboard.reports.savings', {
            url: '/reports/savings',
            resolve: {
                result: function (reportsService, $state, store) {
                    let token = store.get('user').token;
                    if (!token) $state.go('login');

                    return reportsService.getSavings();
                }
            },
            views: {
                'main.saves@dashboard': {
                    templateUrl: './components/Reports/saving.report.html',
                    controller: 'reportsController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["admin", "supAdmin"]
        })
        .state('dashboard.reports.users', {
            url: '/reports/users',
            resolve: {
                result: function (reportsService, $state, store) {
                    let token = store.get('user').token;
                    if (!token) $state.go('login');

                    return reportsService.getUsers();
                }
            },
            views: {
                'main.saves@dashboard': {
                    templateUrl: './components/Reports/users.report.html',
                    controller: 'reportsController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["supAdmin"]
        })
        .state('dashboard.reports.users.saving', {
            url: '/saves/:userId',
            resolve: {
                result: function (dashBoardService, $state, store) {
                    let token = store.get('user').token;
                    if (!token) $state.go('login');

                    let userId = store.get('userDetails').userId;
                    console.log(userId);
                    return dashBoardService.getSaves(userId);
                }
            },
            views: {
                'main.saves@dashboard': {
                    templateUrl: './components/Admin/userSavings.html',
                    controller: 'adminController as vm'
                }
            },
            requiresAutentication : true,
            permissions: ["supAdmin"]
        })
        .state('contact', {
            url: '/contact',
            templateUrl: './components/Contact/contact.html',
            controller: 'contactController as vm'
        })
        .state('noRoute', {
            url: '*path',
            redirectTo: 'home'
        });

    $httpProvider.interceptors.push('interceptor');
}

function initialize($rootScope, $state, store, Auth, moment) {

    "use strict"

    Auth.init();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        // console.log(toState)
        $rootScope.fromState = fromState.name;


        // Making sure a user session is not more than a day
        if (store.get('time')) {

            let time = moment();
            let prevDate = moment(store.get('time'));
            if (Math.round(time.diff(prevDate, 'second')) >= 0) {
                store.remove('user');
                store.remove('userDetails');
                store.remove('saveId');
                store.remove('userId');
                store.remove('time');

                event.preventDefault();
                $state.reload('login').then(()=>{
                    $state.go('login');
                })
                // For nav bar 
                // var check = null;
                // $rootScope.$broadcast('login', check);
                // $rootScope.checks = null;
            }
        }

        // Checking if a user is logged in so that the nav bar changes as needed
        if (store.get('user')) {
            var check = true;
            $rootScope.$broadcast('login', check);
            $rootScope.checks = check;
        } else {
            let check = null;
            $rootScope.$broadcast('login', check);
            $rootScope.checks = null;
        }

        // Checking for route access
        if (!Auth.checkPermisiionForView(toState)){
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $state.go(fromState.name);
            } else {
                event.preventDefault();
                $state.go('login');
            }
            
        }

        /** 
         * 
         * Checking the state being gone to so as to change active links in the dashboard 
         * and hide the nav bar directive.
         * 
         * (else) if (!check) and the states its to go to is not listed then go to login
         * 
        */
        if (check) {

            if (/reports\/users/i.test(toState.url)) {;
                $rootScope.active = 'repUser';
            } else if (/reports\/savings/i.test(toState.url)) {
                $rootScope.active = 'repSavings';
            } else if (/profile/i.test(toState.url)) {
                $rootScope.active = 'usrProfile';
            } else if (/pending/i.test(toState.url)) {
                $rootScope.active = 'pending';
            } else if (/saving/i.test(toState.url)) {
                $rootScope.active = 'saving';
            } else if (/dashboard/i.test(toState.url)) {
                $rootScope.active = 'dashboard';
            };

            let url = toState.name;
            let str = url.search("dashboard");

            if (str >= 0) {
                $rootScope.viewDirective = true;
            } else {
                $rootScope.viewDirective = false;
            }
        } else {
            if (toState.name !== 'login' && toState.name !== 'home' && toState.name !== 'register' && toState.name !== 'contact'
             && toState.name !== 'activate' && toState.name !== 'reset' && toState.name !== 'services' && toState.name !== 'team') {
                $state.go('login');
                event.preventDefault();
            }
        }

        // Handles the redirect
        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams, {
                location: 'replace'
            });
        }
    });

    // Handles a custom error
    $rootScope.$on('stateChangeError', function(event) {
        let data = $rootScope.fromState;
        if (data == 'home'){
            $state.reload(data).then(()=> {
                $state.go(data);
            });
        } else {
            $state.go(data);
        }
        
        event.stopPropagation();
        event.preventDefault();
    })
}