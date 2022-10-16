import { Request } from "express";
import { ParamsType } from "../core/";

/**
 * The abstract class from which custom Transformers can be created from by extending it
 */
abstract class Transformer {
  /**
   *
   * @param request An Express Request object of the current request
   * @param params The extracted paramters of the request path
   */
  public abstract transform(request?: Request, params?: ParamsType): any;
}

export { Transformer };
