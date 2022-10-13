import {Request, Response} from "express"

type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD"

type ActionMethodHandlerType =  (request:Request, response:Response, id?:number|string)=>void

type ActionHandlerType = {
  methods: MethodType[],
  description: string,
  method:string,
  detail: boolean,
  handler: ActionMethodHandlerType
}

type ViewSetType = {
  __actions__: Map<string, ActionHandlerType>
}




abstract class ViewSet {
  constructor(){
    
  }
  
  public init(viewset: typeof ViewSet){
    
    let blueprint = viewset.prototype as any as ViewSetType
    
    
    
    //console.log(blueprint)
    
    let context = this as any
    if (typeof context.get == "function") {
      
    } else {
      if (!blueprint.__actions__?.has("")) {
        blueprint.__actions__.set("",{
          methods:["GET"],
          method:"get",
          handler: context.get,
          detail: false,
          description:"Get request"
        })
      }
    }
  }

}

function action(detail:boolean = false, methods: MethodType[] = ["GET"], description:string = "No Description"){
  
  return function(target:ViewSet, actionKey: string, actionHandler: PropertyDescriptor){
    
    let viewset = (target as any) as ViewSetType
    if(!viewset.__actions__)
    viewset.__actions__ = new Map()
    
    if(!viewset.__actions__.has(actionKey)){
      viewset.__actions__.set(actionKey, {
        methods: methods,
        description: description,
        method:actionKey,
        detail:detail,
        handler: actionHandler.value
      })
    }
    
  }
}

export {
  ViewSet, ViewSetType, MethodType, ActionMethodHandlerType,  action
}
