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