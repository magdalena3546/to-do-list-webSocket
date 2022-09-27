import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import shortid from "shortid";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const local = true;
  useEffect(() => {
    const socket = (io("http://localhost:8000", {
      transports: ["websocket"] // use webSocket only
    }));
    setSocket(socket);
    socket.on('updateData', (tasks) =>{
      updateTasks(tasks)
    });
    socket.on('removeTask', (id) => { 
      removeTask(id)
    });
    socket.on('addTask', (task) => { 
      addTask(task)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateTasks = list => {
    setTasks(list);
  };

  const removeTask = (id, local) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if(local){
      socket.emit('removeTask', id);
    };
  };

  const addTask = task => {
    setTasks((tasks) => [...tasks, task]);
  
  };

  const submitForm = e =>{
    e.preventDefault();
    const task = {id: shortid(), name: taskName};
    addTask(task);
    socket.emit('addTask', task);
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task)=> (<li className="task" key={task.id}>{task.name}<button onClick={() => removeTask(task.id, local)} className="btn btn--red">Remove</button></li>))}
        </ul>
  
        <form onSubmit={e => submitForm(e)} id="add-task-form">
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange = {e => setTaskName(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;