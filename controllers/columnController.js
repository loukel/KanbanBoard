const { PrismaClient } = require('@prisma/client')
const orderLinkedList = require('../utils/linkedList')
const prisma = new PrismaClient()

const get_columns = async (req, res) => {
  try {
    let columns = await prisma.column.findMany({
      include: {
        items: true,
      },
    })
    // Order columns
    console.log(columns)
    columns = orderLinkedList(columns)
    console.log(columns)

    // Order items in each column
    columns = columns.map(column => {
      column.items = orderLinkedList(column.items)
      return column
    })

    res.status(200).send(columns)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const update_columns = async (req, res) => {
  const data = req.body

  try {
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
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }

}

const update_column = async (req, res) => {
  const data = req.body

  try {
    await prisma.column.update({
      data
    })
    res.sendStatus(204)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  get_columns,
  update_columns,
  update_column
}