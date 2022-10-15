
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
  
  @action(true, ["POST","GET"],undefined)
  profile(request:Request, response:Response){
    response.send(UserModel.generate())
  }

}

const APIRouter = new Router()
APIRouter.register("auth", AuthViewSet)

server.route("/api", APIRouter)

server.run()
