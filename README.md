# github-action-edit-npm-package

This action edits the package.json file.

## Inputs

### `package-path`

**Required** Path from the root of the app repository. Default `"./"`.

### `append`

**Required** List of values(in JSON formatted string) to append to the end of parameter. Default `{}`.

### `set`

**Required** List of values(in JSON formatted string) to set. Default `{}`.

### `remove`

**Required** List of values(in JSON formatted string) to remove. Default `{}`.

## Example usage
```
uses: Majoneza/github-action-edit-npm-package@v1
with:
  set: '{"main":"index.js"}'
```
