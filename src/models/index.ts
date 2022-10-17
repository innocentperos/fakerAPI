import { Field } from "./fields";
import { ParamsType } from "./../core";
import { Request } from "express";
import AbstractModel from "./abstract-model";
type FieldFunctionType = (config?: any) => string | any[] | number | object;

type FieldsType = {
  [key: string]: string | number | any[] | Field | FieldFunctionType;
};

class Model extends AbstractModel {
  protected fields: FieldsType = {};

  constructor(fields: FieldsType) {
    super();
    this.fields = fields;
  }

  public generate(request?: Request,params?: ParamsType) {
    // Get the keys of the fields
    const keys = Object.keys(this.fields);

    const build: {
      [key: string]: any;
    } = {};
    for (const key of keys) {
      const field = this.fields[key];

      if (typeof field === "string" || typeof field === "number") {
        build[key] = field;
      } else if (typeof field === "function") {
        build[key] = (field as (request?: Request, params?: ParamsType) => any)(
          request,
          params
        );
      } else if (field instanceof Field) {
        build[key] = (field as Field).generate();
      } else if (field instanceof Array) {
        build[key] = field;
      } else {
        build[key] = field;
      }
    }
    return build;
  }
}

export { Model, AbstractModel };
