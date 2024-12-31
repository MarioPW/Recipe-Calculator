
import { NavBar } from './components/NavBar'
import { Abaut } from './components/Abaut'
import { LoginRegister } from './components/LoginRegister'

function App() {

  return (
    <>
    < NavBar />
    <div className="d-flex flex-column flex-sm-row" style={{ justifyContent: 'space-evenly'}}>
    < LoginRegister />
    < Abaut />
    </div>
    </>
  )
}

export default App
