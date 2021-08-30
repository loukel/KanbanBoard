import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { KanbanBoard } from "./features/kanbanBoard"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/*" component={KanbanBoard}/>
        </Switch>
      </Router>
    </div>
  )
}

export default App
