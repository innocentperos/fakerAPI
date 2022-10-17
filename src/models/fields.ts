/* tslint:disable:max-classes-per-file */

import { faker } from "@faker-js/faker";

/**
 * Field is the simples type of data of a model, it represent the type of data the model is ecpected to provide
 * @method generate This is used by a model to get the type of data the field is extected to provide
 */

abstract class Field {
  /**
   * This method is incharge of generating the fake value of the field
   * @returns - The value of the field
   */
  public abstract generate(): any;
}

class NameField extends Field {
  private _type: string;
  constructor(_type: "FirstName" | "LastName" | "FullName" = "FullName") {
    super();
    this._type = _type;
  }
  public generate() {
    const name = faker.name;
    if (this._type === "FirstName") return name.firstName();
    if (this._type === "LastName") return name.lastName();

    return name.fullName();
  }
}

class EmailField extends Field {
  public domain: string | undefined;
  public constructor(domain?: string) {
    super();
    this.domain = domain;
  }
  public generate() {
    return faker.internet.email();
  }
}

class TextField extends Field {
  private count: number = 50;

  constructor(count: number = 50) {
    super();
    this.count = count;
  }

  public generate() {
    return faker.random.words(this.count);
  }
}

class PhoneNumberField extends Field {
  format: string | undefined;
  constructor(format?: string) {
    super();
    this.format = format
  }
  public generate() {
    if (this.format) return faker.phone.number(this.format);
    return faker.phone.number();
  }
}

class AvatarField extends Field {
  public generate() {
    return faker.image.avatar();
  }
}

class IDField extends Field {
  public generate() {
    return faker.datatype.uuid();
  }
}

class GenderField extends Field {
  public generate() {
    return faker.name.gender();
  }
}

class SexTypeField extends Field {
  public generate() {
    return faker.name.sexType();
  }
}

class UsernameField extends Field {
  public generate() {
    return faker.internet.userName();
  }
}

class ImageField extends Field {
  height: number;
  width: number;

  constructor(height: number = 480, width: number = 640) {
    super();
    this.width = width;
    this.height = height;
  }

  public generate() {
    return faker.image.image();
  }
}

class CountryField extends Field {
  public generate() {
    return faker.address.country();
  }
}

class CountryCodeField extends Field {
  public generate() {
    return faker.address.countryCode();
  }
}

class StateField extends Field {
  public generate() {
    return faker.address.state();
  }
}

class LocationField extends Field {
  public generate(): [latitude: string, longitude: string] {
    return [faker.address.latitude(), faker.address.longitude()];
  }
}

class FullAddressField extends Field {
  public generate() {
    return faker.address.streetAddress();
  }
}

class NearByField extends Field {
  location: [lat: number, lng: number] | undefined;

  distance: number;

  constructor(location?: [lat: number, lng: number], distance = 5) {
    super();
    this.location = location;
    this.distance = distance;
  }
  public generate() {
    return faker.address.nearbyGPSCoordinate(
      this.location,
      this.distance,
      true
    );
  }
}

const Fields = {
  NameField,
  EmailField,
  PhoneNumberField,
  TextField,
  IDField,
  GenderField,
  SexTypeField,
  AvatarField,
  UsernameField,
  ImageField,
  CountryField,
  CountryCodeField,
  StateField,
  LocationField,
  FullAddressField,
  NearByField,

  Name: new NameField(),
  Email: new EmailField(),
  Avatar: new AvatarField(),
  Gender: new GenderField(),
  UserName: new UsernameField(),
  PhoneNumber: new PhoneNumberField(),
  Text:new TextField(),
  ID: new IDField(),
  SexType: new SexTypeField(),
  Image: new ImageField(),
  Country: new CountryField(),
  CountryCode: new CountryCodeField(),
  State: new StateField(),
  Location: new LocationField(),
  Address: new FullAddressField(),
};

export { Fields, Field };
