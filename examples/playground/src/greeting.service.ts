import {inject, Injectable} from "@pleton/core";
import {NameService} from "./name.service";

@Injectable
export class GreetingService {
  private nameSvc = inject(NameService)!;

  public getGreeting(name: string, age: number) {
    return `Hello, ${name}! You are ${age} years old!`
  }
}