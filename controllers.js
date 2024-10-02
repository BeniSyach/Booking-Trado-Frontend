app.controller('LoginController', function($scope, $http, $location, AuthService) {
    $scope.user = {};

    $scope.login = function() {
        AuthService.login($scope.user)
            .then(function(response) {
                localStorage.setItem('token', response.data.token);
                $location.path('/dashboard');
            })
            .catch(function(error) {
                alert('Login failed: ' + error.data.error);
            });
    };
});

app.controller('DashboardController', function($scope, $location, AuthService) {
    $scope.message = 'Welcome to the Admin Dashboard!';
    
    $scope.logout = function() {
        AuthService.logout();
        $location.path('/login'); // Arahkan kembali ke login setelah logout
    };
});

app.controller('BookingController', function($scope, $http, BookingService, TradoService) {
    $scope.bookings = [];
    $scope.booking = {};
    $scope.trados = [];
    $scope.isEdit = false;

    $scope.loadTrados = function() {
        TradoService.getTrados()
            .then(function(response) {
                $scope.trados = response.data;
            })
            .catch(function(error) {
                alert('Failed to load trados: ' + error.data.error);
            });
    };

    $scope.loadBookings = function() {
        BookingService.getBookings()
            .then(function(response) {
                $scope.bookings = response.data;
            })
            .catch(function(error) {
                alert('Failed to load bookings: ' + error.data.error);
            });
    };

    // Menyimpan Booking (Tambah/Update)
    $scope.submitBooking = function() {
        if ($scope.isEdit) {
            BookingService.updateBooking($scope.booking)
                .then(function(response) {
                    $scope.loadBookings();
                    $scope.resetBooking();
                })
                .catch(function(error) {
                    console.error('Error updating booking:', error);
                    alert('Failed to update booking: ' + (error.data?.error || error.message || 'Unknown error'));
                });
        } else {
            BookingService.createBooking($scope.booking)
                .then(function(response) {
                    $scope.loadBookings();
                    $scope.resetBooking();
                })
                .catch(function(error) {
                    console.error('Error creating booking:', error);
                    alert('Failed to create booking: ' + (error.data?.error || error.message || 'Unknown error'));
                });
        }
    };

    // Mengedit Booking
    $scope.editBooking = function(booking) {
        $scope.booking = angular.copy(booking);
        $scope.booking.check_in = booking.check_in; 
        $scope.booking.check_out = booking.check_out;
        $scope.isEdit = true; // Set status edit
    };

    // Menghapus Booking
    $scope.deleteBooking = function(booking) {
        if (confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
            BookingService.deleteBooking(booking.id)
                .then(function(response) {
                    $scope.loadBookings();
                })
                .catch(function(error) {
                    console.error('Error deleting booking:', error);
                    alert('Failed to delete booking: ' + (error.data?.error || error.message || 'Unknown error'));
                });
        }
    };

    // Mengatur ulang booking
    $scope.resetBooking = function() {
        $scope.booking = {};
        $scope.isEdit = false; // Kembali ke status tambah
    };

    $scope.loadBookings();
    $scope.loadTrados();
});
