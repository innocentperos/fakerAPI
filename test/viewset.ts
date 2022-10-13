import {ViewSet, MethodType, action} from "./../src/router/viewset"
import {Router} from "./../src/router/"

class UserViewSet extends ViewSet{
  
  
  email:string ='innocent'
  password:string = "innocenT"
  
  @action(false,["POST"],null, "To login a user with email and password")
  login(request:any, response:any){
    console.log({
      email:this.email,
      password:this.password
    })
  }
  
  @action(true, ["PUT"],null,"To Reset the users password")
  reset(request:any, response:any, id:number){
    console.log({
      message:"Reset Password of "+this.email,
      id
    })
  }
}

let response = {
  send: function(data:any){
    console.log("Handled Response")
    console.log(data)
  }
}

let request = {
  path:"api/auth/login/",
  method: "POST" as MethodType
}

const router = new Router("api")
router.register("auth", UserViewSet)
router.on(request, response)
