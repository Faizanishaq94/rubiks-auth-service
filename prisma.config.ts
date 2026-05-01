import { env } from './src/config/env';
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env["DATABASE_URL"],
  },
});
