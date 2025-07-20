---
sidebar_label: Merge future updates
title: Merging future template updates
---

As outlined on [GitHub docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), when creating a new repository from a template, you will be creating a repository with no history. One of the benefits of using the template this way instead of forking is that you can make it private.

This means, however, if you later want to take updates it can be difficult, but there is a solution.  You can [attach the original history](#adding-history-to-your-repository) back into your clone, meaning you can then [take future updates](#taking-future-updates-from-the-template) with ease.


Time to complete: _~10 minutes_

## Pre-requisite: Add upstream remote

Before either of the following sections may be completed, you will need to add the upstream remote to your local repository by running this command:

```bash
git remote add upstream https://github.com/twilio-professional-services/flex-project-template.git
```

## Adding history to your repository

:::info Note
This is simplest to do when first creating your repo, but can be done at any time. If doing at a later date, **be careful** as this will have downstream challenges with any branches you've created, which will also have to be resolved.

:::

First, fetch from upstream:

```bash
git fetch upstream
```

Then, use the following command to rebase your repository onto the upstream history:

```bash
git rebase --onto <commit-id-from-template-when-cloning> <initial-commit-id-of-cloned-template> <branch-name>
```

where `<commit-id-from-template-when-cloning>` can be found by clicking on the commit history

![alt text](/img/guides/get-repository-commit-id-01.png)

then clicking copy on the copy-id button of the commit

![alt text](/img/guides/get-repository-commit-id-02.png)

Similarly, `<initial-commit-id-of-cloned-template>` can be found in the same way.

Finally, `<branch-name>` can be `main` or an alternative branch name if you are performing the operation there instead.

You then need to push this rebased history onto your branch

```bash
git push --force
```

And that's it, your repo now has the history!

## Taking future updates from the template

At a future date, you may want to grab the updates made to the original template. If you have added the history as mentioned above, you can do this with the following commands:

```bash
git checkout -b template-updates
git pull upstream main --no-ff
```

This will grab all the updates from the original template and apply them to your branch. You will of course have to manage any conflicts, but if you have added the history correctly, this shouldn't be too complex. From here you can merge the changes into your parent branch as you see fit.
