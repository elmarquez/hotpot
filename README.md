NABEMONO -- Product Discussion and Cocreation
=============================================

Nabemono is a private communication service to support product
development. It provides a basic product chat and change log. Other
features can be plugged into the service.


## Dependencies

Requires the latest version of NodeJS and MongoDB. Install all build and
runtime dependencies:

    npm install

Copy the application secrets file to /etc/nabemono


## Building and Running the Application

Build the browser client application:

    npm run build
    
Run the production application:

    npm run serve


## Development

Run a local test server:

    npm run dev


## Testing

Execute unit and functional tests:

    npm run test

Test reports are written to ./target


## Using Nabe in an Existing Application

In the application HTML, load the application client:

    <script src="/nabemono/client.js"></script>

In the application user interface, add a div with ID='nabemono'

    <div id='nabemono'></div>
