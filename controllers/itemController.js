const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const update_items = async (req, res) => {
  const body = req.body

  try {
    let queries = []
    body.forEach(update => {
      const id = update.id
  
      const data = {
        nextId: update.nextId,
      }
  
      if (update.columnId) {
        data['columnId'] = update.columnId
      }
  
      const query = prisma.item.update({
        where: {
          id
        },
        data
      })
  
      queries.push(query)
    })
  
    await prisma.$transaction(queries)
  
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const update_item = async (req, res) => {
  const id = req.params.id
  const data = req.body

  try {
    await prisma.item.update({
      where: {
        id
      },
      data
    })
  
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  update_items,
  update_item
}