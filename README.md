# Node-Express-Mongo Login System

Login system created using Node, Express, Mongo. Uses JWT for token management and bcrypt for password hashing.

## Installation

```bash
npm install
npm run dev
```

## Environment Variable
```bash
APP_KEY=
APP_PORT=3000
MONGO_URI=
BCRYPT_SALT=15
```

## API Reference

### POST: /register
#### Registers a user

```javascript

"Accept": "application/json",
"Content-Type": "application/json"

{
    "fullname": "aditya limaye",
    "mobile": "9999999999",
    "email": "aditya@limaye.com",
    "password": "Password1@"
}

//Response
{
    "message": "User created successfully",
    "user": {
        "profile_picture": null,
        "_id": "9ca44c6c-f90a-4ca5-95e4-96eccdd3c258",
        "fullname": "aditya limaye",
        "mobile": "9999999999",
        "email": "aditya@limaye.com",
        "password": "$2a$15$pgrja5CO1MtRowk1vkrfVeyPodtTKxAzBJQ5Ho0yl9JdWxjszEPyC",
        "__v": 0
    }
}
```

### POST: /login
#### Login a user and generate JWT token

```javascript

"Accept": "application/json",
"Content-Type": "application/json"

{
    "email": "aditya@limaye.com",
    "password": "Password1@"
}

//Response
{
    "email": "aditya@limaye.com",
    "token": "System generated jwt token"
}
```

### PUT: /changepassword
#### Update password of logged in user, using JWT token

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

{
    "old_password": "ABc1234$1",
    "new_password": "ABc1234$"
}

//Response
{
    "message": "Password updated for user: aditya@aditya.com"
}
```


### PUT: /updateprofile
#### Update profile details of logged in user, using JWT token

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

{
    "email": "aditya1@limaye.com", //optional
    "fullname": "aditya limaye1", //optional
    "mobile": "8888888888" //optional
}

//Response
{
    "message": "User updated successfully"
}
```

### PUT: /updateprofilepicture
#### Update profile photo of logged in user, using JWT token


```javascript

"mimeType": "multipart/form-data"
"x-access-token": "JWT Token here"

{
    "key": "profile-picture"    
}

//Response
{
    "message": "Profile picture updated successfully."
}
```

### GET: /self
#### Get details of logged in user

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

//Response
{
    "id": "25370253-18ac-409e-b8ea-2fdff0ec1e1c",
    "fullname": "aditya limaye1",
    "email": "aditya1@aditya.com",
    "mobile": "8888888888"
}
```


### GET: /users
#### Get details of all the users

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

//Response
{
    "users": [
        {
            "fullname": "aditya limaye1",
            "mobile": "8888888888",
            "email": "aditya1@limaye.com"
        },
        {
            "fullname": "aditya limaye",
            "mobile": "9999999999",
            "email": "aditya@limaye.com"
        }
    ]
}
```
### POST: /advertisement
#### Add an advertisement

```javascript

"Accept": "application/json",
"Content-Type": "application/json"

{
    "property_details": {
        "property_type" : "bungalow",
        "description" : "sea-facing",
        "n_bhk" : 15

    },
    "address" : {
        "city" : "Panchgani",
        "area_details" : "Amazing"
    },
    "quoted_price" : 45855558998552,
    "is_approved" : true,
    "intrestes" : 200
}

//Response
{
    "message": "advertisement created successfully",
    "id": "eafd91a8-8bf7-41c9-8997-a130686f2d5b"
}
```
### PUT: /updateadvertisement
#### Update a posted advertisement of logged in user, using JWT token

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

{
    "_id": "eafd91a8-8bf7-41c9-8997-a130686f2d5b",
    "property_details": {
        "property_type" : "flat",
        "description" : "hill-facing",
        "n_bhk" : 15

    },
    "address" : {
        "city" : "Matheran",
        "area_details" : "Very nice"
    },
    "quoted_price" : 8595956465161321,
    "is_approved" : false,
    "intrestes" : 899
}

//Response
{
    "message": "advertisement eafd91a8-8bf7-41c9-8997-a130686f2d5b updated successfully"
}
```
### DELETE: /advertisement
#### Delete a posted advertisement of logged in user, using JWT token

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

{
    "_id":"eafd91a8-8bf7-41c9-8997-a130686f2d5b"
}

//Response
{
    "message": "advertisement deleted successfully"
}
```

### GET: /advertisements
#### Get advertisements of all the users

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

//Response
{
    "advertisements": [
        {
            "property_details": {
                "property_type": "flat",
                "description": "sky-facing",
                "n_bhk": 15
            },
            "address": {
                "city": "Matheran",
                "area_details": "Very superrr"
            },
            "images": [],
            "_id": "eafd91a8-8bf7-41c9-8997-a130686f2d5b",
            "quoted_price": 8595956465161321,
            "is_approved": false,
            "author": "john@ahmed.com",
            "createdAt": "2021-09-02T13:20:49.669Z",
            "updatedAt": "2021-09-02T13:26:34.217Z",
            "__v": 0
        }
    ]
}

```
### GET: /myadvertisements
#### Get advertisements of the logged in user

```javascript

"Accept": "application/json",
"Content-Type": "application/json"
"x-access-token": "JWT Token here"

//Response
{
    "advertisements": [
        {
            "property_details": {
                "property_type": "flat",
                "description": "sky-facing",
                "n_bhk": 15
            },
            "address": {
                "city": "Matheran",
                "area_details": "Very superrr"
            },
            "images": [],
            "_id": "eafd91a8-8bf7-41c9-8997-a130686f2d5b",
            "quoted_price": 8595956465161321,
            "is_approved": false,
            "author": "john@ahmed.com",
            "createdAt": "2021-09-02T13:20:49.669Z",
            "updatedAt": "2021-09-02T13:26:34.217Z",
            "__v": 0
        }
    ]
}

```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)