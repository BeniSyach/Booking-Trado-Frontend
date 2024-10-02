app.controller(
  "LoginController",
  function ($scope, $http, $location, AuthService) {
    $scope.user = {};
    $scope.isLoading = false;

    $scope.login = function () {
      $scope.isLoading = true;
      AuthService.login($scope.user)
        .then(function (response) {
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "You have successfully logged in!",
            showConfirmButton: false,
            timer: 1500,
          });

          // Simpan token dan alihkan ke dashboard setelah beberapa saat
          localStorage.setItem("token", response.data.token);
          setTimeout(function () {
            $location.path("/dashboard");
            $scope.$apply(); // pastikan view diupdate
          }, 1600);
        })
        .catch(function (error) {
          // Jika login gagal, tampilkan SweetAlert error
          Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text:
              "Login gagal : " +
              (error.data.error || "Unexpected error occurred"),
            confirmButtonText: "Coba Lagi",
          });
        })
        .finally(function () {
          $scope.isLoading = false; // set loading false setelah proses selesai
        });
    };
  }
);

app.controller(
  "DashboardController",
  function ($scope, $location, AuthService, TradoService, $timeout) {
    $scope.availableTrados = [];
    $scope.availability = {
      check_in: null,
      check_out: null,
    };
    $scope.isLoading = false;

    $scope.checkAvailability = function () {
      if ($scope.availability.check_in && $scope.availability.check_out) {
        $scope.isLoading = true;

        $timeout(function () {
          TradoService.checkAvailability(
            $scope.availability.check_in,
            $scope.availability.check_out
          )
            .then(function (response) {
              $scope.availableTrados = response.data;
              $scope.isLoading = false;

              if ($scope.availableTrados.length > 0) {
                Swal.fire({
                  title: "Ketersediaan Ditemukan",
                  text: "Trado tersedia untuk tanggal yang dipilih!",
                  icon: "success",
                  confirmButtonText: "OK",
                });
              } else {
                Swal.fire({
                  title: "Tidak Ada Ketersediaan",
                  text: "Tidak ada trado yang tersedia untuk tanggal yang dipilih.",
                  icon: "warning",
                  confirmButtonText: "OK",
                });
              }
            })
            .catch(function (error) {
              $scope.isLoading = false;
              console.error("Error checking availability:", error);
              Swal.fire({
                title: "Kesalahan",
                text: "Gagal memeriksa ketersediaan trado.",
                icon: "error",
                confirmButtonText: "OK",
              });
            });
        }, 1000);
      } else {
        Swal.fire({
          title: "Form Tidak Lengkap",
          text: "Silakan isi tanggal check-in dan check-out.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    };

    // Function for logging out
    $scope.logout = function () {
      AuthService.logout();
      $location.path("/login");
    };
  }
);

app.controller(
  "BookingController",
  function ($scope, $http, BookingService, TradoService) {
    $scope.bookings = [];
    $scope.booking = {};
    $scope.trados = [];
    $scope.isEdit = false;

    $scope.loadTrados = function () {
      TradoService.getTrados()
        .then(function (response) {
          $scope.trados = response.data;
        })
        .catch(function (error) {
          Swal.fire(
            "Kesalahan",
            "Gagal memuat trado: " + error.data.error,
            "error"
          );
        });
    };

    $scope.loadBookings = function () {
      BookingService.getBookings()
        .then(function (response) {
          $scope.bookings = response.data;
        })
        .catch(function (error) {
          Swal.fire(
            "Kesalahan",
            "Gagal memuat booking: " + error.data.error,
            "error"
          );
        });
    };

    // Simpan Booking (Tambah/Update)
    $scope.submitBooking = function () {
      Swal.fire({
        title: "Memuat...",
        text: "Silakan tunggu sementara kami memproses permintaan Anda.",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      if ($scope.isEdit) {
        BookingService.updateBooking($scope.booking)
          .then(function (response) {
            $scope.loadBookings();
            $scope.resetBooking();
            Swal.fire("Sukses", "Booking berhasil diperbarui!", "success");
          })
          .catch(function (error) {
            console.error("Kesalahan saat memperbarui booking:", error);
            Swal.fire(
              "Kesalahan",
              "Gagal memperbarui booking: " +
                (error.data?.error ||
                  error.message ||
                  "Kesalahan tidak dikenal"),
              "error"
            );
          });
      } else {
        BookingService.createBooking($scope.booking)
          .then(function (response) {
            $scope.loadBookings();
            $scope.resetBooking();
            Swal.fire("Sukses", "Booking berhasil dibuat!", "success");
          })
          .catch(function (error) {
            console.error("Kesalahan saat membuat booking:", error);
            Swal.fire(
              "Kesalahan",
              "Gagal membuat booking: " +
                (error.data?.error ||
                  error.message ||
                  "Kesalahan tidak dikenal"),
              "error"
            );
          });
      }
    };

    // Mengedit Booking
    $scope.editBooking = function (booking) {
      $scope.booking = angular.copy(booking);
      $scope.isEdit = true; // Set ke status edit
    };

    // Menghapus Booking
    $scope.deleteBooking = function (booking) {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda tidak akan dapat mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
      }).then((result) => {
        if (result.isConfirmed) {
          BookingService.deleteBooking(booking.id)
            .then(function (response) {
              $scope.loadBookings();
              Swal.fire("Dihapus!", "Booking Anda telah dihapus.", "success");
            })
            .catch(function (error) {
              console.error("Kesalahan saat menghapus booking:", error);
              Swal.fire(
                "Kesalahan",
                "Gagal menghapus booking: " +
                  (error.data?.error ||
                    error.message ||
                    "Kesalahan tidak dikenal"),
                "error"
              );
            });
        }
      });
    };

    $scope.viewBooking = function (booking) {
      $scope.booking = angular.copy(booking);
    };

    // Mengatur ulang booking
    $scope.resetBooking = function () {
      $scope.booking = {};
      $scope.isEdit = false; // Kembali ke status tambah
    };

    $scope.loadBookings();
    $scope.loadTrados();
  }
);

app.controller("SidebarController", function ($scope, $location, AuthService) {
  $scope.isActive = function (route) {
    return route === $location.path();
  };

  $scope.isLoginPage = function () {
    return $location.path() === "/login"; // Sesuaikan dengan rute login Anda
  };

  $scope.logout = function () {
    AuthService.logout();
    $location.path("/login"); // Redirect ke halaman login setelah logout
  };
});
