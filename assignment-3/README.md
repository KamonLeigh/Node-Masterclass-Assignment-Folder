# Assignment 3

Aim of this assignment was to build the front-end on top of api 
build in assignment 2.

## Start App 
```
node index.js

```

## Frontend

Open browser on: ** http://localhost:3000/ **

You can sign-up on ** / ** and click on menu link to view pizza menu
CRUD is adhered to in terms of ordering pizza and creating user. Please not 
that only user with the right token can edit etc ...



## Backend
### /users

#### Register a User 

```
{
    "userName ":['string'],
    "firstName":['string'],
    "lastName ":['string'],
    "email":['string'],
    "phone":['string'],
    "password ":['string'],
    "address":['string'],
}
```

Sent payload to ** http(s):localhost:3000/users ** via **POST**

payload will return tokenId along with expiry date which is a hour



#### Obtain user information
NB. You need to send token in order to sign in

 ** http://localhost:3000/users?username={USERNAME}** via **GET**

Along with username in querystring sent { token: tokenId } in header

#### Make changes to user data

```
{
    "userName ":['string', optional],
    "firstName":['string', optional],
    "lastName ":['string', optional],
    "email":['string', optional],
    "phone":['string', optional],
    "password ":['string', optional],
    "address":['string', optional],
}
```

Sent { token: tokenId } in header

Sent payload to ** http(s):localhost:3000/users ** via **PUT**

#### Delete user 

 ** http://localhost:3000/users?username={USERNAME} ** via **DELETE**

Along with username in querystring sent { token: tokenId } in header


### /tokens

#### Extend life span of token for another hour 

 ** http://localhost:3000/tokens  **POST**


```
{
     "userName ":['string'],
     "password ":['string'],
}
```

#### Obtain the token 

 ** http://localhost:3000/tokens?id={tokenid} ** via **GETY**


#### Delete token

** http://localhost:3000/tokens?id={token} ** via **DETELE**



### /Menu

#### Get the menu 

** http://localhost:3000/menu ** via **GET**


### /shoppingcart

NB please ensure token is valid 

#### Make order

 ** http(s):localhost:3000/shoppingcart ** via **PUT**


```
{
    "margherita"[optional]:['number'],
    "pepperoni"[optional]:['number'],
    "meatball"[optional]:['number'],
    "aubergine"[optional]:['number'],
}
```

#### Review the order


 ** http(s):localhost:3000/shoppingcart?ordernumber={order number} ** via **GET**



#### delete the order

 ** http(s):localhost:3000/shoppingcart?ordernumber={order number} ** via **DELETE**

### /orders

#### place order

NB please ensure token is valid 

 ** http://localhost:3000/orders?ordername={order number}** via **GET**







  



 




















