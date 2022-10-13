import {Request, Response} from "express"

type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD" | "INFO"

type ActionMethodHandlerType =  (request:Request, response:Response, id?:number|string)=>void

type ActionHandlerType = {
  methods: MethodType[],
  description: string,
  method:string,
  detail: boolean,
  handler: ActionMethodHandlerType 
}

type ViewSetType = {
  __actions__: Map<string, ActionHandlerType>,
  
  //Mao the actual path to the method name
  __paths__: Map<string, string>,
  
}




abstract class ViewSet {
  constructor(){
    
  }
  
}


function action(detail:boolean = false, methods: MethodType[] = ["GET"],pathName:string|undefined|null, description:string = "No Description"){
  
  return function(target:ViewSet, actionKey: string, actionHandler: PropertyDescriptor){
    
    let viewset = (target as any) as ViewSetType
    if(!viewset.__actions__)
    viewset.__actions__ = new Map()
    if(!viewset.__paths__)
    viewset.__paths__ = new Map()
    
    if(!viewset.__actions__.has(actionKey)){
      viewset.__actions__.set(actionKey, {
        methods: methods,
        description: description,
        method:actionKey,
        detail:detail,
        handler: actionHandler.value
      })
      
      let path:string = (pathName?pathName:actionKey) +"/"
      if(detail){
        path = ":id/" + path
      }
      
      viewset.__paths__.set(path,actionKey)
      
    }
    
  }
  
}

export {
  ViewSet, ViewSetType, MethodType, ActionMethodHandlerType, ActionHandlerType,  action
}
