import {Injectable} from "@pleton/core";

@Injectable
export class NameService {
  public getName() {
    return "Martin";
  }
}