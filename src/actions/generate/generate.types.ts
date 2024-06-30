export type GeneratorType = 'component' | 'service' | 'mongo-schema';

export type GenerateActionOptions = {
  type: GeneratorType;
  name: string;
  filePath?: string;
};
