import { iJsonObjArStack, iJsonState } from "../models/json-state";
import { BaseState, JsonState, SimpleSingleState, WhitespaceState } from "./base-states";
import { createCommonStates } from "./common-states";

export function createObjectStates(): {
    objOpenState: BaseState;
    objCloseState: BaseState;
    objCommaState: BaseState;
} {

    const {
        commaState,
        //null states
        nullNState,
        nullUState,
        nullLOneState,
        nullLTwoState,
        //true states
        trueTState,
        trueRState,
        trueUState,
        trueEState,
        //false states
        falseFState,
        falseAState,
        falseLState,
        falseSState,
        falseEState,
        //number states
        numberIntState,
        numberPeriodState,
        numberDecimalState,
        //string states
        doubleQuoteOpenState,
        nonEscapedCharState,
        escapedCharState,
        doubleQuoteCloseState,
        whitespaceState
    } = createCommonStates();

    const objOpenState = new SimpleSingleState("{");
    const objCloseState = new SimpleSingleState("}");

    const objOpenWhitespaceState = new WhitespaceState();

    const keyOpenState = new SimpleSingleState('"');
    const keyNonEscapedCharState = new JsonState(char => char !== '\\', "non escaped character");
    const keyEscapedCharState = new JsonState(char => true, "escaped character");
    const keyCloseState = new SimpleSingleState('"');
    const keyColonState = new SimpleSingleState(":");

    const objKeyCloseWhitespaceState = new WhitespaceState();
    const objKeyColonWhitespaceState = new WhitespaceState();

    const objPropertyCloseWhitespaceState = new WhitespaceState();
    const objAfterCommaWhitespace = new WhitespaceState();

    //add wiring
    objOpenState.addNextStates([
        objCloseState,
        objOpenWhitespaceState,
        keyOpenState
    ]);

    objOpenWhitespaceState.addNextStates([
        objCloseState,
        objOpenWhitespaceState,
        keyOpenState
    ]);

    keyOpenState.addNextStates([
        keyNonEscapedCharState,
        keyCloseState
    ]);

    keyNonEscapedCharState.addNextStates([
        keyCloseState,
        keyEscapedCharState,
    ]);

    keyEscapedCharState.addNextState(keyNonEscapedCharState);

    keyCloseState.addNextStates([
        objKeyCloseWhitespaceState,
        keyColonState
    ]);
    objKeyCloseWhitespaceState.addNextStates([
        objKeyCloseWhitespaceState,
        keyColonState
    ]);

    keyColonState.addNextStates([
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        objKeyColonWhitespaceState,
        objOpenState
    ]);

    objKeyColonWhitespaceState.addNextStates([
        objKeyColonWhitespaceState,
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        objOpenState
    ]);

    commaState.addNextStates([
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        objAfterCommaWhitespace
    ]);
    objAfterCommaWhitespace.addNextStates([
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        objAfterCommaWhitespace
    ]);

    objPropertyCloseWhitespaceState.addNextStates([
        objPropertyCloseWhitespaceState,
        objCloseState,
        commaState
    ]);

    nullLTwoState.addNextStates([objPropertyCloseWhitespaceState, commaState, objCloseState]);
    trueEState.addNextStates([objPropertyCloseWhitespaceState, commaState, objCloseState]);
    falseEState.addNextStates([objPropertyCloseWhitespaceState, commaState, objCloseState]);
    numberIntState.addNextStates([objPropertyCloseWhitespaceState, commaState, objCloseState]);
    numberDecimalState.addNextStates([objPropertyCloseWhitespaceState, commaState, objCloseState]);
    doubleQuoteCloseState.addNextStates([objPropertyCloseWhitespaceState, commaState, objCloseState]);

    return {
        objOpenState,
        objCloseState,
        objCommaState: commaState
    }

}