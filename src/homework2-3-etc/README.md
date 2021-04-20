#Homework 2

To run the application use the following scripts:
```shell
npm run hw2 init db
npm run hw2
```
Then you can use the API with `http://localhost:3000/`

- [Methods for User entity](#methods-for-user-entity)
    * [Get user by id](#get-user-by-id)
    * [Get auto-suggest list from limit users](#get-auto-suggest-list-from-limit-users)
    * [Create new user](#create-new-user)
    * [Update existing user](#update-existing-user)
    * [Remove existing user](#remove-existing-user)
- [Methods for Group entity](#methods-for-group-entity)
    * [Get group by id](#get-group-by-id)
    * [Get all groups](#get-all-groups)
    * [Create new group](#create-new-group)
    * [Update existing group](#update-existing-group)
    * [Remove existing group](#remove-existing-group)
    * [Add users to the group](#add-users-to-the-group)
    
## Methods for User entity

### Get user by id

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/:id` | GET | id - string | - | - |

```http request
GET http://localhost:3000/users/07342ed8-90c3-42c3-9c4f-818baa74670e
```
---
### Get auto-suggest list from limit users

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/` | GET | - | limit - number <br> loginSubstring - string | - |

```http request
GET http://localhost:3000/users/?limit=2&loginSubstring=example
```
---
### Create new user

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/` | POST | - | - | login - string<br>password - string<br>age - number |

```http request
POST http://localhost:3000/users
Content-Type: application/json

{
  "login": "Kermit the Frog",
  "password": "ty345676y",
  "age": 15
}
```
---
### Update existing user

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/:id` | POST | id - string | - | login - string<br>password - string<br>age - number |

```http request
PUT http://localhost:3000/users/07342ed8-90c3-42c3-9c4f-818baa74670e
Content-Type: application/json

{
  "login": "Zeleboba",
  "password": "12345test",
  "age": 52
}
```
---
### Remove existing user

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `users/:id` | DELETE | id - string | - | - |

```http request
DELETE http://localhost:3000/users/07342ed8-90c3-42c3-9c4f-818baa74670e
```

## Methods for Group entity

### Get group by id

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `groups/:id` | GET | id - string | - | - |

```http request
GET http://localhost:3000/groups/07342ed8-90c3-42c3-9c4f-818baa74670e
```
---
### Get all groups

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `grous/` | GET | - | - | - |

```http request
GET http://localhost:3000/groups
```
---
### Create new group

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `groups/` | POST | - | - | name - string<br>permissions - array of the following options: "READ" / "WRITE" / "DELETE" / "SHARE" / "UPLOAD_FILES" |

```http request
POST http://localhost:3000/groups
Content-Type: application/json

{
  "name": "Readers",
  "permissions": ["READ"]
}
```
---
### Update existing group

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `groups/:id` | POST | id - string | - | name - string<br>permissions - array of the following options: "READ" / "WRITE" / "DELETE" / "SHARE" / "UPLOAD_FILES" |

```http request
PUT http://localhost:3000/groups/07342ed8-90c3-42c3-9c4f-818baa74670e
Content-Type: application/json

{
  "name": "Sharers",
  "permissions": ["SHARE"]
}
```
---
### Remove existing group

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `groups/:id` | DELETE | id - string | - | - |

```http request
DELETE http://localhost:3000/users/07342ed8-90c3-42c3-9c4f-818baa74670e
```
---
### Add users to the group

| Route | HTTP method | Route params | Query params | Request body |
| --- | --- | --- | --- | --- |
| `groups/:id/users` | POST | id - string | - | userIds - array of the existing user's ids |

```http request
PUT http://localhost:3000/groups/07342ed8-90c3-42c3-9c4f-818baa74670e
Content-Type: application/json

{
  "userIds": ["07342ed8-90c3-42c3-9c4f-818baa74670m", "07342yj8-90c3-42c3-9c4f-818baa74670e"]
}
```