### Shared directory

This directory contains code and types that is used by both frontend and backend. It is subject to some limitations. In files under this directory, you cannot:

- Use path aliases in imports: instead of `import ... from @/shared/...` use relative path `../types/`
- Import files from elsewhere in frontend into this directory

This is because backend code does not have frontend's path aliases defined, and the code from backend does not get access to any other files in frontend than this directory.

Check [validator readme](./validators/README.md) in it's own directory.