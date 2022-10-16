import { Request, Response } from "express";
import { ParamsType } from "./../core";

abstract class AbstractModel {
  public abstract generate(
    request?: Request,
    params?: ParamsType
  ): object | any[] | string | number;
}

export default AbstractModel;
