import { PathUtil } from "../core/path";
import {logRequest, logResponse, logMessage} from "../core/logger"
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
  viewsetMap: Map < string, ViewSetMapItemType > = new Map();

  constructor(private root: string = "") {}

  set _root(root: string) {
    this.root = root
  }


  register(root: string, viewset: new() => ViewSet) {
    let instance = new viewset();
    let blueprint = viewset.prototype as ViewSetType;

    this.viewsetMap.set(root, { instance, blueprint });

  }


  on(
    request: Request,
    response: Response,
    path: string
  ): boolean | undefined {
    // first remove the router route from the the request path as actualpath

    //Already removed by the server when testing the router

    let actualPath = path!.replace(/^\//, "");

    let stripFirstSigmentPattern = /^([\w+|\s+]+)\//;

    //No need to remove it as it already removed by the server
    //actualPath = actualPath.replace(stripFirstSigmentPattern, "");

    if (!actualPath) {
      return this.displayInfo(request, response);

    }

    // second extract the first segment of the actual route and
    let matchResult = stripFirstSigmentPattern.exec(actualPath);

    // Could not extract the
    if (!matchResult) return;

    if (matchResult?.length < 2) return;

    // Check for any viewset with that path


    if (this.viewsetMap.get(matchResult[1])) {
      let viewsetPath = actualPath.replace(stripFirstSigmentPattern, "");
      let viewset = this.viewsetMap.get(matchResult[1]);
      let actionHandler = this._handleViewsetRequest(
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
  private displayInfo(
    request: Request,
    response: Response
  ): boolean {
    if (request.method == 'INFO') {

    }
    return false
  }

  private _handleViewsetRequest(
    path: string,
    viewset: ViewSetMapItemType,
    request: Request,
    response: Response
  ): boolean | undefined {
    // 1 Get all the support path of the viewset
    let viewsetPaths = Array.from(viewset.blueprint.__paths__.keys());

    // Loop through each viewpath for a match to the path

    let matchedPath: string | undefined;
    let matchedId: string | undefined;

    for (const handlerPathFormat of viewsetPaths) {
      let result = PathUtil.isMatch(handlerPathFormat, path);

      if (result) {
        matchedPath = handlerPathFormat;
        matchedId = result.id;

        break;
      }
    }

    if (matchedPath) {
      let actionHandlerKey = viewset.blueprint.__paths__.get(matchedPath);
      let actionHandler = viewset.blueprint.__actions__.get(
        actionHandlerKey!
      );

      if (actionHandler) {
        // Check that the method is supported by the action handler
        if (!actionHandler.methods.includes(request.method.toUpperCase() as MethodType)) {
          
          if(request.method.toUpperCase() === "OPTIONS") {
            
            response.setHeader("Accept", actionHandler.methods.join(" , "))
            // response.send()
            
            return;
          }
          // Handler does not handle this request type skip it
          response.status(404)
          response.send(
          {
            "detail": "Method Not allowed"
          })
          return;
        }

        // Todo Change types back to express Request and Response
        actionHandler.handler.bind(viewset.instance)(
          request as any,
          response as any,
          matchedId
        );
        logRequest(request);
        return true;
      }
    }

    return ;
  }
}

export { Router };
