import { iJsonObjArStack } from "../models/json-state";

export class JsonObjArStack implements iJsonObjArStack {

    private stack: string[] = [];

    peek(): string {
        return this.isEmpty() ? "" : this.stack[this.stack.length - 1];
    }

    pop(): string {
        return this.stack.pop()!;
    }

    push(char: string): void {
        this.stack.push(char);
    }

    isEmpty(): boolean {
        return this.stack.length === 0;
    }
    
}