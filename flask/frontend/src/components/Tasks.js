import Task from "./Task";

const Tasks = ({ tasks, onDelete, onToggle }) => {
    return (
        <>
            {tasks.map((task) => (
                <Task 
                    {...console.log(task.id)}
                    key={task.id} 
                    task={task} 
                    onDelete={onDelete}
                    onToggle={onToggle} 
                />
            ))}
        </>
    )
}

export default Tasks;