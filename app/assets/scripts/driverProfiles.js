/* Set up show hikes button */
function showHikes() {

    // Set on-click to display list of hikes hosted by user
    $('body').on('click', '.hostedHikes', function() {

        // Get ID of the clicked button, (holds the driver name)
        var driver = $(this).attr('id');

        // Fetch hike data with the driver
        $.get('/getHostedHike?driver=' + driver, function(data) {

            $rides = $('#rides-' + driver);

            $('<br><p class="rides-title"></p>').appendTo($rides);

            // Display information and participants for each hike
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].riders);
                $('<br><p></p>').html(data[i].origin + '→' + data[i].destination).appendTo($rides);
                $('<p></p>').html(data[i].size + '/' + data[i].capacity + ' spots taken').appendTo($rides);
                $('<p></p>').html('Leaving: ' + data[i].departureDate).appendTo($rides);
                $('<p></p>').html('Arriving: ' + data[i].arrivalDate).appendTo($rides);
                $('<p></p>').html('Price: $' + data[i].price).appendTo($rides);
                $('<p></p>').html('Riders: ').appendTo($rides);

                for (let j = 0; j < data[i].riders.length; j++) {
                    $('<p></p>').html(data[i].riders[j]).appendTo($rides);
                }
            }

            $('#' + driver).prop('disabled', true);
        });
    });
}


/* Set up the page */
$(document).ready(function() {
    showHikes();
})
