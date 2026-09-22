import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('data/schema.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error('Schema validation failed:');
  console.error(validate.errors);
  process.exit(1);
} else {
  console.log('data/content.json valid');
  process.exit(0);
}
