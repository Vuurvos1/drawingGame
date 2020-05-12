# a Multiplayer game

## Installing the project
First, make sure you have Node and NPM installed. Then,

`$ git clone https://github.com/vzhou842/example-.io-game.git`
`$ cd example-.io-game`
`$ npm install`
and you’re ready to go! To run the development server

`$ npm run develop`
and visit localhost:3000 in your web browser. The dev server will automatically rebuild the JS and CSS bundles when you edit code - just refresh to see your changes!

## File structure

### public/
Anything in the `public/` folder will be statically served by our server. `public/assets/` contains images used by our project.

### src/
All the source code is in the `src/` folder. `client/` and `server/` are pretty self explanatory, and `shared/` contains a constants file that’s imported by both the client and the server.

