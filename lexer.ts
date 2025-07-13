/*
    int main(){
    return 5
}*/

import { log } from "console";

// import { Token } from "typescript";
// Define your own Token type for this lexer
type Token = token;

interface Iregexp {
    regexp: RegExp;
    tokenName: string;
}

let regexpList: Iregexp[];

regexpList = [
    { regexp: /^\s+/, tokenName: "whiteSpaces" },  // ✅ Use + to match one or more whitespace characters
    { regexp: /^\(/, tokenName: "openround" },
    { regexp: /^\)/, tokenName: "closeround" },
    { regexp: /^\{/, tokenName: "openCurly" },
    { regexp: /^\}/, tokenName: "closeCurly" },
    { regexp: /^;/, tokenName: "semicolon" },
    { regexp: /^(int)|(return)/, tokenName: "keyword" },
    { regexp: /^[0-9]+/, tokenName: "numberConst" },
    { regexp: /^[a-zA-Z_'$][a-zA-Z_0-9'$]+/, tokenName: "identifier" },
];

type Identifier = string;
type WhiteSpace = string;  // ✅ Change from " " to string since whitespace can be spaces, tabs, newlines, etc.
type EOF = '<eof>'
type Openround = "(";
type Closeround = ")";
type OpenCurly = "{";
type CloseCurly = "}";
type Semicolon = ";";
type NumberConst = number;

type keyword = "int" | "return";

type token =
    | Tkeyword
    | TWhiteSpace
    | Tidentifier
    | Topenround
    | Tcloseround
    | TopenCurly
    | TcloseCurly
    | Tsemicolon
    | TnumberConst
    | Teof;

interface TWhiteSpace {
    tag: string;
    contents?: WhiteSpace;
}

interface Tidentifier {
    tag: string;
    contents?: Identifier;
}

interface Tkeyword {
    tag: string;
    contents?: keyword;
}

interface Topenround {
    tag: string;
    contents?: Openround;
}

interface Tcloseround {
    tag: string;
    contents?: Closeround;
}

interface TcloseCurly {
    tag: string;
    contents?: CloseCurly;
}

interface TopenCurly {
    tag: string;
    contents?: OpenCurly;
}

interface Tsemicolon {
    tag: string;
    contents?: Semicolon;
}

interface TnumberConst {
    tag: string;
    contents?: NumberConst;
}

interface Teof {
    tag: string;
    contents?: EOF;
}

let keyword: (arg: string) => Tkeyword;
let whiteSpace: (arg: string) => TWhiteSpace;  // ✅ Accept the matched whitespace string
let identifier: (arg: string) => Tidentifier;
let openround: () => Topenround;
let closeround: () => Tcloseround;
let openCurly: () => TopenCurly;
let closeCurly: () => TcloseCurly;
let semicolon: () => Tsemicolon;
let numberConst: (arg: number) => TnumberConst;
let eof: () => Teof;

keyword = (arg: string): Tkeyword => ({
    tag: "keyword",
    contents: arg as keyword,
});

whiteSpace = (arg: string): TWhiteSpace => ({  // ✅ Accept the matched whitespace string
    tag: "whiteSpace",
    contents: arg as WhiteSpace,  // ✅ Store the actual whitespace matched
});

identifier = (arg: string): Tidentifier => ({
    tag: "identifier",
    contents: arg as Identifier,
});

openround = (): Topenround => ({
    tag: "openround",
    contents: undefined as unknown as Openround,
});

closeround = (): Tcloseround => ({
    tag: "closeround",
    contents: undefined as unknown as Closeround,
});

openCurly = (): TopenCurly => ({
    tag: "openCurly",
    contents: undefined as unknown as OpenCurly,
});

closeCurly = (): TcloseCurly => ({
    tag: "closeCurly",
    contents: undefined as unknown as CloseCurly,
});

semicolon = (): Tsemicolon => ({
    tag: "semicolon",
    contents: undefined as unknown as Semicolon,
});

numberConst = (arg: number): TnumberConst => ({
    tag: "numberConst",
    contents: arg as NumberConst,
});

eof = (): Teof => ({
    tag: '<eof>',
    contents: undefined as unknown as EOF,
});

interface Ilexer {
    constructor: Function;
    lex: () => void;
    input: string;
    token?: Token;
}

export default class Lexer implements Ilexer {
    public input: string;
    public token!: Token;
    constructor(str: string) {
        this.input = str;

        this.lex();
        return this;
    }

    public lex() {
        // ✅ Remove trim() since we're now handling whitespace as tokens
        let regexp: RegExp;
        let tokenName: string;
        let entry: Iregexp | undefined;
        let input: string = this.input;
        let matchArr: RegExpMatchArray | null;
        let token: Token | null;
        let temp: string | null;
        let numConst: number | null;

        input = this.input;

        if(!input.length){
             this.token = eof();
             return void 0;
        }

        entry = regexpList.find((x: Iregexp): boolean =>
            new RegExp(`^${x.regexp.source}`).test(input)
        );

        if (!entry) {
            throw new Error("parser error");
        }

        regexp = new RegExp(`^${entry.regexp.source}`);
        tokenName = entry.tokenName;
        matchArr = input.match(regexp) as RegExpMatchArray;
        //    console.log('matchArr: ', matchArr);

        const matchedString = matchArr[0];
        input = input.substring(matchedString.length);

        token = null;
        switch (tokenName) {
            case "whiteSpaces":
                temp = matchArr[0];  // ✅ Get the matched whitespace
                token = whiteSpace(temp);  // ✅ Pass it to the function
                break;
            case "openround":
                token = openround();
                break;
            case "closeround":
                token = closeround();
                break;
            case "openCurly":
                token = openCurly();
                break;
            case "closeCurly":
                token = closeCurly();
                break;
            case "semicolon":
                token = semicolon();
                break;
            case "identifier":
                temp = matchArr[0];
                token = identifier(temp);
                break;
            case "keyword":
                temp = matchArr[0];
                token = keyword(temp);
                break;
            case "numberConst":
                temp = matchArr[0];
                numConst = Number.parseInt(temp);
                token = numberConst(numConst);
                break;
            default:
                throw new Error("parser error");
        }

        if (!token) {
            throw new Error("parser error");
        }

        this.input = input;
        this.token = token;

        return 0;
    }
}

// export Lexer;
// export { eof}