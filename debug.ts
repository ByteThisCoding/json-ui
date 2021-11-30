import { JsonStateMachine } from "./src/json-state-machine";

const testStr = `{"a":true}`;
JsonStateMachine.process(testStr);

const tests: [string, boolean][] = [
    //empty objects
    [`{}`, true],
    [` {}`, true],
    [`  {}`, true],
    [` {} `, true],
    [` {}  `, true],
    [`{ }`, true],
    [`{  }`, true],
    [`  { }  `, true],
    //empty arrays
    [`[]`, true],
    [` []`, true],
    [`  []`, true],
    [` [] `, true],
    [` []  `, true],
    [`[ ]`, true],
    [`[  ]`, true],
    [`  [ ]  `, true],
    //single property objects
    [`{"a":true}`, true],
    [`{ "a":true}`, true],
    [`{  "a":true}`, true],
    [`{ "a" :true}`, true],
    [`{ "a"  :true}`, true],
    [`{ "a" : true}`, true],
    [`{ "a" :  true}`, true],
    [`{ "a" :  true }`, true],
    [`{ "a" :  true  }`, true],
    //multi property objects
    [`{"a":true,"b":false,"c":17}`, true],
    [`{
        "a": true,
        "b": false,
        "c": 17
    }`, true],
    [`{
        "something": false,
        "other": true,
        "yes": "no",
        "obj": null,
        "num": 123,
        "decimal": 123.456
    }`, true],
    //nested objects
    [`{
        "a": {
            "b": true,
            "c": 15,
            "d": 17.1
        }
    }`, true],
    [`{
        "a": {
            "b": true,
            "c": 15,
            "d": 17.1
        },
        "e": {
            "f": "something",
            "g": null,
            "h": {
                "i": true
            }
        }
    }`, true],
    //simple arrays
    [`["a", "b", true, 12, 13.1, null, false]`, true],
    [`[1, 2, 3, 4, 5]`, true],
    [`[1 ,2 ,3 ,4 ,5]`, true],
    [`[ 1 , 2 , 3 , 4 , 5 ]`, true],
    //>1d arrays
    [`[1,2,[3,4,5,6],[[4,5]]]`, true],
    [`[1,2,[3,4,5,6],[[4,5]] ]`, true],
    [`[1, 2, [3, 4, 5, 6], [[4, 5]]]`, true],
    //arrays and objects mixed
    [`{
        "a": true,
        "nums": [1, 2, 3.4, 4.5, 6]
    }`, true],
    [`{
        "a": true,
        "nums": [1, 2, 3.4, 4.5, 6],
        "two": {
            "strS": ["a", "bcd", "efg", null]
        }
    }`, true],
    [`[{
        "a": true,
        "b": false
    }, {
        "c": true,
        "d": false
    }]`, true],
    [`[{}]`, true],
    //non closed brackets / braces
    [`[1, 2`, false],
    [`{3, 4`, false],
    [`[{
        "a": true,
        "b": false
    }, {
        "c": true,
        "d": false
    }`, false],
    //duplicate keys in same object
    [`{
        "a": true,
        "a": false
    }`, false],
    [`{
        "a": true,
        "b": {
            "a": false
        }
    }`, true]
];

tests.forEach(([testStr, expectedSuccess]) => {
    const { parseSucceeded, lastCursorPosition, lastLineNumber, lastColumnNumber, nextExpected } = JsonStateMachine.process(testStr);
    console.log(parseSucceeded === expectedSuccess ? "success": "FAILURE : should have been " + expectedSuccess+ ",",
        `last cursor pos: ${lastCursorPosition}: (${testStr.charAt(lastCursorPosition)})`,
        `line: ${lastLineNumber}, col: ${lastColumnNumber}`,
        nextExpected,
        "."+testStr+"."
    );
});