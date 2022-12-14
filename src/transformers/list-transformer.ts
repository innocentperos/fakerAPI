import { Request } from "express";
import { Transformer } from ".";
import { AbstractModel } from "../";
import { ParamsType } from "../core/";

/**
 * A Transformer that can generate a list of a given model or another transformer
 */
class ListTransformer extends Transformer {
  /** The Model or Transformer the transformer will generate */
  protected model: AbstractModel | Transformer;

  /** The number of items the transformer should generate */
  protected count: number;

  /**
   * The constructor of ListTransformer
   * @param image The Model or transformer to apply the listTransformer
   * @param count The number of `image` item to generate in the array
   */
  constructor(model: AbstractModel | Transformer, count = 10) {
    super();

    this.model = model;
    this.count = count;
  }

  /**
   * Generates the data of the transform
   * @param request - An Express Request object of the current request
   * @param params - An Express response object for the current request
   * @returns - Returns an array of the `image`  with the length == the `count` property
   */
  public transform(request?: Request, params?: ParamsType) {
    const copy = [];
    if (this.model instanceof AbstractModel) {
      for (let index = 0; index < this.count; index++) {
        copy.push((this.model as AbstractModel).generate());
      }
    } else {
      for (let index = 0; index < this.count; index++) {
        copy.push(this.model.transform(request, params));
      }
    }

    return copy;
  }
}

export default ListTransformer;
