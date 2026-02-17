# @cynerad/support

A small TypeScript support toolkit for strings, numbers, dates, HTTP, and common utilities.

<p align="center">
  <img src="./public/image/logo.png" alt="Project logo"  height="400" style={} />
</p>

## Overview

`@cynerad/support` is a collection of small, focused helpers for everyday TypeScript work: string formatting, number helpers, dates, HTTP fetch client, cookies, file system helpers, and more.

- **Docs**: [example.com/docs](https://example.com/docs)
- **Changelog**: [CHANGELOG.md](./.changeset/README.md)

---

## Features

- **String helpers**: `camel`, `snake`, `kebab`, `slug`, `trim`, `between`, `after`, `before`, `mask`, `pad`, `uuid`, and more.
- **Number helpers**: utilities for working with numeric values (see `src/support/number`).
- **Date helpers**: friendly date operations built around `dayjs` (see `src/support/date`).
- **HTTP client**: a small `createFetchClient` wrapper with typed responses and basic error handling.
- **Array & object utils**: helpers for common array/object transforms.
- **Path & file-system**: small helpers for working with paths and filesystem‑related tasks.
- **Cookies & misc utils**: cookie utilities, benchmarking helpers, and general utilities.

---

## Installation


```bash
# Install from npm
npx shadcn@latest add https://cynerad.github.io/support/public/r/support.json

# install from pnpm
pnpm dlx shadcn@latest add https://cynerad.github.io/support/public/r/support.json

# install from yarn
yarn shadcn@latest add https://cynerad.github.io/support/public/r/support.json

# install from bun
bun x shadcn@latest add https://cynerad.github.io/support/public/r/support.json

```

---

## Quick Example

```ts
import { camel, slug } from "@cynerad/support/string";
import { createFetchClient } from "@cynerad/support/fetch";

// String helpers
camel("hello_world");           // -> "helloWorld"
slug("Hello World!!!");         // -> "hello-world"

// HTTP client
const api = createFetchClient({
  baseUrl: "https://api.example.com",
  headers: { Authorization: "Bearer token" },
});

const users = await api.get<{ id: number; name: string }[]>("/users");
```

More usage examples live in the docs: [example.com/docs](https://example.com/docs).

---

## Testing

This package uses [Vitest](https://vitest.dev).

```bash
# Run tests (uses "vitest run" under the hood)
pnpm test

# Run Vitest in watch/dev mode
pnpm dev
```

Scripts (from `package.json`):

- **`pnpm dev`** – run Vitest in watch mode.
- **`pnpm test`** – run the full Vitest test suite once.

---

## Contributing

- Fork the repository.
- Create a feature branch.
- Make your changes with tests.
- Run `pnpm lint` and `pnpm test`.
- Open a Pull Request.

By contributing, you agree that your contributions will be licensed under the same **[MIT License](./LICENSE.md)** as this project.
