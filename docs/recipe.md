# Recipe Endpoints

## Recipe Model

The Recipe model contains the following fields:

- `name`: (String) The name of the recipe. Required.
- `ingredients`: (Array of Ingredient objects) The ingredients used in the recipe.
- `directions`: (String) The cooking instructions for the recipe. Required.
- `user`: (ObjectId) The ID of the User who created the recipe. Required.

An Ingredient object has the following structure:

- `name`: (String) The name of the ingredient. Required.
- `quantity`: (String) The quantity of the ingredient used. Required.

## Endpoints

### List all recipes of a user
#### `GET` /recipes

Returns a list of recipes created by the authenticated user.

#### Response Example:

```json
{
    "message": "Recipes retrieved successfully",
    "data": [
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
                    "quantity": "1 cup"
                },
                {
                    "name": "sugar",
                    "quantity": "1 cup"
                }
            ],
            "directions": "Mix ingredients and bake for 30 minutes.",
            "user": "64540026778d794d6418d1b0",
            "__v": 0
        }
    ]
}
```

### Get a specific recipe
#### `GET` /recipes/:recipeId
Returns the recipe with the specified ID.

#### Response Example:
```json
{
    "message": "Recipe retrieved successfully",
    "data": {
        "_id": "64595c46c07b70843ab37ba1",
        "name": "Chocolate Cake",
        "ingredients": [
            {
                "name": "chocolate",
                "quantity": "200g"
            },
            {
                "name": "flour",
                "quantity": "1 cup"
            },
            {
                "name": "sugar",
                "quantity": "1 cup"
            }
        ],
        "directions": "Mix ingredients and bake for 30 minutes.",
        "user": "64540026778d794d6418d1b0",
        "__v": 0
    }
}
```

### Create a new recipe
#### `POST` /recipes
Creates a new recipe.

#### Request Example:
```json
{
    "name": "Chocolate Cake",
    "ingredients": [
        {
            "name": "chocolate",
            "quantity": "200g"
        },
        {
            "name": "flour",
            "quantity": "1 cup"
        },
        {
            "name": "sugar",
            "quantity": "1 cup"
        }
    ],
    "directions": "Mix ingredients and bake for 30 minutes."
}
```

#### Response Example:
```json
{
    "message": "Recipe created successfully",
    "data": {
        "_id": "64595c46c07b70843ab37ba1",
        "name": "Chocolate Cake",
        "ingredients": [
            {
                "name": "chocolate",
                "quantity": "200g"
            },
            {
                "name": "flour",
                "quantity": "1 cup"
            },
            {
                "name": "sugar",
                "quantity": "1 cup"
            }
        ],
        "directions": "Mix ingredients and bake for 30 minutes.",
        "user": "64540026778d794d6418d1b0",
        "__v": 0
    }
}
```

### Update a recipe
#### `PUT` /recipes/:recipeId
Updates the recipe with the specified ID.

#### Request Example:
```json
{
    "name": "Chocolate Cake",
    "ingredients": [
        {
            "name": "chocolate",
            "quantity": "250g"
        },
        {
            "name": "flour",
            "quantity": "1.5 cup"
        },
        {
            "name": "sugar",
            "quantity": "0.75 cup"
        }
    ],
    "directions": "Mix ingredients and bake for 35 minutes."
}
```

#### Response Example:
```json
{
    "message": "Recipe updated successfully",
    "data": {
        "_id": "64595c46c07b70843ab37ba1",
        "name": "Chocolate Cake",
        "ingredients": [
            {
                "name": "chocolate",
                "quantity": "250g"
            },
            {
                "name": "flour",
                "quantity": "1.5 cup"
            },
            {
                "name": "sugar",
                "quantity": "0.75 cup"
            }
        ],
        "directions": "Mix ingredients and bake for 35 minutes.",
        "user": "64540026778d794d6418d1b0",
        "__v": 0
    }
}
```

### Delete a recipe
#### `DELETE` /recipes/:recipeId
Deletes the recipe with the specified ID.

#### Response Example:
```json
{
    "message": "Recipe deleted successfully",
    "data": {
        "_id": "64595c46c07b70843ab37ba1"
    }
}
```

### Error Handling
In case of an error, the API will return a status code of 500 and a JSON object with a message attribute describing the error.

#### Example:

```json
{
    "message": "An error has occurred"
}
```
In case of unauthorized access (e.g., trying to access a resource owned by another user), the API will return a status code of 403 and a JSON object with a message attribute indicating that access is denied.

#### Example:

```json
{
    "message": "Access denied"
}
```

## Notes

- All requests that require authentication must include a valid JWT token in the `Authorization` header. The token must be preceded by the word `Bearer`, for example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDU0MDAyNjc3OGQ3OTRkNjQxOGQxYjAiLCJpYXQiOjE2ODMyMjY2NjMsImV4cCI6MTY4MzIzMDI2M30.iqSxRnRmLHOmd62ZsVQigE7zJTK82iJVi8KsyU3-3Gg`.

- All request and response bodies are in JSON format.

- The Recipe API validates all inputs. If you try to create or update a recipe with invalid data, you'll get a 400 Bad Request error with a message indicating what went wrong.

- When you create a new recipe, the server will automatically assign it a unique ID. You can't choose this ID yourself, and you can't change it later.

- When you update a recipe, you don't have to provide all the fields. You can provide just the fields you want to change.

- When you delete a recipe, it's gone forever, so be careful!

## Status Codes

The Recipe API returns the following status codes:

- `200`: The request was successful.
- `201`: The resource was successfully created.
- `400`: There was a problem with the request (e.g., the request body is malformed).
- `401`: The request has not been applied because it lacks valid authentication credentials for the target resource.
- `403`: The server understood the request but refuses to authorize it.
- `404`: The server couldn't find the requested resource.
- `500`: There was a problem with the server.
