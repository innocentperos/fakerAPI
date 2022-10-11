import { Express, Request, Response, Router } from "express"
import express from "express"
import { FAAbstractModel } from "../models"

import { logRequest, logMessage, logResponse } from "./logger"
import { PathUtil, ParamsType } from "./path"
import { FAAbstractTransformer } from "../transformers"

type FunctionRequestHandler = (request: Request, response: Response, params ? : ParamsType) => void

type RequestHandlerType = FunctionRequestHandler | FAAbstractModel | FAAbstractTransformer

type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "OPTIONS" | "PATCH" | "HEAD" | string

type MethodRequestHanderType = {
  [key in MethodType] ? : RequestHandlerType
}

type ConfigType = {
  [key: string | number | symbol]: any,
  request: Request,
  response: Response,
  params ? : ParamsType
}

class FakerServer {

  private serverPath: string;
  private expressApp: Express;
  private expressRouter: Router;
  private appPassed:boolean = false;
  // For full router handlers
  private requestHandlers: Map < string, RequestHandlerType > = new Map()

  // Single method handler , handlers can be a function or a model
  private methodRequestHanders: Map < string, MethodRequestHanderType > = new Map()

  constructor(path: string = '/api', expressInstance ? : Express) {

    this.serverPath = path;
    if (expressInstance) {
      this.appPassed = true;
      this.expressApp = expressInstance;
    } else {
      this.expressApp = express()
    }

    // Request the handler for all request
    this.expressRouter = Router()

    this.expressApp.use(this.serverPath, this.expressRouter)

    this.expressRouter.all("*", (req: Request, res: Response) => {
      this.onNewRequest(req, res)
    })
  }

  public static from(expressInstance: Express, path: string = "/api"): FakerServer {
    return new FakerServer(path, expressInstance)
  }

  public run(port: number = 8800) {
     if(this.appPassed){
      logMessage("Message an instance of Express app was pass to the constructor, no need to call run, the Faker server will start the moment the Express app starts","error")
      return;
     }
     
      this.expressApp.listen(port, () => {
        console.log(`Faker Server running on http://localhost:${port}${this.serverPath}`)
      })
    
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
  
  public delete(path: string, handler: RequestHandlerType) {
    const method = "DELETE"

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {})
    }

    const _handlers = this.methodRequestHanders.get(path)

    if (_handlers) _handlers[method] = handler

    return this
  }
  public put(path: string, handler: RequestHandlerType) {
    const method = "PUT"

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

  private _handleMethodHandler(request: Request, response: Response, path: string, params ? : ParamsType): boolean {

    const handlers = this.methodRequestHanders.get(path)


    const method = (request.method.toUpperCase() as any as MethodType)

    if (!(method in (handlers as MethodRequestHanderType))) return false

    const handler = (handlers as MethodRequestHanderType)[method]

    if (typeof handler === 'function') {
      (handler as FunctionRequestHandler)(request, response, params)
      return true
    } else if (handler instanceof FAAbstractModel) {
      response.send(
        (handler as FAAbstractModel).generate({
          request,
          response,
          params: params
        })
      )
      return true
    } else if (handler instanceof FAAbstractTransformer) {
      response.send(
        (handler as FAAbstractTransformer).transform({
          request,
          response,
          params
        })
      )
      return true
      
    }
    return false
  }


  private onNewRequest(request: Request, response: Response) {
    const path = request.path.replace(this.serverPath, "/")


    // First loop through Method handlers first
    logRequest(request)

    let handled = false

    // loop through each method handler if path matches current request path
    const handlersPath = this.methodRequestHanders.keys()

    for (const handlerPath of handlersPath) {
      
      if(handled) break;
      
      // Run the pathParams finder if the paths maches it will return an object of paramsType
      const pathMatchResult = PathUtil.isMatch(handlerPath, path)

      if (pathMatchResult) {
        handled = this._handleMethodHandler(request, response, handlerPath, pathMatchResult)
      }
    }

    if (handled == false) {
      logMessage(`Unhandled request made  to \`${request.method.toUpperCase()} ${path}\``, "error")

      response.status(404)
      response.send({
        detail: "No handler for this route @FakerAPI"
      })
    }

  }
}

export { FakerServer, ConfigType };
