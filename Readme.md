# FakerAPI

A lightweight fully OOP fake api content provider server, written in [Typescript](http://typescript.com) and  build on top of [ExpressJs](www.expressjs.com) and [FakerJs](www.faker.api)

## Features 
1. Generate fake yet realistic content 
2. Support static and dynamic route handling 
3. Neat logging 
4. Uses Model to define api data schema
5. Nestable Model
6. High customization

## Example 
```javascript 
import {Fields, FAModel , FakerServer, FAListTransformer} from "faker-api"

const UserModel = new FAModel({
  name: new Fields.NameField(),
  email: new Fields.EmailField()
})

const server = new FakerServer("/api")

server.get("/user/", new FAListTransformer(UserModel))

server.get("/user/:id/", UserModel)

server.run()

```

# API Reference 
## FakerServer 
This is the instance of the FakerAPI Server which will handle all request routed to it.

It constructor accept two 
1. `path:string` This specifies the path the faker server will be handling the default is "/api" 
2. `expressApp:Express` This is an optional parameter that specify which express app the server is to run on, if non is created then the FakerServer will create a new Express Server internally to use

Note: If the second parameter is not provided,  then to start the server you nedd to call the `run` method of the `FakerServer` instance. But if it is provided, then the server will start immediately after the expressApp `listen` method is called

### Methods 
1. `public run(port:number = 8800 )` : This is used to start the FakerServer if no express App was provided to it constructor 
2. `public static from(expressInstance:Express, path:string ="/api")` : This is a static method that will return a new instance of the `FakerServer` with the expressInstance as the expressApp and the path as the serverPath on the express app
3. `get(path:string, handler:RequestHandler)` : This method is used to provider a `RequestHandler` that will handle all GET HTTP request to `path`
4. `post(path:string, handler:RequestHandler)` : This method is used to provider a `RequestHandler` that will handle all POST HTTP request to `path`
5. `delete(path:string, handler:RequestHandler)` : This method is used to provider a `RequestHandler` that will handle all DELETE HTTP request to `path`
6. `put(path:string, handler:RequestHandler)` : This method is used to provider a `RequestHandler` that will handle all PUT HTTP request to `path`