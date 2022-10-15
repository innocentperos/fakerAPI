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
6. 🏗 High customization

## 📦 Install

`npm install --save-dev @faker-js/faker `

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

1. `path:string`

This specifies the path the faker server will be handling the default is "/api"
2. `expressApp:Express` 

This is an optional parameter that specify which express app the server is to run on, if non is created then the FakerServer will create a new Express Server internally to use

Note: If the second parameter is not provided,  then to start the server you nedd to call the `run` method of the `FakerServer` instance. But if it is provided, then the server will start immediately after the expressApp `listen` method is called

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

### 🔶 Model

A model allows you to define the structure and content the server will return.

#### Example

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
 
This is the genreic class that API Faker provides for quickly defining your model structure and generating random content from the model
 It`s constructor accept and object with `key` been the field name of the model and `value` been a `Field` class instance which defines the type of value to be populated into the field.
