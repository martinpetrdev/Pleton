import {inject, Injectable} from "@pleton/core";
import {NameService} from "./name.service";

@Injectable
export class GreetingService {
  private nameSvc = inject(NameService)!;

  public getGreeting() {
    const name = this.nameSvc.getName();

    return `Hello, ${name}!`
  }
}