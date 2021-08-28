import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



module.exports = {
  get_columns,
  update_columns,
  update_column
}