// import {ViewSet, MethodType, action} from "./../src/router/viewset"
// import {Router} from "./../src/router/"

// class UserViewSet extends ViewSet{
  
  
//   email:string ='innocent'
//   password:string = "innocenT"
  
//   @action(false,["POST"],null, "To login a user with email and password")
//   login(request:any, response:any){
//     console.log({
//       email:this.email,
//       password:this.password
//     })
//   }
  
//   @action(true, ["PUT"],null,"To Reset the users password")
//   reset(request:any, response:any, id:number){
//     console.log({
//       message:"Reset Password of "+this.email,
//       id
//     })
//   }
// }

// let response = {
//   send: function(data:any){
//     console.log("Handled Response")
//     console.log(data)
//   }
// }

// let request = {
//   path:"api/",
//   method: "GET" as MethodType

// }

// const router = new Router("api")
// router.register("auth", UserViewSet)
// router.on(request, response)


import { Request, Response } from "express"
import {Fields, Model , FakerServer, ListTransformer, ViewSet, action, MethodType, Router} from "../src/"

const UserModel =  new Model({
  name: new Fields.NameField(),
  email: new Fields.EmailField()
})


const server = new FakerServer("/fake")

server.get("/user/", new ListTransformer(UserModel))
server.get("/user/:id/", UserModel)
server.post("/user/:id/:name", (req, res, params)=>{
  
  res.send("hello adding user "+params?.name)
})

class AuthViewSet extends ViewSet{

  @action(false, ["GET"], undefined, "login in the user")
  public login(request:Request, response:Response){
    response.send(
      UserModel.generate()
    )
  }

}

const APIRouter = new Router()
APIRouter.register("auth", AuthViewSet)

server.route("/api", APIRouter)

server.run()
