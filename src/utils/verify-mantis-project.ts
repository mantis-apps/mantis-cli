import fs from 'fs-extra';
import Joi from 'joi';

export const verifyMantisProject = () => {
  // check if mantis.json exists
  if (!fs.existsSync('mantis.json')) {
    throw new Error('Mantis project not found');
  }
  // check if mantis.json is valid
  const mantisTxt = fs.readFileSync('mantis.json', 'utf8');
  let mantisJson;
  try {
    mantisJson = JSON.parse(mantisTxt);
  } catch (error) {
    throw new Error('Mantis project is not valid');
  }
  const mantisJsonSchema = Joi.object({
    name: Joi.string().required(),
    version: Joi.string().required(),
    workspace: Joi.array().items(Joi.string()).required(),
    description: Joi.string().optional(),
    packageManager: Joi.string().required(),
  });
  const result = mantisJsonSchema.validate(mantisJson);
  if (result.error) {
    throw new Error('Mantis project is not valid');
  }
};
