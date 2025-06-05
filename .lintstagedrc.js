module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
    'jest --bail --findRelatedTests',
  ],
  
  // JSON files
  '*.json': ['prettier --write'],
  
  // Markdown files
  '*.md': ['prettier --write'],
  
  // CSS files
  '*.{css,scss}': ['prettier --write'],
  
  // Check TypeScript types
  '**/*.ts?(x)': () => 'tsc --noEmit',
};