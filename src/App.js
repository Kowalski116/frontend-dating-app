import './App.scss';
import Card from './components/Card/Card'
import Toast from './components/Toast/Toast'
import { useState, useEffect } from 'react'
import moment from 'moment'

function App() {
  // infoUser logged
  const [infoUser, setInfoUser] = useState()
  // list users currently in tab
  const [listUser, setListUser] = useState([])
  const [likedUser, setLikedUser] = useState([])
  const [dislikedUser, setDislikedUser] = useState([])
  // user is showing 
  const [currentUser, setCurrentUser] = useState(null)
  const [notify, setNotify] = useState({})
  const [page, setPage] = useState(0)
  // flag for just one api running at the same time
  const [countApi, setCountApi] = useState(1)
  const url = 'http://localhost:5000'
  // const url = 'https://dummyapi.io/data/v1/'
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

  // post data 
  async function postData(url = '', data) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const getDetailUser = async (page) => {
    setNotify({})
    let listUser = []
    await getData(`${ url }/user?page=${ page }&limit=10`, "6120b53724d80433f6a58d25")
      .then(res => {
        setCountApi(prev => prev - 1)
        return res.data
      })
      .then(res => {
        const promiseArray = res.map(a => {
          return getData(`${ url }/user/${ a.id }`, "6120b53724d80433f6a58d25")
            .then(res => res)
        });
        return Promise.all(promiseArray)
          .then(res => {
            setListUser(prev => {
              const temp = [...prev, ...res]
              setCurrentUser(temp[0])
              return temp
            })
            listUser = res
          })
      })
      .catch(err => console.log(err))
    return listUser
  }
  useEffect(() => {
    //save user info in first loading
    getDetailUser(0).then(res => {
      if (localStorage.getItem("user")) {
        const temp = JSON.parse(localStorage.getItem("user"))

        setLikedUser(temp.like)
        setDislikedUser(temp.pass)
        setInfoUser(temp)
        // set infouser and delete that user from listuser
        setListUser(prev => {
          setCurrentUser(prev[1])
          return prev.slice(1)
        })
      } else {
        res[0].like = []
        res[0].pass = []
        localStorage.setItem("user", JSON.stringify(res[0]))

        setInfoUser(res[0])
        setListUser(prev => {
          setCurrentUser(prev[1])
          return prev.slice(1)
        })
      }
    })
  }, [])
  function removeUser(listUser, id) {
    return listUser.filter(u => u.id !== id)
  }
  const onAccept = () => {
    const data = { idUser: infoUser.id, idLikeUser: currentUser.id }
    postData(`${ url }/user/like`, data)
      .then(res => {
        // save to localStorage
        infoUser.like = [...infoUser.like, currentUser]
        localStorage.setItem('user', JSON.stringify(infoUser))
      })
    setLikedUser([...likedUser, currentUser])
    const newListUser = removeUser(listUser, currentUser.id)
    // when the number of users in the tab is less than 5 api call to load more
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
    const data = { idUser: infoUser.id, idLikeUser: currentUser.id }
    postData(`${ url }/user/pass`, data)
      .then(res => {
        // save to localStorage
        infoUser.pass = [...infoUser.pass, currentUser]
        localStorage.setItem('user', JSON.stringify(infoUser))
      })
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
  if (!infoUser) return <div className="App text-center"><h2>Loading...</h2></div>
  return (
    <div className="App">
      <h1 className="title">
        Hello {infoUser.firstName} {infoUser.lastName}
      </h1>
      <div className="count">
        {likedUser.length}
      </div>
      <div className="content">
        {currentUser ? <Card key={currentUser.id} id={currentUser.id} img={currentUser.picture} name={`${ currentUser.firstName } ${ currentUser.lastName }`} age={moment().diff(currentUser.dateOfBirth, 'years')} onSubmit={onAccept} onCancel={onCancel} />
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
