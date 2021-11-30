import { BaseState, JsonState, SimpleSingleState, WhitespaceState } from "./base-states";
import { createCommonStates } from "./common-states";

export function createArrayStates(): {
    arOpenState: BaseState;
    arCloseState: BaseState;
    arCommaState: BaseState;
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

    const arOpenState = new SimpleSingleState("[");
    const arCloseState = new SimpleSingleState("]");

    const arWhitespaceAfterValueState = new WhitespaceState();
    const arWhitespaceAfterValueCommaState = new WhitespaceState();

    const arOpenWhitespaceState = new WhitespaceState();
    arOpenWhitespaceState.addNextStates([
        arCloseState,
        arOpenWhitespaceState,
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        arOpenState
    ]);

    arOpenState.addNextStates([
        arCloseState,
        arOpenWhitespaceState,
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        arOpenState
    ]);

    commaState.addNextStates([
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        arWhitespaceAfterValueCommaState,
        arOpenState
    ]);

    arWhitespaceAfterValueCommaState.addNextStates([
        nullNState,
        trueTState,
        falseFState,
        numberIntState,
        doubleQuoteOpenState,
        arWhitespaceAfterValueCommaState,
        arOpenState
    ]);

    arWhitespaceAfterValueState.addNextStates([
        arWhitespaceAfterValueState,
        commaState,
        arCloseState
    ]);

    arCloseState.addNextState(arCloseState);

    nullLTwoState.addNextStates([commaState, arCloseState, arWhitespaceAfterValueState]);
    trueEState.addNextStates([commaState, arCloseState, arWhitespaceAfterValueState]);
    falseEState.addNextStates([arCloseState, commaState, arWhitespaceAfterValueState]);
    numberIntState.addNextStates([commaState, arCloseState, arWhitespaceAfterValueState]);
    numberDecimalState.addNextStates([commaState, arCloseState, arWhitespaceAfterValueState]);
    doubleQuoteCloseState.addNextStates([commaState, arCloseState, arWhitespaceAfterValueState]);

    return {
        arOpenState,
        arCloseState,
        arCommaState: commaState
    };
}