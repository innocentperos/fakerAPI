import { Request, Response } from "express";
import { MethodType } from "./../core";

type ActionMethodHandlerType = (
  request: Request,
  response: Response,
  id?: number | string
) => void;

type ActionHandlerType = {
  methods: MethodType[];
  description: string;
  method: string;
  detail: boolean;
  handler: ActionMethodHandlerType;
};

type ViewSetType = {
  __actions__: Map<string, ActionHandlerType>;

  // Maps the actual path to the method name
  __paths__: Map<string, string>;
};

abstract class ViewSet {
  public description(): string {
    return "No description";
  }

  /**
   * A alias funtion for the decorator `_action` that converts the ViewSet nethod into a request handler
   * @param detail - Specifics if an id is required or not for the method
   * @methods - The http request methods the Viewset method will handle
   * pathName - The sufix of the request path that the method would handle, id non is peovided then the name of the method is used
   * description - The discription od the Viewset route, (used to generated the api documentation)
   * @returns - The decorator function _action
   */
  public static action(
    detail: boolean = false,
    methods: MethodType[] = ["GET"],
    pathName: string | undefined | null,
    description: string = "No Description"
  ) {
    return _action(detail, methods, pathName, description);
  }
}

/**
 * A decorator function that converts the ViewSet nethod into a request handler
 * @param detail - Specifics if an id is required or not for the method
 * @methods - The http request methods the Viewset method will handle
 * pathName - The sufix of the request path that the method would handle, id non is peovided then the name of the method is used
 * description - The discription od the Viewset route, (used to generated the api documentation)
 * @returns - The decorator function _action
 */
function _action(
  detail: boolean = false,
  methods: MethodType[] = ["GET"],
  pathName: string | undefined | null,
  description: string = "No Description"
) {
  return (
    target: ViewSet,
    actionKey: string,
    actionHandler: PropertyDescriptor
  ) => {
    const viewset = target as any as ViewSetType;

    // Insuring that the viewset class object as __action__ and __path__ defined
    if (!viewset.__actions__) viewset.__actions__ = new Map();
    if (!viewset.__paths__) viewset.__paths__ = new Map();

    /***
     * The __actions__ contains a Map mapping various handlers to a handler method name
     * while the __paths__ contains various url paths mapping to the method name
     */

    if (!viewset.__actions__.has(actionKey)) {
      viewset.__actions__.set(actionKey, {
        methods,
        description,
        method: actionKey,
        detail,
        handler: actionHandler.value,
      });

      let path: string = (pathName ? pathName : actionKey) + "/";

      if (path.startsWith("/")) {
        path.replace(/^\//, "");
      }
      if (detail) {
        path = ":id/" + path;
      }

      viewset.__paths__.set(path, actionKey);
    }
  };
}

export {
  ViewSet,
  ViewSetType,
  MethodType,
  ActionMethodHandlerType,
  ActionHandlerType,
};
