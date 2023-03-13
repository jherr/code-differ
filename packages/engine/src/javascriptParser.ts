import { Token } from "./types";
import { parse } from "@babel/parser";

const KEYWORDS = [
  "abstract",
  "arguments",
  "await",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
];

const mapLabel = (label: string) => {
  switch (label) {
    case "jsxTagStart":
      return "<";
    case "jsxTagEnd":
      return ">";
    case "eof":
      return "";
    default:
      return label;
  }
};

type RegExpToken = { flags: string; pattern: string };

const mapValue = (value: string | RegExpToken, label: string): string => {
  if (label === "string") {
    return `"${value}"`;
  } else if (label === "regexp") {
    return `/${(value as RegExpToken).pattern}/${(value as RegExpToken).flags}`;
  } else if (label === "jsxText") {
    return value as string;
  } else if (label === "CommentBlock") {
    return `/* ${value} */`;
  } else if (label === "CommentLine") {
    return `// ${value}`;
  } else {
    return (value as string) ?? mapLabel(label);
  }
};

const mapClassName = (token: Token) => {
  const elements: string[] = [];

  if (token.type.keyword) {
    elements.push("keyword");
    elements.push(`keyword-${token.type.keyword}`);
  }
  if (token.type.label === "CommentBlock") {
    elements.push("comment");
  }
  if (token.type.label === "CommentLine") {
    elements.push("comment");
  }
  if (token.type.label === "jsxTagStart" || token.type.label === "jsxTagEnd") {
    elements.push("jsx-tag");
  }
  if (token.type.label === "jsxText") {
    elements.push("jsx-text");
  }
  if (token.type.label === "string") {
    elements.push("string");
  }
  if (token.type.label === "num") {
    elements.push("number");
  }
  if (token.type.label === "name") {
    elements.push("name");
  }
  if (token.type.label === "jsxName") {
    elements.push("jsx-name");
  }
  if (["(", ")", "[", "]", "{", "}"].includes(token.value)) {
    elements.push("block");
  }
  if (
    ["=", "+", "-", "*", "!", "<", ">", "&", "|"].includes(token.value) ||
    token.type.binop
  ) {
    elements.push("operator");
  }
  if (
    ["==", "!=", "<=", ">=", "&&", "||", "===", "!=="].includes(token.value)
  ) {
    elements.push("operator");
    elements.push("operator-comparison");
  }

  return elements.join(" ");
};

const theme = (token: Token) => {
  const value = mapValue(
    token.value,
    token.type.label || (token.type as unknown as string)
  );
  const classes = mapClassName(token).split(" ");

  let color = [255, 255, 255];
  if (classes.includes("keyword")) color = [20, 158, 254];
  if (classes.includes("string")) color = [156, 227, 111];
  if (classes.includes("jsx-tag")) color = [255, 255, 255];
  if (classes.includes("number")) color = [254, 164, 111];
  if (classes.includes("jsx-name")) color = [252, 96, 100];
  if (classes.includes("name")) color = [254, 212, 132]; // 131, 126, 255
  if (classes.includes("operator")) color = [252, 96, 100];

  let italic = KEYWORDS.includes(value as string);

  return {
    italic,
    color,
  };
};

// Sometimes the parser returns text tokens that have whitespace at the start with spaces and returns, we need to fix that
// by trimming it down to the actual token value and updating the location
const breakBigTextTokens = (token: Token): Token[] => {
  token.value = token.value?.trimEnd?.() ?? token.value;
  if (token.value.match?.(/^(\s*)/) || token.value.match?.(/\n/)) {
    const newTokens: Token[] = [];
    let startColumn = token.loc.start.column;
    let startLine = token.loc.start.line;
    let column = token.loc.start.column;
    let line = token.loc.start.line;
    let textBlock = "";
    const addToken = () => {
      const whiteSpaceCount = textBlock.match(/^(\s*)/)?.[1]?.length ?? 0;
      newTokens.push({
        ...token,
        loc: {
          start: {
            column: startColumn + whiteSpaceCount,
            line: startLine,
          },
          end: {
            column,
            line,
          },
        },
        value: textBlock.trim(),
      });
      textBlock = "";
    };
    for (const ch of token.value.split("")) {
      if (ch === "\n") {
        addToken();
        line++;
        startColumn = 0;
        startLine = line;
        column = 0;
      } else {
        textBlock += ch;
        column++;
      }
    }
    addToken();
    return newTokens;
  }
  return [token];
};

const parseToTokens = (blocks: string[]): Token[][] => {
  return blocks.map((block) => {
    try {
      const data = parse(block, {
        // @ts-ignore
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
          "@babel/preset-react",
        ],
        plugins: ["jsx", "typescript", "optionalChaining", "asyncGenerators"],
        sourceType: "module",
        errorRecovery: true,
        tokens: true,
      });
      return (data.tokens as Token[])
        .map((t) =>
          breakBigTextTokens({
            ...t,
            ...theme(t),
            value: mapValue(
              t.value,
              t.type.label || (t.type as unknown as string)
            ),
            className: mapClassName(t),
          })
        )
        .flat();
    } catch (e) {
      throw e;
    }
  });
};

export default parseToTokens;
