# KanbanBoard

View different branches for different technology implementations of the kanban board.

The purpose of this repo is to showcase the different of use between using:
- Not using sockets
- Using sockets
- Using sockets with Redux

To view the different implementations change the branches, the main branch is not using sockets.

A kanban board enables people to plan what they need to do, its very helpful to know what other people are doing. Its commonly used for teams. A kanban board consists of a columns of tasks.

The kanban board requires the following ideas/features:
- Drag and drop: users need to be able to drag and drop tasks to different columns or into a different position (order) in the same list. For this I use the package React Beautiful Drag and Drop (I've had good experience using the library even though it isn't maintained any more)
- Order of Tasks: the best method to track the order of tasks in a column is to use a linked list where each task points to the next task, this makes the time complexity of moving a task constant. The standard alternative would be to store the position of each task but if you were to move a task from the top to the bottom you would then need to change the position of every task in the column up by 1 - making the time complexity O(n). This is notably important as well as it will reduce the amount of data/requests that will need to be sent to the data to update the order. This will speed up the time it takes to reorder tasks improving the user's experience.
- Save changes: I'm using PostgreSQL and Prisma to save the changes
