import { Express, Request, Response ,Router} from "express"
import express from "express"
import { FAModel } from "../"


type FunctionRequestHandler = (request: Request, response: Response) => void

type RequestHandlerType = FunctionRequestHandler | FAModel

type MethodType = "GET" | "POST" | "DELETE" | "PUT"

type MethodRequestHanderType = {
  [key in MethodType] ? : RequestHandlerType
}

type ConfigType = {
  [key : string|number|symbol] : any,
  request: Request,
  response: Response
}

class FakerServer {

  private serverPath: string;
  private expressApp: Express;
  private expressRouter:Router;
  // For full router handlers
  private requestHandlers: Map < string, RequestHandlerType > = new Map()

  // Single method handler , handlers can be a function or a model
  private methodRequestHanders: Map < string, MethodRequestHanderType > = new Map()

  constructor(path: string ='api', expressInstance?: Express) {

    this.serverPath = path;
    if(expressInstance){
      this.expressApp = expressInstance;
    }else{
      this.expressApp = express()
    }
    
    // Request the handler for all request
    this.expressRouter = Router()
    this.expressApp.use(this.serverPath, this.expressRouter)
    
    this.expressRouter.all(this.serverPath, (req:Request, res:Response)=>{
      this.onNewRequest(req, res)
    })
  }

  public static from(expressInstance: Express, path: string = "/api"): FakerServer {
    return new FakerServer(path, expressInstance)
  }
  
  public run(port:number = 8800){
    if(true){
      this.expressApp.listen(port, ()=>{
        console.log(`Faker Server running on http://localhost:${port}${this.serverPath}`)
      })
    }
  }

  public get(path: string, handler: RequestHandlerType) {
    const method = "GET"

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {})
    }

    const _handlers = this.methodRequestHanders.get(path)

    if (_handlers) _handlers[method] = handler
    
    
    return this;
  }
  public post(path: string, handler: RequestHandlerType) {
    const method = "POST"

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {})
    }

    const _handlers = this.methodRequestHanders.get(path)

    if (_handlers) _handlers[method] = handler
    
    return this
  }


  /**
   * Handles request that matches a specific static path that has a method handler registered to it 
   * */
   
  private _handleMethodHandler(request: Request, response: Response): boolean {
    
    const handlers = this.methodRequestHanders.get(request.path)
    
    const method = (request.method.toUpperCase() as any as MethodType)

    if (method in (handlers as MethodRequestHanderType)) return false

    const handler = (handlers as MethodRequestHanderType)[method]

    if (typeof handler === 'function') {
      (handler as FunctionRequestHandler)(request, response)
      
    } else if (handler instanceof FAModel) {
      
      response.send(
        handler.generate({
          request, response
        })
      )
      
    }
    return false
  }
  
  
  private onNewRequest(request: Request, response: Response) {
    const path = request.path

    // First loop through Method handlers first

    if (this.methodRequestHanders.has(path)) {
      this._handleMethodHandler(request, response)
    }
  }
}

export { FakerServer , ConfigType};
