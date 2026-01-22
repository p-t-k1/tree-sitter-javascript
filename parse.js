// parse.js
const fs = require('fs');
const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-javascript');

const parser = new Parser();
parser.setLanguage(JavaScript);

const code = fs.readFileSync('./example.js', 'utf8');
const tree = parser.parse(code);

console.log('Parsed AST:');
console.log(tree.rootNode.toString());
