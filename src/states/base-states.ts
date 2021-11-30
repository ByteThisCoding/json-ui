import { iJsonState } from "../models/json-state";

export abstract class BaseState implements iJsonState {
    abstract charDesc: string;
 
    private nextStates: iJsonState[] = [];

    abstract acceptsChar(char: string): boolean;

    getNextStates(): iJsonState[] {
        return this.nextStates;
    }

    addNextState(state: iJsonState): void {
        this.nextStates.push(state);
    }

    addNextStates(states: iJsonState[]): void {
        states.forEach(state => this.nextStates.push(state));
    }
}

export class SimpleSingleState extends BaseState {

    charDesc = this.char;

    constructor(
        private char: string
    ) {
        super();
    }

    acceptsChar(char: string): boolean {
        return char === this.char;
    }

}

export class SimpleMultiState extends BaseState {

    charDesc = "";

    constructor(
        private acceptChars: Set<string>
    ) {
        super();
        this.acceptChars.forEach(char => {
            this.charDesc += "," + char
        });
        this.charDesc = this.charDesc.substring(1);
    }

    acceptsChar(char: string): boolean {
        return this.acceptChars.has(char);
    }
}

export class JsonState extends BaseState {

    constructor(public acceptsChar: (char: string) => boolean, public charDesc: string) {
        super();
    }

}

export class WhitespaceState extends JsonState {
    constructor() {
        super(char => !!/\s/.test(char), "whitespace");
    }
}