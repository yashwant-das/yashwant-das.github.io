import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('data/schema.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));

const validate = ajv.compile(schema);
if (!validate(data)) {
  console.error('Schema validation failed:');
  console.error(validate.errors);
  process.exit(1);
}

// Rules JSON Schema can't express: toolbox names are unique and every item
// belongs to a declared group.
const problems = [];
if (data.toolbox) {
  const groupIds = new Set(data.toolbox.groups.map((g) => g.id));
  const seen = new Set();
  for (const item of data.toolbox.items) {
    if (!groupIds.has(item.group)) {
      problems.push(`toolbox item "${item.name}" uses unknown group "${item.group}"`);
    }
    if (seen.has(item.name)) {
      problems.push(`toolbox item "${item.name}" is listed twice`);
    }
    seen.add(item.name);
  }
}

if (problems.length > 0) {
  console.error('Content validation failed:');
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

console.log('data/content.json valid');
