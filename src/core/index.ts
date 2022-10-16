import { Express, Request, Response, Router } from "express";
import express from "express";
import { AbstractModel } from "../models";

import { logRequest, logMessage, logResponse } from "./logger";
import { PathUtil, ParamsType } from "./path";
import { Transformer } from "../transformers";
import { Router as FARouter } from "../router";

type FunctionRequestHandler = (
  request: Request,
  response: Response,
  params?: ParamsType
) => void;

type RequestHandlerType =
  | FunctionRequestHandler
  | AbstractModel
  | Transformer;

type MethodType =
  | "GET"
  | "POST"
  | "DELETE"
  | "PUT"
  | "OPTIONS"
  | "PATCH"
  | "HEAD"
  | string;

/**
 *  Each `key` represent a method type,
 *
 */
type MethodRequestHanderType = {
  [key in MethodType]?: RequestHandlerType;
};

type ConfigType = {
  [key: string]: any;
  request: Request;
  response: Response;
  params?: ParamsType;
};

/**
 * This is the class that is been used to instantiate the api faker server instance
 *
 */
class FakerServer {
  /**
   * @type string specific the route the server would be running on
   */
  private serverPath: string;

  private expressApp: Express;
  private expressRouter: Router;
  private appPassed: boolean = false;

  // Single method handler , handlers can be a function or a model
  private methodRequestHanders: Map<string, MethodRequestHanderType> =
    new Map();

  private routerMaps: Map<string, FARouter> = new Map();

  constructor(path: string = "/api", expressInstance?: Express) {
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

  /**
   * Returns an instance of a FakerServer with the given express application instance
   *
   * @param expressInstance An express application instance
   * @param path [string="/api"] The path the Faker Server will be running on, on the express application
   * @returns An instance of FakerServer
   *
   */
  public static from(
    expressInstance: Express,
    path: string = "/api"
  ): FakerServer {
    return new FakerServer(path, expressInstance);
  }

  /**
   * Start the faker server.
   * @remark This method should be called if the faker server instance was created / instantiated without passing an express application instance.
   * @param port - The port the faker server internally created express application instance will run on
   */
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
        `Faker Server running on \n        \x1b[42m http://localhost:${port}${this.serverPath}\x1b[0m `,
        "debug"
      );
    });
  }

  /**
   * Adds a new request method handle to the faker server
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   * @param method - The request method type the handle should accept
   */
  private __addMethodRequestHandler(
    path: string,
    handler: RequestHandlerType,
    method: string
  ) {
    if (!this.methodRequestHanders.has(path)) {
      this.methodRequestHanders.set(path, {});
    }

    const _handlers = this.methodRequestHanders.get(path);

    if (_handlers) _handlers[method] = handler;
  }

  /**
   * Adds a new GET request handler to the faker server instance
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   *
   */
  public get(path: string, handler: RequestHandlerType) {
    this.__addMethodRequestHandler(path, handler, "GET");
    return this;
  }

  /**
   * Adds a new POST request handler to the faker server instance
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   *
   */
  public post(path: string, handler: RequestHandlerType) {
    this.__addMethodRequestHandler(path, handler, "POST");
    return this;
  }
  /**
   * Adds a new DELETE request handler to the faker server instance
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   *
   */
  public delete(path: string, handler: RequestHandlerType) {
    this.__addMethodRequestHandler(path, handler, "DELETE");
    return this;
  }
  /**
   * Adds a new PUT request handler to the faker server instance
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   *
   */
  public put(path: string, handler: RequestHandlerType) {
    this.__addMethodRequestHandler(path, handler, "PUT");
    return this;
  }
  /**
   * Adds a new PATCH request handler to the faker server instance
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   *
   */
  public patch(path: string, handler: RequestHandlerType) {
    this.__addMethodRequestHandler(path, handler, "PATCH");
    return this;
  }

  /**
   * Register a new Router to the faker server instance
   * @param path - The path the router should handle request to (avoid using paths that ends with a /)
   * @param router - The router instance
   *
   * @remark This method can throw error if the `path` ends with /
   */
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
      const _e = error as Error;
      const requiredStag = _e.stack?.split("\n").slice(1, 3).join("\n");
      logMessage(`${_e.message} \n ${requiredStag} \n`, "warning");
    }

    router._root = path;
    this.routerMaps.set(path, router);
  }
  /**
   * Handles request that matches a specific static path that has a method handler registered to it
   *
   * @param path - The url the handler should handle
   * @param handler - The handler it self
   * @param method - The request method type the handle should accept
   */
  private _handleMethodHandler(
    request: Request,
    response: Response,
    path: string,
    params?: ParamsType
  ): boolean {
    // Gets all method handlers associated to the path
    const handlers = this.methodRequestHanders.get(path);

    const method = request.method.toUpperCase() as any as MethodType;

    // The method is an Option request,Add the handlers methods to the response Accept header
    if (!(method in (handlers as MethodRequestHanderType))) {
      if (method === "OPTIONS") {
        response.setHeader("Accept", Object.keys(handlers!).join(","));
      }
      return false;
    }

    const handler = (handlers as MethodRequestHanderType)[method];

    // Could not the a handler for the request method type
    if (!handler) return false;

    // The handler was is a function
    if (typeof handler === "function") {
      (handler as FunctionRequestHandler)(request, response, params);
      return true;
    } else if (handler instanceof AbstractModel) {
      // Handler is a model send the model's generated data
      response.send((handler as AbstractModel).generate(request, params));
      return true;
    } else if (handler instanceof Transformer) {
      // The handler is a transformer call the transform function and send the data it returns
      response.send(
        (handler as Transformer).transform(request, params)
      );
      return true;
    }
    return false;
  }

  /**
   * Called internally to check if there exist a router that can handle a request, after confirming that there is no method handler found to handle the request
   * @param request - The request object
   * @param response - The response object
   * path - The request path without the server prefix path
   * @returns - true if the request handled by a router or false if there was no router to handle the request
   */
  private _handleRouterRequest(
    request: Request,
    response: Response,
    path: string
  ): boolean {
    // Get all the routers path prefix
    const routersPath = Array.from(this.routerMaps.keys());

    // loop through the routerPath to see those that match the start of the path
    for (const routerPath of routersPath) {
      if (path.startsWith(routerPath)) {
        // A match was found
        // strip the prefix of the router from the path
        const _m = path.replace(routerPath, "");

        // This insures that the right router is select since router prefix are not allowed to end with /

        /**
         * This plevent for example
         * router prefix is router/game
         * then path router/game/more
         * should match the router but
         * path = router/game//more will not macth
         */
        if (!_m.startsWith("/")) continue;

        const router = this.routerMaps.get(routerPath)!;

        // pass the request to the found router and see if it can handle the request
        const result = router.on(request as any, response, _m);

        if (result) return true;
      }

      continue;
    }

    return false;
  }

  /**
   * This method is called internally everytime a new request is directed to the faker server
   * @param request - The new request object
   * @param response - The request response object
   */
  private onNewRequest(request: Request, response: Response) {
    const path = request.path.replace(this.serverPath, "");

    if (request.method === "OPTIONS") response.setHeader("Accept", "");

    logRequest(request);
    let handled = false;
    // First loop through Method handlers first

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

    // Pass it to the routers to handle if no method found to handle the request
    if (handled === false) {
      handled = this._handleRouterRequest(
        request,
        response,
        path.replace(/^\/\//, "/")
      );
    }

    // no methods or routers available to handle such request
    if (handled === false) {
      if (request.method !== "OPTIONS")
        logMessage(
          `Unhandled request made  to \`${request.method.toUpperCase()} ${path}\``,
          "error"
        );

      try {
        if (request.method.toUpperCase() === "OPTIONS") {
          response.status(200);
          response.send();
        } else {
          response.status(404);
          response.send({
            detail: "No handler for this route @FakerAPI",
          });
        }
      } catch (error) {
        // Todo: Handle this error
      }
    }
  }
}

export { FakerServer, ParamsType, MethodType };
