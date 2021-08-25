import './App.scss';
import Card from './components/Card/Card'
import Toast from './components/Toast/Toast'
import { useState, useEffect } from 'react'
import moment from 'moment'

function App() {
  const img = "https://randomuser.me/api/portraits/women/58.jpg"
  const name = "Sara"
  const age = "20"
  const [info, setInfo] = useState({})
  const [countAccept, setCountAccept] = useState(0)
  const [listUser, setListUser] = useState([])
  const [likedUser, setLiked] = useState([])
  const [dislikedUser, setDislikedUser] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [notify, setNotify] = useState({})
  const [page, setPage] = useState(0)
  const [countApi, setCountApi] = useState(1)

  async function getData(url = '', appId) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        "app-id": appId
      },
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const getDetailUser = (page) => {
    getData(`https://dummyapi.io/data/v1/user?page=${ page }&limit=10`, "6120b53724d80433f6a58d25")
      .then(res => {
        setCountApi(prev => prev - 1)
        return res.data
      })
      .then(res => {
        const promiseArray = res.map(a => {
          return getData(`https://dummyapi.io/data/v1/user/${ a.id }`, "6120b53724d80433f6a58d25")
            .then(res => res)
        });
        Promise.all(promiseArray)
          .then(res => {
            setListUser(prev => {
              const temp = [...prev, ...res]
              setCurrentUser(temp[0])
              return temp
            })
          })
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    getDetailUser(0)
  }, [])
  function removeUser(listUser, id) {
    return listUser.filter(u => u.id !== id)
  }
  const onAccept = () => {
    setLiked([...likedUser, currentUser])
    const newListUser = removeUser(listUser, currentUser.id)
    if (newListUser.length < 5) {
      if (!countApi) {
        setCountApi(prev => prev + 1)

        getDetailUser(page + 1)
        setPage(prev => prev + 1)
      }

    }
    setListUser(newListUser)
    setCurrentUser(newListUser[0])
    setNotify({ msg: "What an awesome profile !", type: "success" })
  }
  const onCancel = () => {
    setDislikedUser([...dislikedUser, currentUser])
    const newListUser = removeUser(listUser, currentUser.id)
    if (newListUser.length < 5) {
      if (!countApi) {
        setCountApi(prev => prev + 1)

        getDetailUser(page + 1)
        setPage(prev => prev + 1)
      }

    }
    setListUser(newListUser)
    setCurrentUser(newListUser[0])
    setNotify({ msg: "Not my type", type: "error" })
  }

  return (
    <div className="App">
      <h1 className="title">
        Hello CoderPush
      </h1>
      <div className="count">
        {likedUser.length}
      </div>
      <div className="content">
        {currentUser ? <Card id={currentUser.id} img={currentUser.picture} name={`${ currentUser.firstName } ${ currentUser.lastName }`} age={moment().diff(currentUser.dateOfBirth, 'years')} onSubmit={onAccept} onCancel={onCancel} />
          : <h2>Loading...</h2>}
      </div>
      <div id="toast">
        {notify.msg && <Toast msg={notify.msg} type={notify.type} key={currentUser?.id} />}
      </div>
      <div className="list-user">
        <div className="col">
          <h2>Liked</h2>
          <ul >
            {likedUser.map((u, index) => <li key={index}>{u.firstName} {u.lastName} {moment().diff(u.dateOfBirth, 'years')}</li>)}
          </ul>
        </div>
        <div className="col">
          <h2>Not my type</h2>
          <ul>
            {dislikedUser.map((u, index) => <li key={index}>{u.firstName} {u.lastName} {moment().diff(u.dateOfBirth, 'years')}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
