/* Display riders for the hike */
function showRiders() {

    // Set on-click for see hikers button
    $('body').on('click', '.seeRiders-button', function() { 
        
        // Get ID of the clicked button (holds the key for unique hikes)
        var id = $(this).attr('id').split(',');

        var driver = id[0];
        var departureDate = id[1];

        $.get('/getRiders?driver='+driver+ '&departureDate=' + departureDate, function(data){

            if($('#riders-'+data[0]._id).children().length == 0){

                $riders = $('#riders-'+data[0]._id);

                $('<br><p></p><br>').html('Riders: ').appendTo($riders);

                for(let j=0;j<data[0].riders.length;j++){
                    $('<p></p>').html(data[0].riders[j]).appendTo($riders);
                }
            }
        });
    });
}


/* Delete hike as a driver */
function deleteHikeSetup () {

    // Set on-click for all dynamically added delete buttons
    $ ('body').on('click', '.delete-button', function() { 

        // Get ID of the clicked button (holds the key for unique hikes)
        var data = $(this).attr('id').split(',');

        var driver = data[0];
        var departureDate = data[1];
        console.log(data[0] + ' ' + data[1])

        // Send get AJAX to find the hike (key is driver and departureDate)
        $.ajax({
            type: 'DELETE',
            url: '/deleteHike?driver=' + driver + '&departureDate=' + departureDate,
            success: function(data) {
                location.reload();
            }
        });
    });
}


/* Set up the page */
$( document ).ready(function (){
    deleteHikeSetup();
    showRiders();
})
