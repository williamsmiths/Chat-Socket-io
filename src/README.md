# Chatapp
simple chat app with node, mongodb, socketio, react 

To run:

Requires mongoDB to be running at its default location locally at mongodb://localhost:27017/HomelikeChatApp'
Or you could change the connection line in app.js to a different address.


`git clone https://github.com/rob-johnston/Chatapp.git`

`cd Chatapp`

`npm install`

`npm run`


After that navigate to http://localhost:3000/#/login
default login is   username: admin  password: admin
or register a new username and password on the register

Best use is to open a separate incognito tab and sign in with a different username, otherwise weird behaviour may occur.

## Features

- Can Sign In and Register new users

- Can write messages in channels (chat rooms).

- Navigate Channels by clicking on them

- Add new channels by typing in the name and hitting ‘Add’ in the channel list

- You can delete your own messages by clicking the minus sign near the timestamp

- If you point two different users at eachother you can write private messages. These messages aren’t stored like channel messages and will dissapear if you navigate away and back.

- view is updated on any major events like users signing in/out, new channels being created.