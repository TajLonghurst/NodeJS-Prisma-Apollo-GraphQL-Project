import type { CodegenConfig } from "@graphql-codegen/cli";
import { readFileSync } from "fs";

// const typeDefs = readFileSync("./src/**/*.graphql", { encoding: "utf-8" });

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/**/**/*.graphql",
  generates: {
    "src/Types/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  config: {},
};

export default config;

//./src/**/*.graphql
