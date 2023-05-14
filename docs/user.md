# User Management and Secure Authentication

## Get User Info
#### `GET` /users/user

A valid JWT is needed for this request which will return information for the User associated with the given JWT.

#### Response Example:

```json
{
    "user": {
        "recipes": [
            "64595c46c07b70843ab37ba1"
        ],
        "_id": "64540026778d794d6418d1b0",
        "username": "vithusha",
        "__v": 3
    }
}
```

## Registering a User
#### `POST` /users/signup

#### Request Example:

```json
{ "username": "vithusha","password": "securepassword" }
```

### #Response Example:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDU0MDAyNjc3OGQ3OTRkNjQxOGQxYjAiLCJpYXQiOjE2ODMyMjY2NjMsImV4cCI6MTY8MzIzMDI2M30.iqSxRnRmLHOmd62ZsVQigE7zJTK82iJVi8KsyU3-3Gg"
}
```
** Remember: The token returned should be included in all subsequent API requests.


## User Login
#### `POST` /users/login
#### Request Example:

```json
{ "username": "vithusha","password": "securepassword" }
```

#### Response Example:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDU0MDAyNjc3OGQ3OTRkNjQxOGQxYjAiLCJpYXQiOjE2ODMyMjY2NjMsImV4cCI6MTY8MzIzMDI2M30.iqSxRnRmLHOmd62ZsVQigE7zJTK82iJVi8KsyU3-3Gg"
}
```
** Remember: The token returned should be included in all subsequent API requests.

## Updating User Details
#### `PUT` /users/update
#### Request Example:
```json
{ "username": "vithusha", "password": "newsecurepassword" }
```
Both parameters are optional. The user information will be updated based on the parameters present in the request. A valid JWT must be sent with the request.

#### Response Example:
```json
{ "message": "Updated successfully!" }
```

## Delete a User
#### `DELETE` /users/delete
This deletes the current User.

#### Response Example:
```json
Copy code
{  "message": "User deleted." }
```
# Recipe Relations

## User's Recipes
#### `GET` /users/user

The User data returned by this endpoint also includes the user's related Recipes, thanks to the Mongoose population method applied in the User schema.

#### Response Example:

```json
{
    "user": {
        "recipes": [
            {
                "_id": "64595c46c07b70843ab37ba1",
                "name": "Chocolate Cake",
                "ingredients": [
                    {
                        "name": "chocolate",
                        "quantity": "200g"
                    },
                    {
                        "name": "flour",
                        "quantity": "100g"
                    },
                    {
                        "name": "sugar",
                        "quantity": "50g"
                    }
                ],
                "directions": "Mix all ingredients and bake for 30 minutes.",
                "__v": 0
            }
        ],
        "_id": "64540026778d794d6418d1b0",
        "username": "vithusha",
        "__v": 3
    }
}
```

** Note: Actual recipe fields will depend on your Recipe schema.

## Security
The authentication of these endpoints is handled by JWT (JSON Web Tokens). These tokens should be included in the `Authorization` header of the request as `Bearer <token>`.

The `MY_SECRET` environment variable is used to sign these tokens. It should be kept private and not exposed publicly.

The tokens are set to expire in 3 hours, as defined in the user routes file. After this time, users will need to log in again to receive a new token.

The `authenticate` middleware is used to protect routes that require authentication. It checks for a valid JWT in the `Authorization` header of the request and adds the decoded payload to `req.auth`.

## Environment Variables
`MY_SECRET` - This is used to sign JWTs. It should be a random string and kept secret.
`MONGODB_URI` - This is the connection string for your MongoDB database.
`PORT` - This is the port that your Express server will run on.


