import { iJsonObjArStack, iJsonState } from "../models/json-state";
import { createArrayStates } from "./array-states";
import { JsonState, SimpleSingleState, WhitespaceState } from "./base-states";
import { createObjectStates } from "./object-states";

export function createJsonStates(): {entryState: iJsonState} {

    const {
        arOpenState,
        arCloseState,
        arCommaState
    } = createArrayStates();

    const {
        objOpenState,
        objCloseState,
        objCommaState
    } = createObjectStates();

    const openWhitespaceState = new WhitespaceState();
    const closeWhitespaceState = new WhitespaceState();

    const entryState = new SimpleSingleState("");
    entryState.addNextStates([
        arOpenState,
        objOpenState,
        openWhitespaceState
    ]);

    openWhitespaceState.addNextStates([
        arOpenState,
        objOpenState,
        openWhitespaceState
    ]);

    const jsonComma = new SimpleSingleState(",");
    jsonComma.addNextStates([
        objOpenState,
        arOpenState,
        openWhitespaceState
    ]);

    arCloseState.addNextStates([
        jsonComma,
        closeWhitespaceState,
    ]);

    objCloseState.addNextStates([
        jsonComma,
        closeWhitespaceState
    ]);

    arOpenState.addNextState(objOpenState);

    return {
        entryState
    }

}