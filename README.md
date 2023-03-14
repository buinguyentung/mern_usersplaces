# MERN course - Users and Places
Credit to Maximilian Schwarzmüller

## Supported Routes

| Route         | Description   | Note  |
| ------------- |:------------- | :---- |
| / | List of users | public |
| /:uid/places | List of places for selected user | public |
| /authenticate | Signup + Login Forms | only unauthenticated |
| /places/new | New place form | only authenticated |
| /places/:pid | Update place form | only authenticated |


## Supported API endpoints
1. /api/v1.0/users

| API           | Method        | Description  |
| ------------- |:-------------:| :----------- |
| /users | GET | Retrieve list of all users |
| /users/signup | POST | Create new user + login |
| /users/login | POST | Log user in |

2. /api/v1.0/places

| API           | Method        | Description  |
| ------------- |:-------------:| :----------- |
| /places/user/:uid | GET | Retrieve list of all places for a given user id|
| /places | POST | Create a new place |
| /places/:pid | GET | Get a specific place by place id |
| /places/:pid | PATCH | Update a place by id |
| /places/:pid | DELETE | Delete a place by id |

