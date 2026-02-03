// Prisma 7 Configuration
// Uses DIRECT_URL (non-pooled) for CLI operations
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})
