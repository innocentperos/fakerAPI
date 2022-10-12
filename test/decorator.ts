import {ViewSet, action} from "./../src/core/viewset"
import {Router} from "./../src/core/router"

class UserViewSet extends ViewSet{
  
  @action()
  login(){
    
  }
  
  @action()
  register(){
    
  }
  
  @action(true)
  profile(){
    
  }
  
  @action(true,)
  status(){
    
  }
}


const router = new Router()

router.register("user", UserViewSet)

console.log(router.urls)
console.log(router.getViewsetUrls("user"))
