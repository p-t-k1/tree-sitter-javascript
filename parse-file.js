#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-javascript');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npm run parse -- <path-to-file>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

const outputDir = path.join(__dirname, 'parse_results');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function formatAST(ast, indent = 0) {
  const spaces = '  '.repeat(indent);
  let result = '';
  let depth = 0;
  
  for (let i = 0; i < ast.length; i++) {
    const char = ast[i];
    
    if (char === '(') {
      result += char + '\n' + '  '.repeat(depth + 1);
      depth++;
    } else if (char === ')') {
      depth--;
      result += '\n' + '  '.repeat(depth) + char;
    } else if (char === ' ' && ast[i - 1] !== '\n') {
      result += '\n' + '  '.repeat(depth);
      while (i < ast.length && ast[i] === ' ') i++;
      i--;
    } else {
      result += char;
    }
  }
  
  return result;
}

try {
  const parser = new Parser();
  parser.setLanguage(JavaScript);

  const code = fs.readFileSync(filePath, 'utf8');
  const tree = parser.parse(code);

  const fileName = path.basename(filePath, path.extname(filePath));
  const outputFile = path.join(outputDir, `${fileName}.txt`);

  const astString = tree.rootNode.toString();
  const formattedAST = formatAST(astString);
  const result = `File: ${filePath}\nParsed at: ${new Date().toISOString()}\n\n${formattedAST}`;

  fs.writeFileSync(outputFile, result, 'utf8');

  console.log(`✓ Parsed: ${filePath}`);
  console.log(`✓ Saved to: ${outputFile}`);
} catch (error) {
  console.error('Parse error:', error.message);
  process.exit(1);
}
