# Mantis CLI

M.A.N.T.I.S (MongoDB, Angular, NestJS, Tailwind CSS, Ionic, Storybook) is not just a CLI tool; it's your passport to a seamless full-stack project launch.

This repo contains the cli source code to generate template projects.

## Setup

Run `npm install` to install all of the dependencies.

## Developing

Run `npm run start:dev` to build and run the cli.

To run a built cli, run `npx mantis <arguments>` e.g. `npx mantis init`.

## Building

Run `npm run build` to build the cli.

## Commands

### `init`

`npx mantis init`: Scaffolds a basic mantis application.

**TEMPORARY**: DB setup

In order for the generated project to work properly with a database, you'll need to put a `.env.local` file with database credentials at `templates/mantis-todo/apps/server/.env.local`. This will be automated in the future.

```shell
# Example
MONGODB_URI='mongodb+srv://<user>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority'
```
