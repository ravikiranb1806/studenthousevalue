'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
     $urlRouterProvider.otherwise("/app/home");
    //
    // Set up the states
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "assets/views/app.html",
        resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl', 'truncate', 'htmlToPlaintext', 'angular-notification-icons'),
        abstract: true
    }).state('app.home', {
        url: "/home",
        templateUrl: "assets/views/home.html",
        
        controller: 'eventsCtrl',
        title: 'Events',
        ncyBreadcrumb: {
            label: 'Home'
        }

    }).state('app.payment-success', {
        url: "/payment-success/:ticket_id",
        templateUrl: "assets/views/scm_payment_success.html",
        
        controller: 'paymentCtrl',
        title: 'Payment',
        ncyBreadcrumb: {
            label: 'Payment'
        }   
    }).state('app.pages', {
        url: '/pages',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Pages',
        ncyBreadcrumb: {
            label: 'Pages'
        }
    }).state('app.pages.register', {
        url: '/register',
        templateUrl: "assets/views/register.html",
        resolve: loadSequence('flow', 'userCtrl'),
        ncyBreadcrumb: {
            label: 'Register'
        }

    }).state('app.pages.studentslist', {
        url: '/studentslist',
        templateUrl: "assets/views/studentslist.html ",
        ncyBreadcrumb: {
            label: 'All Mentors'
        }
    }).state('app.pages.adminlist', {
        url: '/adminlist',
        templateUrl: "assets/views/adminlist.html ",
        ncyBreadcrumb: {
            label: 'All Mentors'
        }
    }).state('app.pages.accadminlist', {
        url: '/accadminlist',
        templateUrl: "assets/views/accadminlist.html ",
        ncyBreadcrumb: {
            label: 'All Mentors'
        }
    }).state('app.pages.accomodatorslist', {
        url: '/accomodatorslist',
        templateUrl: "assets/views/accomodatorslist.html ",
        ncyBreadcrumb: {
            label: 'All Mentors'
        }
    }).state('app.pages.accrequestlist', {
        url: '/accrequestlist',
        templateUrl: "assets/views/accrequestlist.html ",
        ncyBreadcrumb: {
            label: 'All Mentors'
        }
    }).state('app.pages.blockedrequestlist', {
        url: '/blockedrequestlist',
        templateUrl: "assets/views/blockedrequestlist.html ",
        ncyBreadcrumb: {
            label: 'All Mentors'
        }
    }).state('app.pages.chat', {
        url: '/chat/:userid',
        templateUrl: "assets/views/chat.html ",
        controller: 'ChatCtrlFb',
        ncyBreadcrumb: {
            label: 'All Mentors'
        }

    }).state('error', {
        url: '/error',
        template: '<div ui-view class="fade-in-up"></div>'
    }).state('error.404', {
        url: '/404',
        templateUrl: "assets/views/utility_404.html",
    }).state('error.500', {
        url: '/500',
        templateUrl: "assets/views/utility_500.html",
    })



    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);