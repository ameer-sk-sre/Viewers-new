# Git Debugging Reference

This document summarizes the Git recovery and verification steps used during the commit failure investigation.

## 1. Confirm the repository root

If commands are being run from the wrong directory, Git will report `not a git repository`.

```bash
pwd
ls -la
ls -la .git
```

Use an explicit repository path when needed:

```bash
git -C /Users/macbook/Downloads/new_viewers/Viewers-new status --short --untracked-files=no
```

## 2. Check whether HEAD is valid

A broken `HEAD` can cause commit failures even when the working tree looks normal.

```bash
cat .git/HEAD
git cat-file -t HEAD
```

If `HEAD` points to a missing ref, restore it to a valid branch:

```bash
git symbolic-ref HEAD refs/heads/master
```

Verify the current branch:

```bash
git rev-parse --abbrev-ref HEAD
```

## 3. Recreate the same issue (for practice or documentation)

These commands reproduce the exact failure mode that was observed.

```bash
# 1. Confirm the repository is at the expected root
cd /Users/macbook/Downloads/new_viewers/Viewers-new

# 2. Observe the bad HEAD state
cat .git/HEAD

git show-ref --heads

git rev-parse --verify refs/heads/main || true

# 3. Inspect the tracked file that later fails during commit
git ls-files --stage extensions/default/src/Toolbar/ToolButtonWrapper.tsx

git cat-file -t 16b38b34c60ba07132be2ce8d642a56c9521dce0 || true

# 4. Attempt the commit to reproduce the error
git commit -m "after customizing dockerfile and viewer"
```

The expected failure is:

```text
error: invalid object 100644 16b38b34c60ba07132be2ce8d642a56c9521dce0 for 'extensions/default/src/Toolbar/ToolButtonWrapper.tsx'
error: invalid object 100644 16b38b34c60ba07132be2ce8d642a56c9521dce0 for 'extensions/default/src/Toolbar/ToolButtonWrapper.tsx'
error: Error building trees
```

## 4. Check whether the branch ref exists

```bash
git show-ref --heads
git branch -a
git rev-parse --verify refs/heads/master
```

If `refs/heads/main` is missing, prefer a valid existing branch such as `master`.

## 5. Inspect the file that failed in the index

When Git reports an invalid object for a tracked file, confirm that the file exists and that the blob hash is valid.

```bash
git ls-files --stage extensions/default/src/Toolbar/ToolButtonWrapper.tsx

# Check whether the file exists
ls extensions/default/src/Toolbar/ToolButtonWrapper.tsx

# Check whether the blob exists in the object database
git cat-file -t 16b38b34c60ba07132be2ce8d642a56c9521dce0

# Recompute the blob hash from the file contents
git hash-object extensions/default/src/Toolbar/ToolButtonWrapper.tsx
```

If `git cat-file` says the object is missing, the index is stale.

## 5. Rebuild the index

This is the safest recovery step when the index is corrupt or contains stale blob references.

```bash
git rm -r --cached .
git add -A
```

Verify the updated index entry:

```bash
git ls-files --stage extensions/default/src/Toolbar/ToolButtonWrapper.tsx
git cat-file -t 16b38b34c60ba07132be2ce8d642a56c9521dce0
```

## 6. Retry the commit

```bash
git commit -m "after customizing dockerfile and viewer"
```

## 7. Verify the commit and worktree

After a successful commit, confirm the tree is clean and inspect the latest commit.

```bash
git status --short --untracked-files=no
git show --stat --oneline --name-status HEAD -n 1
```

## 8. Check repository integrity

If the repo still looks damaged, run a full integrity check:

```bash
git fsck --no-progress
```

### Common symptoms and meaning

- `fatal: not a git repository` -> wrong directory or missing `.git`
- `fatal: Not a valid object name HEAD` -> HEAD points to a broken ref
- `error: invalid object ... for 'path'` -> index contains a missing or stale blob
- `notice: HEAD points to an unborn branch` -> current branch has no commits

## 9. User identity warning

If Git says it needs your identity, configure it once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 10. Minimal recovery sequence used here

```bash
git symbolic-ref HEAD refs/heads/master
git rm -r --cached .
git add -A
git commit -m "after customizing dockerfile and viewer"
```

This sequence restored the valid branch, rebuilt the index, and allowed the commit to succeed.
