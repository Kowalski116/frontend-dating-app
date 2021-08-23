import './App.scss';
import Card from './components/Card/Card'

function App() {
  const img = "https://randomuser.me/api/portraits/women/58.jpg"
  const name = "Sara"
  const age = "20"
  return (
    <div className="App">
      <h1 className="title">
        Hello CoderPush
      </h1>
      <div className="count">
        0
      </div>
      <div className="content">
        <Card img={img} name={name} age={age} />
      </div>
    </div>
  );
}

export default App;
