import { BaseState, JsonState, SimpleMultiState, SimpleSingleState, WhitespaceState } from "./base-states";

export function createCommonStates(): {
    commaState: BaseState;
    //null states
    nullNState: BaseState;
    nullUState: BaseState;
    nullLOneState: BaseState;
    nullLTwoState: BaseState;
    //true states
    trueTState: BaseState;
    trueRState: BaseState;
    trueUState: BaseState;
    trueEState: BaseState;
    //false states
    falseFState: BaseState;
    falseAState: BaseState;
    falseLState: BaseState;
    falseSState: BaseState;
    falseEState: BaseState;
    //number states
    numberIntState: BaseState;
    numberPeriodState: BaseState;
    numberDecimalState: BaseState;
    //string states
    doubleQuoteOpenState: BaseState;
    nonEscapedCharState: BaseState;
    escapedCharState: BaseState;
    doubleQuoteCloseState: BaseState;
    //whitespace state
    whitespaceState: BaseState;
} {
    //whitespace state
    const whitespaceState = new WhitespaceState();

    //comma state
    const commaState = new SimpleSingleState(",");

    //null states
    const nullNState = new SimpleSingleState("n");
    const nullUState = new SimpleSingleState("u");
    const nullLOneState = new SimpleSingleState("l");
    const nullLTwoState = new SimpleSingleState("l");
    nullNState.addNextState(nullUState);
    nullUState.addNextState(nullLOneState);
    nullLOneState.addNextState(nullLTwoState);
    /*nullLTwoState.addNextStates([
        whitespaceState,
        commaState
    ]);*/

    //true states
    const trueTState = new SimpleSingleState("t");
    const trueRState = new SimpleSingleState("r");
    const trueUState = new SimpleSingleState("u");
    const trueEState = new SimpleSingleState("e");
    trueTState.addNextState(trueRState);
    trueRState.addNextState(trueUState);
    trueUState.addNextState(trueEState);
    /*trueEState.addNextStates([
        whitespaceState,
        commaState
    ]);*/

    //false states
    const falseFState = new SimpleSingleState("f");
    const falseAState = new SimpleSingleState("a");
    const falseLState = new SimpleSingleState("l");
    const falseSState = new SimpleSingleState("s");
    const falseEState = new SimpleSingleState("e");
    falseFState.addNextState(falseAState);
    falseAState.addNextState(falseLState);
    falseLState.addNextState(falseSState);
    falseSState.addNextState(falseEState);
    /*falseEState.addNextStates([
        whitespaceState,
        commaState
    ]);*/

    //number states
    const nums = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    const numberIntState = new SimpleMultiState(nums);
    const numberPeriodState = new SimpleSingleState(".");
    const numberDecimalState = new SimpleMultiState(nums);
    numberIntState.addNextStates([numberIntState, numberPeriodState/*, commaState*/]);
    numberPeriodState.addNextState(numberDecimalState);
    numberDecimalState.addNextStates([numberDecimalState/*, commaState, whitespaceState*/]);

    //string states
    const doubleQuoteOpenState = new SimpleSingleState('"');
    const nonEscapedCharState = new JsonState(char => char !== '\\', "non expaced character");
    const escapedCharState = new JsonState(char => true, "escape character");
    const doubleQuoteCloseState = new SimpleSingleState('"');

    doubleQuoteOpenState.addNextStates([
        nonEscapedCharState,
        doubleQuoteCloseState   
    ]);
    nonEscapedCharState.addNextStates([
        nonEscapedCharState,
        doubleQuoteCloseState
    ]);
    nonEscapedCharState.addNextState(escapedCharState);
    //doubleQuoteCloseState.addNextStates([commaState, whitespaceState]);

    return {
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
        //whitespace
        whitespaceState
    };
}