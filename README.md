# HitchHike

A live version of the site can be viewed [here](https://vast-stream-35630.herokuapp.com/).

---

### Setup

1. `npm install`
2. `export MONGODB_URI='your mongodb server'`
3. `npm start`

---

### Testing

1. Start the server on port 8080
2. `npm test`

---

### Overview

The core focus of the application is the creation and registration of a "hike", a carpool between a designated origin and destination by a driver. 

The first step in this process is the login or creation of a user profile to track rides and "hikes" that the user is a part of. This is done through the login screen, that also allows immediate sign up if the user does not already have an account.

After validating your credentials, the next step is the main dashboard that displays current available hikes. This is the screen that will allow users to interact with rides, including seeing information of the ride, in addition to joining, and cancelling registered rides. Users that are drivers are also able to create a new hike using the easily accessible button. To assist in finding a ride, it is also possible for the user to search for a particular hike by price, destination, and origin.

Another core page is hostedHikes, that displays all hikes that you own (and only appears if you are a driver). This page allows the owner of the hike to manage and cancel the hike (removing all registered users for that particular ride). The owner can also see which users are currently registered in their hike.

In addition to being able to join, create, cancel, and remove hikes and rides, the user is also able to use the built in messenger in hitchHike. The global chat is simple to use and allows any connected user to find other user and driver within the chat to set up a new hike.

Moving past myHikes and messenger is myAccount. In myAccount, users are able to both change and update their profile information, or permanently delete their user account if they desire to. Users are also able to become a driver by filling the driver form, or resign as a driver if they do not want to be a driver anymore.

Finally, administrators have exclusive access to a control panel that allows them to add, list and/or update, and delete users. Admins are also able to reset the database, and initialize the database with samples.

---

### If applicable, a description of any aspects of your application that were not fully implemented or do not quite work as designed.

We were not able to implement ratings, private and public carpools, or a waitlist due to time constraints. 

Rating Description: A rating system for that allows the hikers of completed rides to rate a driver.
Rating Implementation: A simple rating list that will keep track of people who already voted as well as their scores.

Private/Public Description: A private or public carpool option that makes it only available to some users.
Private/Public Implementation: A simple whitelist or blacklist for the private carpool to restrict which users can join the hike.

Waitlist Description: A waitlist for a carpool that will register the next users if a registered user cancels.
Waitlist Implementation: A simple waitlist queue that will append users to the end if the hike's spaces are full. On a user cancel, the backend database would check if there is someone in the waitlist, and simply reigster that person. If no waitlist, then open up the space.

---

### A description of any enhancements or additional features you have made to your application.

- Test cases for ALL routes (test.js)
- Persistent session storage for current user
- Secure sessions
- Redirect away from login screen if logged in
- Timestamped messaging sytem (Social Media) to contact other users 
- Becoming a driver, a further separation from just users and admins
- Sorting hikes by price, origin, destination
- Validation on all forms to prevent security exploits
- Resized cards when you display more information
- Dark overlays on creating a new hike and toggle buttons on control panel
- Scroll only applies to the hikes
- Buttons update without refresh when clicked	
