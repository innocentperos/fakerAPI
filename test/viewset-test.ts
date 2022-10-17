import { Request, Response } from "express"
import { ViewSet, FakerServer, Model, Fields, Router, ListTransformer} from "./../src/"

const UserModel = new Model({
  name: new Fields.NameField(),
  address: new Fields.FullAddressField()
})

class UserViewset extends ViewSet {

  usersList:any[] = []

  public get(request: any, response: any) {
    response.send(this.usersList)
  }

  public retreive(request: any, response: any, id: any) {
    
    let user = this.usersList.find((e :any)=> e.id == id)

    if (user) {
      response.send(user)
    } else {
      response.status(404)
      response.send({
        message: "User not found"
      })
    }
  }

  public create(request: any, response: any) {
    const newUser = UserModel.generate()
    this.usersList.push({ ...newUser, id: this.usersList.length })

    response.send(this.usersList[this.usersList.length - 1])
  }

  public delete(request: any, response: any, id: any) {
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
class CommentViewSet extends ViewSet{

  get(request:Request, response:Response){
    response.send({
      message:"Hello Comments"
    })
  }
}
const router = new Router()

router.register("users", UserViewset)
router.register("comments", CommentViewSet)

const server = new FakerServer()

server.route("/api", router)
server.route("users", UserViewset)

server.run()
