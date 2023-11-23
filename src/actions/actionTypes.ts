export type ActionFunction = () => any;

export interface ActionFile {
    [key: string]: ActionFunction
}

