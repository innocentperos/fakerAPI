# API-Faker

A lightweight fully OOP fake api content generator and provider server, written in [Typescript](http://typescript.com), build on top of [ExpressJs](www.expressjs.com) and [FakerJs](www.faker.api)

## ✨ Features

1. 📖 Random yet realistic content creation

    API Faker, can generate fake yet realistic content on the go using faker js

2. 🔃 Support static and dynamic route handling

    API Faker can understand and parse request path that contains parameters

3. ✨Neat logging

    API Faker provides a good looking logging feature that allows you to see which points your frontend application is calling

4. 🔶 Uses Model

    Models allow you to define how the data the server will provide should look like

5. 🔶🔹Nestable Model
    
    Allows deep nesting of models within models to create more complex structure

6. 🏗 Highly customizable

## 📦 Install

`npm install --save-dev api-faker`

## Example

```javascript
const { Fields , FakerServer, Model, ListTransformer} = require("api-faker-demo");

const userModel = new Model({
    name: Fields.Name,
    email: Fields.Email
})

const server = new FakerServer();
server.get("/user/:id/", userModel)
server.get("/users/", new ListTransformer(userModel, 20))

server.run()


```

## Components

### FakerServer

This is the instance of the API Faker Server which will handle all request routed to it.

It constructor accept two

> ```typsecript
>
> constructor(path="/api", expressInstance?)
> ```

1. `path:string`
    This specifies the path the faker server will be handling the default is "/api"
2. `expressApp:Express`
    This is an optional parameter that specify which express app the server is to run on, if non is created then the FakerServer will create a new Express Server internally to use

> Note: If the second parameter is not provided,  then to start the server you nedd to call the `run` method of the `FakerServer` instance. But if it is provided, then the server will start immediately after the expressApp `listen` method is called

#### Methods

1. `public run(port:number = 8800 )`
    This is used to start the FakerServer if no express App was provided to it constructor
2. `public static from(expressInstance:Express, path:string ="/api")`
    This is a static method that will return a new instance of the `FakerServer` with the expressInstance as the expressApp and the path as the serverPath on the express app
3. `get(path:string, handler:RequestHandler)`
    This method is used to provide a `RequestHandler` that will handle all GET HTTP request to `path`
4. `post(path:string, handler:RequestHandler)`
    This method is used to provide a `RequestHandler` that will handle all POST HTTP request to `path`
5. `delete(path:string, handler:RequestHandler)`
    This method is used to provide a `RequestHandler` that will handle all DELETE HTTP request to `path`

6. `put(path:string, handler:RequestHandler)`  
    This method is used to provide a `RequestHandler` that will handle all PUT HTTP request to `path`

7. `patch(path:string, handler:RequestHandler)`  
    This method is used to provide a `RequestHandler` that will handle all PUT HTTP request to `path`

8. `put(path:string, handler:RequestHandler)`  
    This method is used to provide a `RequestHandler` that will handle all PUT HTTP request to `path`

9. `route(path:string, handler:Router)`  
    This method is used to provider a `Router` that will handle multiple request to points that are have the `path` prefix
  
A **`RequestHandler`** can be a Model class instance, a `Transformer` or a Function with the signature `(request, response,params)=>void` where `request` and `response` are an express request and response object,  while the params is an object containing all the extracted parameter from the `request` path

**Examples of RequestHandlers**
```javascript
const { FakerServer, Model, Fields, ListTransformer } = require("api-faker")

const UserModel = new Model({
  username: new Fields.UsernameField(),
  name: new Fields.NameField(),
  followers: function(request, params) {
    const followFactor = Math.random()

    return Math.floor(followFactor * 100)
  }
})

const server = new FakerServer("/api")

// Using a Transformer as a RequestHandler
server.get("/users/", new ListTransformer(UserModel, 30))

//Using a Model Instance as a RequestHandler
server.get("/users/:id/", UserModel)

//Using a function as a requestHandler
server.get("/user/:id/followers", (request, response, param) => {
  let followers = []
  let user = UserModel.generate()
  for (let index = 0; index < 20; index++) {
    followers.push(UserModel.generate())
  }

  response.send({
    user,
    followers
  })
})

server.run(5000)
```

### 🔶 Model

A model allows you to define the structure and content the server will return.

**Example**

```typescript
const { Fields , FakerServer, Model, ListTransformer} = require("api-faker-demo");

// A Single Model
const userModel = new Model({
    name: new Fields.NameField(),
    email: new Fields.EmailFiel()
})

// Nested Model
const CommentModel = new Model({
  user : userModel,
  comment: new Fields.textField(35)
})
```

 API Faker two classes for creating models.

 1. `AbstractModel` class
    
    This is the main abstract class that any custom model extends.This class has only one abstract method `generate(request, params)` which gets call when generating the random content.

 2. `Model` class
    
    This is the generic class that API Faker provides for quickly defining your model structure and generating random content from the model

    It's constructor accept and object with `key` been the field name of the model and `value` been a `Field`|`function(request:Request, params:{}):any`|`string`|`number`|`object` class instance which defines the type of value to be populated into the field.
    
    If the value is not a function or `Field` then the value of the field will be treated as static (Returns the data as it is, do not generate data for this field)
    
    If the `field` value is a `function` then the function get called to evaluate the value of model field during data generating.
    
    **Example**
    Model with static fields
    
    ```typescript
    const {Fields, Model} = require("api-faker")
    
    Const PostComment = new Model({
      username:new Fields.UsernameField(),
      date: new Date("2021-05-07"),
      reaction : function(request, param){
        return Math.floor(Math.random()*100)
      }
    })
    ```
    > Note that the date field of the model is a static value of the date 2021-05-07 , which means everytime an instance of the model is created the date will always be 2021-05-07
    > While the reaction field is a dynamic field since it value will be determined by the function it was asign to it. The `request` parameter is an express Request object, while the params will contains the parameters extracted from the `request` path.
    
