/* Set up create a hike button */
function hideAddCarpool() {

    // Fetch the user's current info
    $.get('/getOneUser', function(data) {

        if (data.driver == 0) {
            $('#createACarpoolButton').hide();
        }
    })
}

/* Register user for this hike and change the join button */
function registerRideSetup() {

    // Set on-click for all dynamically added join buttons
    $('body').on('click', '.join-button', function() {

        var button = $(this);

        // Get ID of the clicked button, (holds the key for unique hikes)
        var data = $(this).attr('id').split(',');

        var driver = data[0];
        var departureDate = data[1];

        var rideData = {};
        rideData['driver'] = driver;
        rideData['departureDate'] = departureDate;

        // Register user and change the join button to a cancel button
        $.post('/registerRide', rideData, function(data) {
            $(button).prop('value', 'Cancel Ride');
            location.reload();
        });
    })
}

/* Filter hikes to only display hikes the user has joined */
function showMyHikes() {
    $('#myHikesButton').click(function() {
        window.location.replace('/dashboard?mine=true');
    });
}

/* Sort hikes from lowest to highest price */
function sortByPrice() {
    $('#sortByPriceButton').click(function() {
        window.location.replace('/dashboard?priceSort=true');
    });
}

/* Sort hikes alphabetically by origin */
function sortByOrigin() {
    $('#sortByOriginButton').click(function() {
        window.location.replace('/dashboard?originSort=true');
    });
}

/* Sort hikes alphabetically by destination */
function sortByDestination() {
    $('#sortByDestinationButton').click(function() {
        window.location.replace('/dashboard?destinationSort=true');
    });
}

/* Set up the create hike form */
function createNewHike() {

    // Set the create hike button to open the form
    $('#createACarpoolButton').click(function() {

        if ($('.create-card').is(':visible')) {
            $('.create-card').hide();
        } else {
            $('.create-card').show();
        }

        $('#createHikeForm').slideToggle('slow');

        /* Set the create account button on click to send an AJAX post to create a new hike */
        $('#createHikeForm').submit(function(event) {

            event.preventDefault();

            // Get the data from form
            let rideData = $('#createHikeForm').serialize();

            // Send post AJAX to add a new hike
            $.post('/addNewHike', rideData, function(data) {
                alert('Created new Hike');

                // Reset the create hike form
                $('#createHikeForm').each(function() {
                    this.reset();
                });

                // Reload page
                location.reload();
            })

            .fail(function(response) {
                alert(response.responseText);
            });

            return false;
        });
    });
}

/* Set up the page */
$(document).ready(function() {
    hideAddCarpool();
    showMyHikes();
    registerRideSetup();
    createNewHike();
    sortByPrice();
    sortByOrigin();
    sortByDestination();

    // Redirect the page with the search query
    $('#searchHikesButton').click(function() {
        var searchval = $('#search-bar').val();
        window.location.replace('/dashboard?destination=' + searchval);
    });

    // Redirect to dashboard
    $('#resetSearchButton').click(function() {
        window.location.replace('/dashboard');
    });
})