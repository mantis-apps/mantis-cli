# Contributing to Mantis CLI

We would love for you to contribute to Mantis and help make it even better than it is today! As a contributor, here are the guidelines we would like you to follow:

- [Contributing to Mantis CLI](#contributing-to-mantis-cli)
  - [Got a Question or Problem?](#got-a-question-or-problem)
  - [Found a Bug?](#found-a-bug)
  - [Missing a Feature?](#missing-a-feature)
  - [Submission Guidelines](#submission-guidelines)
    - [Submitting an Issue](#submitting-an-issue)
    - [Submitting a Pull Request (PR)](#submitting-a-pull-request-pr)
      - [After your pull request is merged](#after-your-pull-request-is-merged)
  - [Coding Rules](#coding-rules)
  - [Commit Message Guidelines](#commit-message-guidelines)

## Got a Question or Problem?

**Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests.** You've got much better chances of getting your question answered on Stack Overflow where the questions should be tagged with tag mantis-cli.

[Stack Overflow](https://stackoverflow.com/questions/tagged/mantis-cli) is a much better place to ask questions since:

- questions and answers stay available for public viewing so your question / answer might help someone else
- Stack Overflow's voting system assures that the best answers are prominently visible.

To save your and our time, we will systematically close all issues that are requests for general support and redirect people to Stack Overflow.

If you would like to chat about the question in real-time, you can reach out via [our discord channel][discord].

## Found a Bug?

If you find a bug in the source code, you can help us by
[submitting an issue](#submitting-an-issue). Even better, you can [submit a Pull Request](#submitting-a-pull-request-pr) with a fix.

## Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submitting-an-issue) to our GitHub
Repository. If you would like to _implement_ a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

- For a **Major Feature**, first open an issue and outline your proposal so that it can be
  discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
  and help you to craft the change so that it is successfully accepted into the project. For your issue name, please prefix your proposal with `[discussion]`, for example "[discussion]: your feature idea".
- **Small Features** can be crafted and directly [submitted as a Pull Request](#submitting-a-pull-request-pr).

## Submission Guidelines

### Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs we will systematically ask you to provide a minimal reproduction scenario using a repository or [Gist](https://gist.github.com/). Having a live, reproducible scenario gives us wealth of important information without going back & forth to you with additional questions like:

- version of Mantis-CLI-CLI used
- and most importantly - a use-case that fails

Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by filling out our [new issue form](https://github.com/mantis-apps/mantis-cli/issues/new).

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/mantis-apps/mantis-cli/pulls) for an open or closed PR that relates to your submission. You don't want to duplicate effort.
1. Fork the mantis-apps/mantis-cli repo.
1. Get a gpg key to sign your commits, see [help](https://help.github.com/articles/about-gpg/).
1. Create your patch.
1. Commit your changes using a descriptive commit message.

   ```shell
   # Follow the commitizen bot prompts to help you craft a commit message that meets our commit formatting requirements
   git commit
   ```

   - Our commit message guidelines are documented under [Commit Message Guidelines](#commit-message-guidelines).

1. Push your branch to GitHub:

   ```shell
   git push origin my-fix-branch
   ```

   Note: you can use -u to set your branch in upstream and just push for the next times.

1. In GitHub, send a pull request to `mantis-apps/mantis-cli:main`.

- If we suggest changes then:

  - Make the required updates.
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase main -i
    git push -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

- Check out the main branch:

  ```shell
  git checkout main -f
  ```

- Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

- Update your main with the latest upstream version:

  ```shell
  git pull --ff upstream main
  ```

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All code must be formatted with `npm run format:all` (done for you on commit)
- All code must pass linting with `npm run lint:all`

## Commit Message Guidelines

This repo is using [Angular Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format). Please consult the guide for details on these conventions. Your PR might not be accepted if it does not abide by these conventions.

We have very precise rules over how our git commit messages can be formatted. This leads to **more readable messages** that are easy to follow when looking through the **project history**. This also makes **releases automatable** since version bumping is automated from commit messages using [release-it](https://github.com/release-it/release-it).

[discord]: https://discord.gg/624YFphcKp
