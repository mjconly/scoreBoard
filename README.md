# Live Score Board

## Overview
Simple web application that allows a user to create an account and select
teams to follow from the NBA, NFL, NHL, MLB. Once a team is added to
the users account, they can navigate to thier dashboard for live score
updates during game time.

## View
To view the application click ![here](https://live-score-board.herokuapp.com/)

## Requirements
1. Node
2. Mongodb

## Installation
1. Download project folder
2. From the terminal navigate to <code> scoreBoard/ </code>
3. Install dependencies with <code> $ npm install </code>
4. **Note in the app.js file the enviornment variables PORT and
DB_URI must be assigned. To do this create a config folder in 
the root directiory of the project. Add a .env file to the config
directory, and create PORT and DB_URI variables. 
<code> PORT=<port number> <code>
<code> DB_URI=<your mongodb Atlas uri with password><code>
      
## Run
1. From the terminal navigate to <code> scoreBoard/ </code>
2. Run application with <code> $ node app.js </code>
3. Application should be running
4. Open browser and navigate to <code> localhost:<port#>/ </code>


