import './App.scss';
import Card from './components/Card/Card'

function App() {
  return (
    <div className="App">
      <h1 className="title">
        Hello CoderPush
      </h1>
      <div className="count">
        0
      </div>
      <div className="content">
        <Card />
      </div>
    </div>
  );
}

export default App;
