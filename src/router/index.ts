import {ViewSet,ViewSetType, ActionHandlerType, MethodType, ActionMethodHandlerType} from "./viewset"


type ViewSetMapItemType = {
  instance:ViewSet,
  blueprint: ViewSetType
}
class Router {
  
  viewsetMap:Map<string,ViewSetMapItemType> = new Map()
  
  constructor(public root:string =''){
    
  }
  
  register(root:string, viewset: new()=>ViewSet){
    
    let instance = new viewset()
    let blueprint = viewset.prototype as ViewSetType
    
    //console.log(blueprint)
  }
  
  on(request:{path:string, method:MethodType}, response: {send:(data:any)=>void}){
    
    // first remove the router route from the the request path as actualpath
    let actualPath = request.path
    let searchPattern = /^([\w+|\s+]+)\//
    actualPath = actualPath.replace(searchPattern, "")
    console.log("Removing Router root",{actualPath})
    // second extract the first segment of the actual route and 
    let matchResult = searchPattern.exec(actualPath)
    console.log("Extracting ViewSet root",matchResult)
    
    
    // Check for any viewset with that path
    // Thrid Get 
    
  }
}


export {
  Router
}
