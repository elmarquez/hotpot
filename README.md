Hotpot -- Product Discussion and Cocreation
===========================================

Let's cook together! Hotpot is a private communication service to
support product discussion and co-creation. It provides private chat, 
change announcement, question/answer and notifications. Its
implementation is intended to ease integration with existing services,
or services under development.


## Dependencies

Requires the latest version of NodeJS and MongoDB. Install all build and
runtime dependencies:

    npm install

Copy the application secrets file to /etc/hotpot


## Building and Running the Application

Build a production release of the browser client application:

    npm run build
    
Build a development release of the client application:

    npm run build:dev    
    
Run the production application:

    npm run serve


## Testing

Execute unit and functional tests:

    npm run test

Test reports are written to ./target


## Integrating Hotpot into an Existing Application

Hotpot is a self-contained service that can be integrated into your 
existing application be inserting the following minimum HTML: 

    <div data-component="hotpot"
         data-props='{"base":"/hotpot","channel":"test","title":"Hotpot","user":"/api/user"}'></div>
    <link type="text/css" rel="stylesheet" href="/client/bundle.css">
    <script src="/client/bundle.js" type="text/javascript"></script>

This block has three distinct parts: a div with configuration options
where Hotpot will attach itself. A link to the Hotpot stylesheet, and 
a script tag to load the Hotpot client application. Configure the link
and script tags to point to the deployed location of your hotpot
application.

To reduce the integration effort required, we suggest that you configure
your web server to inject the required HTML into the page where you
want Hotpot to appear, rather than putting the HTML directly into your
application.

In nginx, you might achieve this by doing something like the following:

    location / {
        sub_filter '</body>'  '<div data-component="hotpot" data-props=\'{"base":"/hotpot","channel":"test","title":"Hotpot","user":"/api/user"}\'></div>
                               <link type="text/css" rel="stylesheet" href="/client/bundle.css">
                               <script src="/client/bundle.js" type="text/javascript"></script>
                               </body>';
        sub_filter_once on;
    }

In this example, we're replacing the closing </body> tag with the 
configuration block and then appending a new closing </body> tag.
