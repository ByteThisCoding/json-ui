export interface iJsonState {
    
    acceptsChar(char: string): boolean;

    getNextStates(): iJsonState[];

    charDesc: string;

}

export interface iJsonObjArStack {

    peek(): string;

    pop(): string;

    push(char: string): void;

    isEmpty(): boolean;

}