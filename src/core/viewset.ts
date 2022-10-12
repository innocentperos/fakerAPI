type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD"

type ActionHandlerType = {
  methods: MethodType[],
  description: string,
  method:string,
  detail: boolean
}

type ViewSetType = {
  __actions__: Map<string, ActionHandlerType>
}




abstract class ViewSet {
  constructor(){
    
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
        detail:detail
      })
    }
    
  }
}

export {
  ViewSet, ViewSetType, MethodType, action
}
