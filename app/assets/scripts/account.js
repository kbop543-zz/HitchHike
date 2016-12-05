/* Set up the update user form */
function signupSetup (){

    // Fetch the user's current info
    $.get('/getOneUser', function(data){

        $('#username').val(data.username);
        $('#firstName').val(data.firstName);
        $('#lastName').val(data.lastName);
        $('#email').val(data.email);

        //if the user is a driver display driver fields
        
        if(data.driver == 1){
            $('#beDriverButton').hide();
            $('#licensePlateField').val(data.licensePlate);
            $('#carModelField').val(data.carModel);
            $("#licensePlateField").prop('required',true);
            $("#carModelField").prop('required',true);
        }
        else{
            $('.driverInfo').hide();
            $('#noDriverButton').hide();
        }
    })

    // Set the form button on click to send an AJAX post to update
    $('#updateInfo').submit(function(event){

        event.preventDefault(); 

        // Get the data from form
        let formData = $('#updateInfo').serialize();

        // Send update POST AJAX
        $.post('/editUser', formData, function(data){
            console.log('Account');
            //alert('Account Updated');

            location.reload();
            

        })

        .fail(function(response){        
            alert(response.responseText);
        });

        return false;
    });
}


function beDriver(){
    $('#beDriverButton').click(function(e){
        $('#driverForm').slideToggle();
    });

    $('#driverForm').submit(function(event){
        event.preventDefault();

        // Get the data from form
        let formData = $('#driverForm').serialize();
        

        // Send post AJAX
        $.post('/beDriver', formData, function(data){
            console.log('Be Driver');
            //alert('You are now a driver');
            location.reload();
            

        })

        .fail(function(response){        
            alert(response.responseText);
        });

        return false;
    });
}

/* Set up the delete user button */
function deleteUserSetup (){

    // On delete user button click
    $('#deleteUser').click(function(){

        // Confirm Delete
        if (confirm("Are you sure you want to delete your account?") == true) {

            // Send delete AJAX
            $.ajax({
                type: 'DELETE',
                url: '/deleteUser/',
                success: function(data) {
                    alert("Deleted");
                    location.reload();
                },
                error: function(response){
                    alert(response.responseText);
                }
            });
        };
    });
};

/* Set up the delete user button */
function disableDriver (){

    // On delete user button click
    $('#noDriverButton').click(function(){

        // Confirm Delete
        if (confirm("Are you sure you don't want to be a driver anymore?") == true) {

            // Send delete AJAX
            $.ajax({
                type: 'delete',
                url: '/deleteDriver/',
                success: function(data) {
                    alert("You are no longer a driver.");
                    $("#licensePlateField").prop('required',false);
                    $("#carModelField").prop('required',false);
                    location.reload();
                },
                error: function(response){
                    alert(response.responseText);
                }
            });
        };
    });
};

/* Set up the page */
$( document ).ready(function (){
    $('#driverForm').hide();
    
    signupSetup();
    deleteUserSetup();
    beDriver();
    disableDriver();
    
})
