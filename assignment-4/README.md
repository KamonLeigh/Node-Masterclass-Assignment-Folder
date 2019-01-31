# Assignment 4

Aim of this assignment was to build the cli for the pizza app
## Start App 
```
node index.js

```

## CLI

The CLI allows the following:

1. View the list of commands by entering the command -'man' or -'help'.

2. To view the current menu (pizzas) items, enter the command -'menu'.

3. Inorder to list all the customers use the command -'list users'.

4. To lookup specific user use the following command - 'more info user --{email}'.

5. View all the orders made in the last 24 hours, use the command -'orders'.

6. To loopup specific order use the following command - 'more info order --{ordernumber}.

7. To view all the users whoo signed up in the last 24 hours use the command -'sign up'.

8. To kill the cli use the following command - 'exit'.

9. To view infomation about the server use the commane - 'stats'.

    

## Frontend

Open browser on: **http://localhost:3000/**

You can sign-up on **/** and click on menu link to view pizza menu
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

Sent payload to **http(s):localhost:3000/users** via **POST**

payload will return tokenId along with expiry date which is a hour



#### Obtain user information
NB. You need to send token in order to sign in

 **http://localhost:3000/users?username={USERNAME}** via **GET**

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

Sent payload to **http(s):localhost:3000/users** via **PUT**

#### Delete user 

 **http://localhost:3000/users?username={USERNAME}** via **DELETE**

Along with username in querystring sent { token: tokenId } in header


### /tokens

#### Extend life span of token for another hour 

 **http://localhost:3000/tokens  **POST**


```
{
     "userName ":['string'],
     "password ":['string'],
}
```

#### Obtain the token 

 **http://localhost:3000/tokens?id={tokenid}** via **GETY**


#### Delete token

**http://localhost:3000/tokens?id={token}** via **DETELE**



### /Menu

#### Get the menu 

**http://localhost:3000/menu** via **GET**


### /shoppingcart

NB please ensure token is valid 

#### Make order

 **http(s):localhost:3000/shoppingcart** via **PUT**


```
{
    "margherita"[optional]:['number'],
    "pepperoni"[optional]:['number'],
    "meatball"[optional]:['number'],
    "aubergine"[optional]:['number'],
}
```

#### Review the order


 **http(s):localhost:3000/shoppingcart?ordernumber={order number}** via **GET**



#### delete the order

 **http(s):localhost:3000/shoppingcart?ordernumber={order number}** via **DELETE**

### /orders

#### place order

NB please ensure token is valid 

 **http://localhost:3000/orders?ordername={ordernumber}** via **GET**







  



 




















