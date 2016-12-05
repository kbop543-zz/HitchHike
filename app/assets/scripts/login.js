/* Set up the sign up form */
function signupSetup() {

    /* Set on-click to slide open the sign up form */
    $('#signupButton').click(function() {
        $('#signup').slideToggle('slow');
    });

    /* Set the create account button on-click to send an AJAX post*/
    $('#signup').submit(function(event) {

        event.preventDefault();

        // Get the data from form
        let formData = $('#signup').serialize();

        // Send post AJAX to create account
        $.post('/createAccount', formData, function(data) {
            alert('User created');

            // Reset form
            $('#signup').each(function() {
                this.reset();
                $('#signup').slideToggle('slow');
            });
        })

        .fail(function(response) {
            alert(response.responseText);
        });

        return false;
    });
}


/* Set up the sign in form */
function signInSetup() {

    // Set the sign in button on-click function
    $('#login').submit(function(event) {

        event.preventDefault();

        // Get the data from form
        let formData = $('#login').serialize();

        // Send post AJAX
        $.post('/signIn', formData, function(data) {
            window.location.replace('/dashboard');
        })

        .fail(function(response) {
            alert(response.responseText);
        });

        return false;
    })
};


/* Set up the page */
$(document).ready(function() {
    signupSetup();
    signInSetup();
})