# Winter 2022 Interview Challenge Submission

## Table of Contents
1. [About my Submission](#About-my-Submission)
2. [Tools used in my project](#Tools-used-in-my-project)
3. [Technical Information](#Technical-Information)
	- [Usage](#Usage)
		-[Starting the Project](#Starting-the-Project)
		[Using the API](#Using-the-API)

## About my Submission
I completed the back-end challenge for the digital key card system through a RESTful API. My Project runs on Port 3000 (or the port set on the enviroment variable) by default. My Project also creates a database file in `./data/AccessTokens.db` as a sqlite3 database. 

## Tools used in my project
- Language: Typescript
- Runtime: [NodeJS](http://nodejs.org/en/) v14.17.0
- Dependencies: 
	- [Express](https://www.npmjs.com/package/express) v4.17.1
	- [sqlite3](https://www.npmjs.com/package/sqlite3) v4.2.0 
	- [tsc compiler for Typescript](https://www.npmjs.com/package/tsc) v2.0.3
- Dev Dependencies:
	- @<span>types/express
	- @<span>types/node
	- @<span>types/sqlite3
	- @<span>typescript-eslint/eslint-plugin
	- @<span>typescript-eslint/parser
	- [eslint](https://www.npmjs.com/package/eslint)
	- [nodemon](https://www.npmjs.com/package/nodemon)
	- [ts-node](https://www.npmjs.com/package/ts-node)

## Technical Information
- Port: 3000 (by default, can be changed through enviroment variables)
- Database Type: Sqlite 3
- Endpoints: 
	- `/api/create`
	- `/api/validate`

### Usage

#### Starting the Project
To run the project, download the repository and download [NodeJs](https://nodejs.org/en/). Follow the instructions below for your operating system.

##### Windows
Start the server for the first time by running `First-Time-Start.bat`. This is to ensure all the scripts compile and all required node modules are included. After the first time, you may use `Start.bat`.

##### Mac and Linux
Open the terminal and navigate to the project. To setup the project, run `npm init` then to compile the project and start the server, run `npm run start`. After you compile the project, you may use `npm run soft-start` to start the server without recompiling. 

#### Using the API
The API can be found under `/API`. There are 2 endpoints: `/create` and `/validate`. Both endpoints accept JSON. 

`/create` - Creates an Access Token with authorization to open the specified doors.

**Input**

Label | Type | Description
--- | --- | ---
doors | Integer Array | Array of Doors that the Access Token will be authorized to open.
expiry | integer | UNIX Timestamp of when the Access Token will expire.

**Returns**

Label | Type | Description
--- | --- | ---
AccessToken | String | 128 Hexadecimal character string of the Access Token.

`/validate` - Creates an Access Token with authorization to open the specified doors.

**Input**

Label | Type | Description
--- | --- | ---
doorid | Integer | The Door requesting to be opened.
accessToken | string | 128 Hexadecimal character string of the Access Token being used.

**Returns**

Label | Type | Description
--- | --- | ---
IsAuthorized | Boolean | True if the Access Token is authorized to access the specified door.
