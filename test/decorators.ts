
type ViewSetType = {
    __actions__: Map<string, any>,

}
abstract class View {

}

type MethodType = "GET"|"POST"


function action(detail:boolean = true, methods: MethodType[] = ['GET'] , description?:string ){
    return function decorator<T extends View>(target:T, key: string, descriptor: PropertyDescriptor){
        
        
        let viewSet = (target as any ) as ViewSetType
        if (!( "__actions__" in viewSet as any)){
            viewSet.__actions__ = new Map()
        }
        if (! viewSet.__actions__?.has(key)){
            viewSet.__actions__?.set(key, {
                methods,
                detail,
                description
            })
        }

    }
}

const actionsMap:Map<Symbol, any> = new Map()

function viewSetFactory(target: (typeof View )){
    
    let proto = target.prototype as ViewSetType

    if (!proto.__actions__){
        console.log("not a viewset")
        return 
    }

    let actions = Array.from(proto.__actions__?.keys())

    let instance = new (target as new()=>any)()
    

    for ( const key of actions){
        console.log(key)
        let handler:Function = instance[key]
        if (handler){
            handler.bind(instance).call()
        }
    }
}


class UsersView extends View {

    private users = ["mayor","classic"]

    @action(false, ['POST'], "To login user")
    login(){
        console.log(this.users)
    }
}

viewSetFactory(UsersView)