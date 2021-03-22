#Homework 2

## Task 1

**A simple REST service with CRUD operations for User entity.**

To run the application use the following script:
```shell
npm run hw2
```
Then you can use the API with `http://localhost:3000/`

### Methods

#### Get user by id

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/:id` | GET | id - string | - | - |

```http request
GET http://localhost:3000/users/f17855aa7ac2
```
---
#### Get auto-suggest list from limit users

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/` | GET | - | limit - number <br> loginSubstring - string | - |

```http request
GET http://localhost:3000/users/?limit=2&loginSubstring=example
```
---
#### Create new user

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/` | POST | - | - | user - object with the following params:<br>login - string<br>password - string<br>age - number |

```http request
POST http://localhost:3000/users
Content-Type: application/json

{
  "user": {
	"login": "Kermit the Frog",
	"password": "ty345676y",
	"age": 15
  }
}
```
---
#### Update existing user

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/:id` | POST | id - string | - | user - object with the following params:<br>login - string<br>password - string<br>age - number |

```http request
PUT http://localhost:3000/users/f17855aa7ac2
Content-Type: application/json

{
  "user": {
    "login": "Zeleboba",
    "password": "12345test",
    "age": 52
  }
}
```
---
#### Remove existing user

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/:id` | DELETE | id - string | - | - |

```http request
DELETE http://localhost:3000/users/f17855aa7ac2
```