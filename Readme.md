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
const { Fields , FakerServer, Model, ListTransformer} = require("api-faker");

const userModel = new Model({
    name: Fields.Name,
    email: Fields.Email,
    comment: new Fields.TextField(20)
})

const server = new FakerServer();
server.get("/user/:id/", userModel)

server.get("/users/", new ListTransformer(userModel, 20))

server.run()

// make a get request to http://localhost:8800/users
// will provide a list of 20 users

// make a get request to http://localhost:8800/user/3/
// will provide one user

```

## Components

### FakerServer

This is the instance of the API Faker Server which will handle all request routed to it.

It constructor accept two

> ```typsecript
> constructor(path="", expressInstance?)
> ```

1. `path:string`
    This specifies the path the faker server will be handling the default is ""
2. `expressApp:Express`
    This is an optional parameter that specify which express app the server is to run on, if non is created then the FakerServer will create a new Express Server internally to use

> Note: If the second parameter is not provided,  then to start the server you nedd to call the `run` method of the `FakerServer` instance. But if it is provided, then the server will start immediately after the expressApp `listen` method is called

#### Methods

1. `public run(port:number = 8800 )`
    This is used to start the FakerServer if no express App was provided to it constructor
2. `public static from(expressInstance:Express, path:string ="/api")`
    This is a static method that will return a new instance of the [`FakerServer`](#FakerServer) with the expressInstance as the expressApp and the path as the serverPath on the express app
3. `get(path:string, handler:RequestHandler)`
    This method is used to provide a [`RequestHandler`](#RequestHandlers) that will handle all GET HTTP request to `path`
4. `post(path:string, handler:RequestHandler)`
    This method is used to provide a [`RequestHandler`](#RequestHandlers) that will handle all POST HTTP request to `path`
5. `delete(path:string, handler:RequestHandler)`
    This method is used to provide a [`RequestHandler`](#RequestHandlers) that will handle all DELETE HTTP request to `path`

6. `put(path:string, handler:RequestHandler)`  
    This method is used to provide a [`RequestHandler`](#RequestHandlers) that will handle all PUT HTTP request to `path`

7. `patch(path:string, handler:RequestHandler)`  
    This method is used to provide a [`RequestHandler`](#RequestHandlers) that will handle all PUT HTTP request to `path`

8. `put(path:string, handler:RequestHandler)`  
    This method is used to provide a [`RequestHandler`](#RequestHandlers) that will handle all PUT HTTP request to `path`

9. `route(path:string, handler:Router|ViewSet)`  
    This method is used to provide a `Router` that will handle multiple request to points that are have the `path` prefix, or a `ViewSet` class that groups related points to together.
  
A **`RequestHandler`** can be a Model class instance, a [`Transformer`](#Transformers) an object, an array or, a Function with the signature `(request, response,params)=>void` where `request` and `response` are express request and response object,  while the params is an object containing all the extracted parameter from the `request` path

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

const server = new FakerServer()

// Using a Transformer as a RequestHandler
// Make a Get request to http://localhost:8800/users/
server.get("/users/", new ListTransformer(UserModel, 30))

// Using an object as a RequestHandler
// Make a Get request to http://localhost:8800/users/todays-greeting
server.get("/users/todays-greeting", {message:"Hello World"})

//Using a Model Instance as a RequestHandler
// Make a Get request to http://localhost:8800/users/1
server.get("/users/:id/", UserModel)

//Using a function as a requestHandler
// Make a Get request to http://localhost:8800/user/10/followers
server.post("/user/:id/followers", (request, response, param) => {
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

server.run()
```

### <a name="Model"> 🔶 Model </a>

A model allows you to define the structure and content the server will return.

**Example**

```typescript
const { Fields , Model, ListTransformer} = require("api-faker");

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

    It's constructor accept and object with `key` been the field name of the model and `value` been a [`Field`](#Fields)|`function(request:Request, params:{}):any`|`string`|`number`|`object` class instance which defines the type of value to be populated into the field.

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

### <a name="Fields">Fields </a>

Fields allows you to define the type of data faker server should generate in your model instances. All the fields provided by faker server are provided in the Fields object exported by the package `const {Fields} = require("api-faker")`

**List of available Fields**

1. **NameField**

    This will generate fake full name
2. **EmailField**

    This generate random email address
3. **PhoneNumberField**

    This generate random phone number, you can pass is the format of the phone number you require with # for places you want faker to insert random digits for example

     ```javascript
        const {Fields} = require("api-faker")
        const Phone = new Fields.PhoneNumberField("(+32) ### 22 ####")
        
        console.log(Phone.generate())
        // This will log to the terminal a random phone number like (+32) 234 22 7466
      ```

4. **TextField**

    This will generate random text content consisting of 50 words , which can be changed by providing the number of words in the constructor

    ```javascript
        const {Fields} = require("api-faker")
        const Text = new Fields.TextField(20)
        
        console.log(Text.generate())
        // This will log to the terminal a random text consisting of 20 words
      ```

5. **IDField**

    This generate a random yet unique UUID

6. <a name="GenderField">**GenderField**<a>

    This generate a random gender

7. **SexTypeField**

    Similar to [`GenderField`]( #GenderField )

8. **AvatarField**

    This generate a random url to an avatar (image) on the internet

9. **UsernameField**

    This generate a random username

10. **ImageField**

    This generate a random url to an image on the internet with default size of `width=480` and `height=640`. The width and height can be defined to the constructor

    ```javascript
    const {Fields} = require("api-faker")
    const Image = new Fields.ImageField(500, 200)
    
    console.log(Image.generate())
    // This will generate a url of an image with height = 500 and width = 200
    ```

11. **CountryField**

    This will generate a random country name

12. **CountryCodeField**

    This will generate a random country code

13. **StateField**

    This will generate a random state name

14. **LocationField**

    This will generate a random latitude and longtitude as a array of two length [lat, lng]

15. **FullAddressField**

    This generate a random address

16. **NearByField**

    This generate a random location that is at a specific distance to another location (relative).
    The constructor accepts an array [lat,lng] as the first parameter which represent the relative location , and a number as the second parameter which repesent the distance in km

    ```javascript
    const {Fields} = require("api-faker")
    
    // The first parameter is the relative location, while the second parameter is the specific disance
    const NearBy = new NearByField([12.34, 8.099], 40)
    ```

17. **Custom Fields**

    Custom Fields can be created by extending the Field class , and override the generate abstract method , which should return the type of data the custom field is expected to represent

  > Exmaple of a custom field class

  ```javascript
  const {Field, Fields, Model} = require("api-faker")

  // The custom field
  class LargeNumberField extends Field{
      
      limit = 600000
      public generate(){
          const factor = Math.random()
          return Math.floor(factor * this.limit )
  }

  const UserModel = new Model({
  username: new Fields.Username(),
  activity_count: new LargeNumberField()
  })
  ```

### <a name="Transformers">Transformers<a>

Transformers are classes that takes a  `FAModel` and transform it into another format

Each [`Transformer`](#Transformers) most be a decendant class of the `AbstractTransformer` class.

The transformer then has to override the abstract method `transform(request, params)=>any` which will be called any time data to be consumed is requested from the transformer class. check out. request is an Express request object, while params contains parameters extracted from the request path

#### Available Transformers

1. **ListTransformer**

    This transformer generate list of a specific [`Model`](#Model) provided to it constructor

    The constructor accept two parameter, the first parameter is a model instance or another transformer instance,  while the second parameter is an option parameter of type number, which represent the length of the list.
    > Constructor
    >
    > ```typescript
    > constructor(model:AbstractModel> |Transformer, count = 10 ) 
    > ```

    **Example**

    ```javascript
    const {Model, FakerServer, Fields, ListTransformer} = require("api-faker")
    
    const MessageModel = new Model({
      message:new Fields.TextField(30),
      read: ()=>{
        return Math.floor(Math.random()*10) %5 == 0
      }
    })
    
    const server = new FakerServer("/api")
    
    server.get("/messages/", new ListTransformer(MessageModel, 30))
    
    server.run(8000)
    // Try making a get request to http://localhost:8000/api/messages/
    // It will return a list of the message model data
    
    ```

### ViewSet

Viewset allows the use of classes to group request handlers together. This is ispired by django-rest-framewok.

**ViewSet can only be used with TypeScript as it uses decorators  which currently is not support natively in javascript at the moment.**

**Example**

> viewset.js

```javascript

const { ViewSet, FakerServer, Model, Fields } = require("api-faker")

const UserModel = new Model({
  name: new Fields.NameField(),
  address: new Fields.FullAddressField()
})

class UserViewset extends ViewSet {

  usersList:any[] = []

  public get(request, response) {
    response.send(this.usersList)
  }

  public retreive(request, response, id) {
    
    let user = this.usersList.find(e=> e.id == id)

    if (user) {
      response.send(user)
    } else {
      response.status(404)
      response.send({
        message: "User not found"
      })
    }
  }

  public create(request, response) {
    const newUser = UserModel.generate()
    this.usersList.push({ ...newUser, id: this.usersList.length })

    response.send(this.usersList[this.usersList.length - 1])
  }

  public delete(request, response, id) {
    const user = this.usersList.find((e:any) => e.id == id)
    if (!user) {
      response.status(404)
      response.send({
        message: "User could not be found"
      })
    } else {
      const index = this.usersList.indexOf(user)
    }
  }
}

const server = new FakerServer()
server.route("users-api", UserViewset)
server.run()

// FakerServer running on http://localhost:8800/
// Access to the viewset will be http://localhost:8800/users-api/
// Get http://localhost:8800/users-api/ will execute the viewset get method
// POST http://localhost:8800/users-api/ will execute the viewset create method
// GET http://localhost:8800/users-api/3/ will execute the viewset retreive method and set the id parameter as 3
// POST http://localhost:8800/users-api/7/ will execute the viewset update method and set the id parameter as 7 
// DETELE http://localhost:8800/users-api/20/ will execute the viewset delete method and set the id parameter as 20
```

**Methods supported in a viewset class**

1. `get(request:Request, response:Response)`

    If a Viewset class defines a `get` method, then all get request to the viewset path will be handled by the method, else the viewset will ignore the request and the server will check other RequestHandlers.

2. `create(request:Request, response:Response)`

    If a Viewset class defines a `create` method, then all POST request to the viewset path will be handled by the method, else the viewset will ignore the request and the server will check other RequestHandlers.

3. `delete(request:Request, response:Response)`

    If a Viewset class defines a `delete` method, then all DELETE request to the viewset path will be handled by the method, else the viewset will ignore the request and the server will check other RequestHandlers.

4. `retreive(request:Request, response:Response, id:number|string|undefined|null)`

    If a Viewset class defines a `retreive` method, then all GET request to the viewset path + id will be handled by the method, else the viewset will ignore the request and the server will check other RequestHandlers.

    > This means assuming the viewset path was `http://localhost:8800/users-api`; then any `GET` Request of the format `http://localhost:8800/users-api/:id` will be handled by the `retreive` method of the viewset and the `id` parameter of the method will be the `:id` of request path.

5. `update(request:Request, response:Response, id:number|string|undefined|null)`

    If a Viewset class defines a `retreive` method, then all POST request to the viewset path + id will be handled by the method, else the viewset will ignore the request and the server will check other RequestHandlers.

    > This means assuming the viewset path was `http://localhost:8800/users-api`; then any `GET` Request of the format `http://localhost:8800/users-api/:id` will be handled by the `update` method of the viewset and the `id` parameter of the method will be the `:id` of request path.

6. `delete(request:Request, response:Response, id:number|string|undefined|null)`

    If a Viewset class defines a `retreive` method, then all DELETE request to the viewset path + id will be handled by the method, else the viewset will ignore the request and the server will check other RequestHandlers.

    > This means assuming the viewset path was `http://localhost:8800/users-api`; then any `DELETE` Request of the format `http://localhost:8800/users-api/:id` will be handled by the `delete` method of the viewset and the `id` parameter of the method will be the `:id` of request path.

  Custom paths can be handled by a viewset apart from the ones listed above by using the **`@ViewSet.action`** decorator on any method of the viewset class.
  
  > **This can only be used in typescript project and the `expiramentalDecorator` set to true in your tsconfig.json compilerOptions**

**Using the @ViewSet.action decorator**

The action decorator has the signature `action(detail: boolean = false,methods: MethodType[] = ["GET"],pathName: string | undefined | null= null,description: string = "No Description")`

Where

1. `detail` : Specifies if an id is required or not.
If it is set to false the the path to the method willl be `viewset_path/`+`methodName`.For example if the method name is `follow` and the viewset_path is `http://localhost:8800/viewset_path` then any request to `http://localhost:8800/viewset_path/methodName` will be handled by the method or `http://localhost:8800/viewset_path/:id/methodName` if `detail` is set to true and will provide the id parameter from the url as the methods 3rd parameter.

2. `methods` : Any array of the HTTP request methods the handler should be executed on. If none is provided then only get request will be handled by the method.

3. `pathName`: this allows you to provide an alias for the handler, by default if the pathName is not provided then the name of the method is used as the path to the method.

4. `description`: This is used as the description of the handler , it is used to generate a documentation for the faker server api.

  ```typescript

  import {ViewSet, FakerServer, Model, Fields, ListTransformer} from "api-faker"
  import {Request, Response } from "express"

  const UserModel = new Model({
      name : new Fields.NameField(),
      phone : new Fields.PhoneNumberField("(+234) ### #### ### "),
      status : new Fields.TextField(20)
  })

  const users = (new ListTransformer(UserModel, 50)).transform()
  class UserViewSet extends ViewSet{

      get(request:Request, response:Response){
          response.send(users)
      }
      // he url for this method will be http://localhost:8800/users/:id/fiends
      @ViewSet.action(true)
      friends(request:Request, response:Response, id:number){
          response.send((new ListTransformer(UserModel, 10)).transform())
      }

      // The url for this method will be http://localhost:8800/users/login
      // This is due to the pathName provided as /login
      @ViewSet.action(false, ['POST'], "/login")
      auth(request:Request, response:Response){
          if (request.query['success']) {
              response.send(UserModel.generate())
          }else{
              response.status(404)
              response.send({
                  message:"User not found"
              })
          }
      }


  }

  const server = new FakerServer()
  server.route("users", UserViewSet)

  server.run()

  ```
