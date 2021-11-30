import { iJsonState } from "./models/json-state";
import { JsonObjArStack } from "./stack/obj-ar-stack";
import { createJsonStates } from "./states/json-states";

const { entryState } = createJsonStates();

export class JsonStateMachine {

    private static entryState: iJsonState = entryState;

    static process(json: string): {
        parseSucceeded: boolean;
        lastCursorPosition: number;
        lastLineNumber: number;
        lastColumnNumber: number;
        nextExpected: string[];
        unexpected: boolean;
    } {
        let parseSucceeded = true;
        let prevState = this.entryState;
        let i: number;
        let lastLineNumber = 1;
        let lastColumnNumber = 0;
        let nextExpected: string[] = [];
        let unexpected = false;

        const objArStack = new JsonObjArStack();

        for (i=0; parseSucceeded && i<json.length; i++) {
            const char = json.charAt(i);
            
            //keep track of line and col
            switch (char) {
                case "\n":
                    lastLineNumber ++;
                    lastColumnNumber = 0;
                    break;
                case "{":
                    objArStack.push("{");
                    break;
                case "[":
                    objArStack.push("[");
                    break;
                case "}":
                    if (objArStack.peek() !== "{") {
                        unexpected = true;
                        parseSucceeded = false;
                    } else {
                        objArStack.pop();
                    }
                    break;
                case "]": 
                    if (objArStack.peek() !== "[") {
                        unexpected = true;
                        parseSucceeded = false;
                    } else {
                        objArStack.pop();
                    }
                    break;
            }
            lastColumnNumber ++;

            //determine the next state
            const nextState = this.getNextState(prevState, char);
            /*console.log({
                i,
                char: `(${char})`,
                prevState,
                nextState
            });*/
            if (!Array.isArray(nextState)) {
                prevState = nextState;
            } else if (i<json.length - 1) {
                parseSucceeded = false;
                nextExpected = nextState;
            }
        }

        if (!objArStack.isEmpty()) {
            parseSucceeded = false;
            const prev = objArStack.peek();
            const next = prev === "{" ? "}" : "]";
            nextExpected = [next];
        }

        return {
            parseSucceeded,
            lastCursorPosition: i - 1,
            lastLineNumber,
            lastColumnNumber,
            nextExpected,
            unexpected
        };
    }

    private static getNextState(prevState: iJsonState, char: string): iJsonState | string[] {
        const nextStates = prevState.getNextStates();
        for (const nextState of nextStates) {
            if (nextState.acceptsChar(char)) {
                return nextState;
            }
        }

        //this will only happen 0 to 1 times, so extracting for efficiency
        const nextExpected: string[] = [];
        for (const nextState of nextStates) {
            nextExpected.push(nextState.charDesc)
        };
        return nextExpected;
    }

}