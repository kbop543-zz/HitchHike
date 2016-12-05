/* Set up get all users */
function getAllUserSetup() {

    $('#listUser').click(function() {

        /* Display all users */
        $(".user-card-list").slideToggle();

        $('body').on('submit', ".edit-user", function(event) {
            event.preventDefault();
            
            var form = $(this);
            var username = $(this).attr('id').split('-')[1];

            // Get the data from form
            let formData = $('#editUser-' + username).serialize();

            formData.username = username;

            // Send post AJAX to update user
            $.post('/admin/editUser', formData, function(data) {
                alert('Account Updated');
                location.reload();
            })

            .fail(function(response) {
                alert(response.responseText);
            });

            return false;
        });
    });
}


/* Set up the add user form */
function addUserSetup() {

    // Set on-click to slide open the add user form and hide all other forms
    $('#addUser').click(function() {
        $('#addUserForm').slideToggle('slow');
        $('#findUserForUpdate').slideUp('slow');
        $('#updateUserForm').slideUp('slow');
        $('#deleteUserForm').slideUp('slow');
    });

    // Set the add user button on-click to send an AJAX post that creates a new user
    $('#addUserForm').submit(function(event) {

        event.preventDefault();

        // Get the data from form
        let formData = $('#addUserForm').serialize();

        // Send post AJAX to add one user
        $.post('/admin/addOneUser', formData, function(data) {
            alert('Account Added');

            // Reset form fields and hide form
            $('#addUserForm').each(function() {
                this.reset();
                $('#addUserForm').slideUp('slow');
                location.reload();
            });
        })

        .fail(function(response) {
            alert(response.responseText);
        });

        return false;
    });
};


/* Set up the delete user form */
function deleteUserSetup() {

    // Set on-click to slide open the delete user form and hide others
    $('#deleteUser').click(function() {
        $('#deleteUserForm').slideToggle('slow');
        $('#addUserForm').slideUp('slow');
        $('#findUserForUpdate').slideUp('slow');
        $('#updateUserForm').slideUp('slow');
    });

    /* Set the delete user button on click to send an AJAX delete */
    $('#deleteUserForm').submit(function(event) {

        event.preventDefault();

        // Send an AJAX delete for the user in the form
        $.ajax({
            type: 'DELETE',
            url: '/admin/deleteUser/?username=' + $('#deleteUsername').val(),
            success: function(data) {

                // Hide and reset form
                alert("Deleted");
                $('#deleteUserForm').slideUp('slow');
                $('#deleteUserForm').each(function() {
                    this.reset();
                    $('#addUserForm').slideUp('slow');
                    location.reload();
                });
            },
            error: function(response) {
                alert(response.responseText);
            }
        });

        return false;
    });
};


/* Set up initialize database button */
function initDatabaseSetup() {
    $('#initDatabase').click(function() {

        // Clear the database
        if (confirm("Are you sure you want to reinitialize?") == true) {

            // Delete all users AJAX
            $.ajax({
                type: 'DELETE',
                url: '/admin/resetUsers/',
                success: function(data) {
                    alert(data);
                },
                error: function(response) {
                    alert(response.responseText);
                }
            });

            // Delete all hikes AJAX
            $.ajax({
                type: 'DELETE',
                url: '/admin/resetHikes/',
                success: function(data) {
                    alert(data);
                },
                error: function(response) {
                    alert(response.responseText);
                }
            });

            $.post('/admin/setDatabase', function(data) {
                alert('Database Initialized');
            })
        };
    })
}


/* Set up the reset database button */
function resetDatabaseSetup() {

    // Set on-click to open prompt 
    $('#resetDatabase').click(function() {

        // Confirm Delete
        if (confirm("Are you sure you want to reset?") == true) {

            // Delete all users AJAX
            $.ajax({
                type: 'DELETE',
                url: '/admin/resetUsers/',
                success: function(data) {
                    alert(data);
                },
                error: function(response) {
                    alert(response.responseText);
                }
            });

            // Delete all hikes AJAX
            $.ajax({
                type: 'DELETE',
                url: '/admin/resetHikes/',
                success: function(data) {
                    alert(data);
                },
                error: function(response) {
                    alert(response.responseText);
                }
            });
        };
    });
}


/* Set up the page */
$(document).ready(function() {

    $(".user-card-list").hide();

    getAllUserSetup();
    addUserSetup();
    deleteUserSetup();
    initDatabaseSetup();
    resetDatabaseSetup();
})
