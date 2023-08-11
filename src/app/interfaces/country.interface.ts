import { LocaleDefinition } from "@faker-js/faker/definitions/definitions";

export interface ICountry {
  name: string;
  alternativeNames: string[];
  locale: LocaleDefinition[];
}
