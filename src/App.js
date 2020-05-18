// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    author: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (author, message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
      author: author
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, authToApply, mssgToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { author: authToApply }
    
    });
    
    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      mupdate: { message: mssgToApply }
    
    });

  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={dat.id}  >
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}>author:</span>{dat.author}<br/>
                  <span style={{ color: 'gray' }}> data: </span> {dat.message}<br/>
                  <span>Here..{data.length}</span>
                </li>
              ))}
        </ul>
        <div style={{ padding: '10px' }}>
        <input
            type="text" className = "input-field"
            onChange={(e) => this.setState({ author: e.target.value })}
            placeholder="Add author to your list"
            style={{ width: '200px' }}
          />
          <input
            type="text" className = "input-field"
            onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="Add task to your list"
            style={{ width: '200px' }}
          />
         
              <Button onClick={() => this.putDataToDB(this.state.author, this.state.message)}>ADD</Button>
         
        
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text" className = "input-field"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="Put id to delete"
          />
          <Button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </Button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text" className = "input-field"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value })}
            placeholder="Id of item to update"
          />
          <input
            type="text" className = "input-field"
            style={{ width: '150px' }}
            onChange={(e) => this.setState({ authToApply: e.target.value })}
            placeholder="Put new Author"
          />
          <input
            type="text" className = "input-field"
            style={{ width: '150px' }}
            onChange={(e) => this.setState({ mssgToApply: e.target.value })}
            placeholder="Put new task"
          />
          <Button
            onClick={() =>
              this.updateDB(this.state.idToUpdate,this.state.authToApply, this.state.mssgToApply)
            }
          >
            UPDATE
          </Button>
        </div>
      </div>
    );
  }
}

export default App;