import {BrowserRouter, Route, Routes} from  'react-router-dom'
import Join from './pages/Join';
import EditorPage from './pages/EditorPage';

const App = () => {
  return (
    <div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Join/>} />
      <Route path="/editor/:id" element={<EditorPage/>}/>

    </Routes>
    </BrowserRouter>
    
    
    
    </div>
  
  
  )
}

export default App;
