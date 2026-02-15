pnpm install

//pnpm lint:fix

//for adding chnageset
pnpm changeset //this add markdown file in .changeset/example.md

//add act to run localy github actions
act pull_request

//test it globaly

pnpm build
pnpm link --global

pnpm link --global @cynerad/support //Use it in another project

pnpm unlink --global @cynerad/support 5️⃣ Unlink when done

---

//test it globaly
pnpm pack

cynerad-support-0.1.0.tgz

pnpm add ../path/to/cynerad-support-0.1.0.tgz

import { slugify } from "@cynerad/support/string"
