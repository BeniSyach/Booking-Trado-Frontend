app.factory("AuthService", function ($http) {
  return {
    login: function (user) {
      return $http.post("http://localhost:8000/api/login", user);
    },
    isLoggedIn: function () {
      return !!localStorage.getItem("token");
    },
    logout: function () {
      localStorage.clear();
    },
  };
});

app.factory("BookingService", function ($http) {
  var token = localStorage.getItem("token");
  return {
    getBookings: function () {
      return $http.get("http://localhost:8000/api/bookings", {
        headers: { Authorization: "Bearer " + token },
      });
    },
    createBooking: function (booking) {
      return $http.post("http://localhost:8000/api/bookings", booking, {
        headers: { Authorization: "Bearer " + token },
      });
    },
    updateBooking: function (booking) {
      return $http.put(
        "http://localhost:8000/api/bookings/" + booking.id,
        booking,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    },
    deleteBooking: function (id) {
      return $http.delete("http://localhost:8000/api/bookings/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    },
  };
});

app.factory("TradoService", function ($http) {
  var token = localStorage.getItem("token");
  return {
    getTrados: function () {
      return $http.get("http://localhost:8000/api/trados", {
        headers: { Authorization: "Bearer " + token },
      });
    },
    createTrados: function (booking) {
      return $http.post("http://localhost:8000/api/trados", booking, {
        headers: { Authorization: "Bearer " + token },
      });
    },
    checkAvailability: function (check_in, check_out) {
      return $http.post("http://localhost:8000/api/check-availability", {
        check_in: check_in,
        check_out: check_out
    },{
      headers: { Authorization: "Bearer " + token },
    });
    },
  };
});
