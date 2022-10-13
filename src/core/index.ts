import { Express, Request, Response, Router } from "express";
import express from "express";
import { FAAbstractModel } from "../models";

import { logRequest, logMessage, logResponse } from "./logger";
import { PathUtil, ParamsType } from "./path";
import { FAAbstractTransformer } from "../transformers";
import { Router as FARouter } from "../router";

type FunctionRequestHandler = (
  request: Request,
  response: Response,
  params ? : ParamsType
) => void;

type RequestHandlerType = |
  FunctionRequestHandler |
  FAAbstractModel |
  FAAbstractTransformer;

type MethodType = |
  "GET" |
  "POST" |
  "DELETE" |
  "PUT" |
  "OPTIONS" |
  "PATCH" |
  "HEAD" |
  string;

type MethodRequestHanderType = {
    [key in MethodType] ? : RequestHandlerType;
};

type ConfigType = {
    [key: string]: any;
  request: Request;
  response: Response;
  params ? : ParamsType;
};

class FakerServer {
  private serverPath: string;
  private expressApp: Express;
  private expressRouter: Router;
  private appPassed: boolean = false;
  // For full router handlers
  private requestHandlers: Map < string, RequestHandlerType > = new Map();

  // Single method handler , handlers can be a function or a model
  private methodRequestHanders: Map < string, MethodRequestHanderType > =
    new Map();

  private routerMaps: Map < string, FARouter > = new Map();

  constructor(path: string = "/api", expressInstance ? : Express) {
    this.serverPath = path;
    if (expressInstance) {
      this.appPassed = true;
      this.expressApp = expressInstance;
    } else {
      this.expressApp = express();
    }

    // Request the handler for all request
    this.expressRouter = Router();

    this.expressApp.use(this.serverPath, this.expressRouter);

    this.expressRouter.all("*", (req: Request, res: Response) => {
      this.onNewRequest(req, res);
    });
  }

  public static from(
    expressInstance: Express,
    path: string = "/api"
  ): FakerServer {
    return new FakerServer(path, expressInstance);
  }

  public run(port: number = 8800) {
    if (this.appPassed) {
      logMessage(
        "Message an instance of Express app was pass to the constructor, no need to call run, the Faker server will start the moment the Express app starts",
        "warning"
      );
      return;
    }

    this.expressApp.listen(port, () => {
      logMessage(
        `Faker Server running on \n        \x1b[42m http://localhost:${port}${this.serverPath}\x1b[0m `, "debug"
      );
    });
  }

  public get(path: string, handler: RequestHandlerType) {
    const method = "GET";

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {});
    }

    const _handlers = this.methodRequestHanders.get(path);

    if (_handlers) _handlers[method] = handler;

    return this;
  }
  public post(path: string, handler: RequestHandlerType) {
    const method = "POST";

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {});
    }

    const _handlers = this.methodRequestHanders.get(path);

    if (_handlers) _handlers[method] = handler;

    return this;
  }

  public delete(path: string, handler: RequestHandlerType) {
    const method = "DELETE";

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {});
    }

    const _handlers = this.methodRequestHanders.get(path);

    if (_handlers) _handlers[method] = handler;

    return this;
  }
  public put(path: string, handler: RequestHandlerType) {
    const method = "PUT";

    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {});
    }

    const _handlers = this.methodRequestHanders.get(path);

    if (_handlers) _handlers[method] = handler;

    return this;
  }

  public route(path: string, router: FARouter) {
    try {
      if (path.match(/\/$/)) {
        throw new Error(
          `Avoid using router path that ends with \x1b[41m\x1b[37m / \x1b[0m `
        );
      }
      if (this.routerMaps.has(path)) {
        throw new Error(
          `Another router with thesame path ${path} is been override @ \n `
        );
      }
    } catch (error) {
      let _e = error as Error;
      let requiredStag = _e.stack?.split("\n").slice(1, 3).join("\n");
      logMessage(`${_e.message} \n ${requiredStag} \n`, "warning");
    }

    router._root = path;
    this.routerMaps.set(path, router);
  }
  /**
   * Handles request that matches a specific static path that has a method handler registered to it
   * */

  private _handleMethodHandler(
    request: Request,
    response: Response,
    path: string,
    params ? : ParamsType
  ): boolean {
    const handlers = this.methodRequestHanders.get(path);

    const method = request.method.toUpperCase() as any as MethodType;

    if (!(method in (handlers as MethodRequestHanderType))) return false;

    const handler = (handlers as MethodRequestHanderType)[method];

    if (typeof handler === "function") {
      (handler as FunctionRequestHandler)(request, response, params);
      return true;
    } else if (handler instanceof FAAbstractModel) {
      response.send(
        (handler as FAAbstractModel).generate({
          request,
          response,
          params: params,
        })
      );
      return true;
    } else if (handler instanceof FAAbstractTransformer) {
      response.send(
        (handler as FAAbstractTransformer).transform({
          request,
          response,
          params,
        })
      );
      return true;
    }
    return false;
  }

  private _handleRouterRequest(
    request: Request,
    response: Response,
    path: string
  ): boolean {
    let routersPath = Array.from(this.routerMaps.keys());

    for (const routerPath of routersPath) {


      if (path.startsWith(routerPath)) {

        let _m = path.replace(routerPath, "")

        if (!_m.startsWith("/")) continue

        let router = this.routerMaps.get(routerPath) !

          let result = router.on(request as any, response, _m);

        if (result) return true

      }

      continue

    }

    return false;
  }

  private onNewRequest(request: Request, response: Response) {
    const path = request.path.replace(this.serverPath, "");

    // First loop through Method handlers first
    logRequest(request);

    let handled = false;

    // loop through each method handler if path matches current request path
    const handlersPath = Array.from(this.methodRequestHanders.keys());

    for (const handlerPath of handlersPath) {
      if (handled) break;

      // Run the pathParams finder if the paths maches it will return an object of paramsType
      const pathMatchResult = PathUtil.isMatch(handlerPath, path, true);

      if (pathMatchResult) {
        handled = this._handleMethodHandler(
          request,
          response,
          handlerPath,
          pathMatchResult
        );
      }
    }

    // Pass it to the routers to handle if
    if (handled == false) {
      handled = this._handleRouterRequest(
        request,
        response,
        path.replace(/^\/\//, "/")
      );
    }

    // no methods or routers available to handle such request
    if (handled == false) {
      logMessage(
        `Unhandled request made  to \`${request.method.toUpperCase()} ${path}\``,
        "error"
      );

      try {
        response.status(404);
        response.send({
          detail: "No handler for this route @FakerAPI",
        });
      } catch (error) {

      }

    }
  }
}

export { FakerServer, ConfigType };
