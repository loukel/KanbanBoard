const {
  PrismaClient
} = require('@prisma/client')
const prisma = new PrismaClient()
const faker = require('faker')

const columnsNum = 5
const itemsPerColumn = 10

const main = async () => {
  let prevColumnId = null
  for (let i = 0; i < columnsNum; i++) {
    const column = { id: prevColumnId } = await prisma.column.create({
      data: {
        name: faker.lorem.words(),
        nextId: prevColumnId,
      }
    })

    let prevItemId = null
    for (let j = 0; j < itemsPerColumn; j++) {
      const item = { id: prevItemId } = await prisma.item.create({
        data: {
          name: faker.lorem.words(),
          columnId: column.id,
          nextId: prevItemId,
        }
      })
      prevColumnId = item.id
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()

    console.log('\x1b[32m%s\x1b[0m', 'Successfully Seeded!')
    process.exit(0)
  })