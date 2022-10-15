import { PathUtil } from "../core/path";
import { logRequest, logResponse, logMessage } from "../core/logger"
import {
  ViewSet,
  ViewSetType,
  ActionHandlerType,
  MethodType,
  ActionMethodHandlerType,
} from "./viewset";
import { Request, Response } from "express"

type ViewSetMapItemType = {
  instance: ViewSet;
  blueprint: ViewSetType;
};


class Router {

  /***
   * Map that holds various viewset objects with there key been there path prefix
   */
  viewsetMap: Map < string, ViewSetMapItemType > = new Map();

  /***
   * Represent the prefix of the router 
   */
  public root ? : string

  /**
   * Sets the prefix of the router
   * @param root - The path prefix of the router
   * This method is used by the FakerServer instance when registing a router 
   */
  set _root(root: string) {
    this.root = root
  }

  /**
   * To add or register a new viewset class to a router instance
   * @param root - the prefix of the viewset 
   * @viewset - The class of the actual viewset, the class will be instantiated by the router object here
   */
  register(root: string, viewset: new() => ViewSet) {
    const instance = new viewset();
    const blueprint = viewset.prototype as ViewSetType;

    this.viewsetMap.set(root, { instance, blueprint });

  }

  /**
   * Handles all request that a directed to the router by the faker server instance 
   * @param request - Express request object of the request
   * @param response - Express response object for the request
   * @path : The request path without the faker server path prefix
   * @returns true if request was handled by any viewset else returns false or undefined
   */

  public on(
    request: Request,
    response: Response,
    path: string
  ): boolean | undefined {
    // first remove the router route from the the request path as actualpath

    // Already removed by the server when testing the router

    const actualPath = path!.replace(/^\//, "");

    const stripFirstSigmentPattern = /^([\w+|\s+]+)\//;

    // No need to remove it as it already removed by the server
    // actualPath = actualPath.replace(stripFirstSigmentPattern, "");

    if (!actualPath) {
      return this.displayInfo(request, response);

    }

    // second extract the first segment of the actual route and
    const matchResult = stripFirstSigmentPattern.exec(actualPath);

    // Could not extract the
    if (!matchResult) return;

    if (matchResult?.length < 2) return;

    // Check for any viewset with that path
    if (this.viewsetMap.get(matchResult[1])) {

      const viewsetPath = actualPath.replace(stripFirstSigmentPattern, "");
      const viewset = this.viewsetMap.get(matchResult[1]);
      const actionHandler = this._handleViewsetRequest(
        viewsetPath,
        viewset!,
        request,
        response
      );

      if (actionHandler) {
        return true;
      }
      // Todo Call this function
    }
  }

  /**
   * To generate a description of the router object
   */
  private displayInfo(
    request: Request,
    response: Response
  ): boolean {
    if (request.method === 'INFO') {
      // Provide description here
    }
    return false
  }

  /**
   * Calls when a viewset root matches the prefix of a request
   * This method will basically iterate over all the support path the viewset can handle and check if any matches the request path @path
   * 
   * @param path - The request path
   * @viewset - The actual viewset Item whose root matches the prefix of the path
   * @param request - Express request object of the request
   * @param response - Express response object for the request
   * @returns true if the viewset can handle the request method or false | undefined if not
   */
  private _handleViewsetRequest(
    path: string,
    viewset: ViewSetMapItemType,
    request: Request,
    response: Response
  ): boolean | undefined {

    // 1 Get all the support path of the viewset
    const viewsetPaths = Array.from(viewset.blueprint.__paths__.keys());

    // Loop through each viewpath for a match to the path

    let matchedPath: string | undefined;
    let matchedId: string | undefined;

    for (const handlerPathFormat of viewsetPaths) {

      // run the path matching algorithm
      const result = PathUtil.isMatch(handlerPathFormat, path);

      // path matches exit loop after setting the matched path and id
      if (result) {
        matchedPath = handlerPathFormat;
        matchedId = result.id;

        break;
      }
    }

    // check if a handler was found, (set during the previous loop)
    if (matchedPath) {

      const actionHandlerKey = viewset.blueprint.__paths__.get(matchedPath);

      const actionHandler = viewset.blueprint.__actions__.get(
        actionHandlerKey!
      );

      if (actionHandler) {
        // Check that the method is supported by the action handler
        if (!actionHandler.methods.includes(request.method.toUpperCase() as MethodType)) {

          if (request.method.toUpperCase() === "OPTIONS") {

            response.setHeader("Accept", actionHandler.methods.join(","))
            // response.send()

            return;
          }

          // Handler does not handle this request method type skip it
          response.status(404)
          response.setHeader("Accept", actionHandler.methods.join(","))
          response.send(
          {
            "detail": "Method Not allowed"
          })
          return;
        }

        // call the handler to handle the request
        actionHandler.handler.bind(viewset.instance)(
          request,
          response,
          matchedId
        );
        logRequest(request);
        return true;
      }
    }

    return;
  }
}

export { Router };
