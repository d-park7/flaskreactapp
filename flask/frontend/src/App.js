import { useState, useEffect } from 'react';
import axios from 'axios'
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTasks from './components/AddTasks';


const api = axios.create({
    baseURL: `http://127.0.0.1:5000`
})

const App = () => {
    const [showAddTask, setShowAddTask] = useState(true)
    const [tasks, setTasks] = useState([])

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get('/tasks')
                //console.log(response.data)
                setTasks(response.data)
            } catch (err) {
                console.log(err.response.data)
                console.log(err.response.status)
                console.log(err.response.headers)
            }
        }
        fetchTasks()
    }, [])

    // Add task
    const addTask = async (task) => {
        const id = tasks[tasks.length - 1].id + 1
        task.id = id
        const response = await api.post(`/tasks/${task.id}`)
        setTasks([...tasks, response.data])
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