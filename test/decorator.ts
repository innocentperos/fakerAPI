import {ViewSet, action} from "./../src/core/viewset"
import {Router} from "./../src/core/router"
import {Request, Response} from "express"

class UserViewSet extends ViewSet{
  
  user:string = "innocent peros"
  
  
  @action()
  login(){
    
  }
  
  @action()
  register(){
    
  }
  
  @action(true)
  profile(request:Request, response:Response, id:number){
    console.log(this.user, id)
    
  }
  
  @action(true,)
  status(){
    
  }
}


const router = new Router()

router.register("user", UserViewSet)

router.handle("user/1/profile/")
