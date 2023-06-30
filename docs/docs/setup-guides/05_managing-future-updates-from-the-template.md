---
sidebar_label: Merge Future Updates
sidebar_position: 5
title: Merge Future Updates
---

# Manging future updates from the template

As outlined on [github docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), when creating a new repository from a template, you will be creating a repositroy with no history. One of the benefits of using the template this way instead of forking is that you can make it private.

This means however, if you later want to take updates it can be difficult, but there is a solution.  You can [attach the orignal history](#adding-history-to-your-repository) back into your clone meaning you can then [take future updates](#taking-future-updates-from-the-template) with ease.


Time to complete: _~10 minutes_

### Adding history to your repository

 You can do this with the following commands on your clone repository. Note, this is simplest to do when first creating your repo but can be done at any time, if doing at a later date BE CAREFUL as this will have downstream challanges with any branches you've created which will also have to be resolved.

```bash
git remote add upstream https://github.com/twilio-professional-services/flex-project-template.git
git fetch upstream
git rebase --onto <commit-id-from-template-when-cloning> <initial-commit-id-of-cloned-template> <branch-name>
```

where commit id from the template can be found by clicking on the commmit history

![alt text](/img/guides/get-repository-commit-id-01.png)

then clicking copy on the copy-id button of the commit

![alt text](/img/guides/get-repository-commit-id-02.png)

Similarly, the initial commit of the cloned template can be found in the same way.

Finally `branch-name` can be main or an alternative branch name if you are performing the operation there instead.

You then need to push this rebased history onto your branch

```bash
git push --force
```

And thats it, your repo now has the history!

### Taking future updates from the template

At a future date, you may want to grab the updates on the original template if you have added the history as mentioned above you can do this with the following commands

```bash
git checkout -b template-updates
git remote add flex-template https://github.com/twilio-professional-services/flex-project-template.git
git pull flex-template main --no-ff
```

this will grab all the updates from the original template and apply them to your branch. You will of course have to manage any conflicts but if you have added the history correctly, this shouldnt be too complex. From here you can merge the changes into your parent branch as you see fit.
