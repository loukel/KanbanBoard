import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const errorHandler = async (callback) => {
  return () => {
    try {
      return await callback()
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

const get_columns = errorHandler(async (req, res) => {
  const columns = await prisma.column.findMany()
  res.status(200).send(columns)
})

const update_columns = errorHandler(async (req, res) => {
  const data = req.body
  let queries = []
  data.forEach(update => {
    const id = update.id

    const data = {
      nextId: update.nextId,
    }

    const query = prisma.state.updateMany({
      where: {
        id
      },
      data
    })

    queries.push(query)
  })
  await prisma.$transaction(queries)
})

const update_column = errorHandler(async (req, res) => {
  const data = req.body
  await prisma.column.update({
    data
  })
  res.sendStatus(204)
})

module.exports = {
  get_columns,
  update_columns,
  update_column
}