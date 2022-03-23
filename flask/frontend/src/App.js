import { useState, useEffect } from 'react';
import axios from 'axios'
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTasks from './components/AddTasks';
import Help from "./components/Help";


const api = axios.create({
    baseURL: `http://127.0.0.1:5000/`
})

const App = () => {
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])
    const [test, setTest] = useState("")

    const getTasks = () => {
        api.get('/1').then(res => {
            console.log(res.data)
            setTest(res.data)
        }).catch(error => {
            console.log(error)
        })
    }


    // Fetch tasks from backend
    // useEffect(() => {
    //     axios.get('http://127.0.0.1:5000/2').then(response => {
    //         console.log("SUCCESS", response)
    //         setTasks(response)
    //     }).catch(error => {
    //         console.log(error)
    //     })
    // }, [])

    // Add task
    const addTask = (task) => {
        const id = Math.floor(Math.random() * 1000) + 1
        const newTask = { id, ...task }
        setTasks([...tasks, newTask])
    }

    // Delete task
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }
    
    // Toggle reminder
    const toggleReminder = (id) => {
        setTasks(
            tasks.map((task) => 
                task.id === id ? { ...task, reminder: !task.reminder } : task
            )
        )
    }

    return (
        <div className="App">
            <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
            <Help displayData={getTasks}/>
            {showAddTask && <AddTasks onAdd={addTask} />}
            {tasks.length > 0 ? (
                <Tasks tasks={tasks} onDelete=
                {deleteTask} onToggle={toggleReminder} />
            ) : (
                'No Tasks'
            )}
        </div>
    )
};

export default App;