var app = angular.module("bookingTradoApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "templates/login.html",
      controller: "LoginController",
    })
    .when("/dashboard", {
      templateUrl: "templates/dashboard.html",
      controller: "DashboardController",
      resolve: {
        auth: function (AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/bookings", {
      templateUrl: "templates/bookings.html",
      controller: "BookingController",
      resolve: {
        auth: function (AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/users", {
      templateUrl: "templates/users.html",
      controller: "UsersController",
      resolve: {
        auth: function (AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path("/login");
          }
        },
      },
    })
    .otherwise({
      redirectTo: "/login",
    });
});
