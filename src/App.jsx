import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form"
import FilterButton from "./components/FilterButton"
import tasks from "./components/data"

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP)

export default function App(props) {
    
    const [tasksUse, setTasksUse] = useState(tasks)
    const [filter, setFilter] = useState('All')
    const listHeadingRef = useRef(null);


    function toggleTaskCompleted(id) {
      const updatedTasks = tasksUse.map((task) => {
        if (id === task.id) {
            return {...task, completed : !task.completed}
        }
        return task;
      })
        setTasksUse(updatedTasks)
    }

    function deleteTask(id) {
        const remainingTasks = tasksUse.filter((task) => id !== task.id);
        setTasksUse(remainingTasks)
    }

    function editTask(id, newName) {
        const editedTaskList = tasksUse.map((task) => {
          if (id === task.id) {
            return {...task, name: newName}
          }
          return task
        })
        setTasksUse(editedTaskList)
    }

    const tasklist = tasksUse
        .filter(FILTER_MAP[filter])
        .map(task => {
        return(
            <Todo 
            id={task.id}
            name={task.name}
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            deleteTask={deleteTask}
            editTask={editTask}
            />
        )
    })

    const filterList = FILTER_NAMES.map((name) => (
      <FilterButton 
        key={name} 
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
    ));


    function addTask(name) {
        const newTask = {id: `todo-${nanoid()}`, name, completed: false}
        setTasksUse([...tasksUse, newTask])
    }

    const tasksNoun = tasklist.length !== 1? 'tasks' : 'task'
    const headingText = `${tasklist.length} ${tasksNoun} remaining`
    const prevTaskLength = usePrevious(tasks.length);

    useEffect(() => {
      if (tasks.length - prevTaskLength === -1) {
        listHeadingRef.current.focus();
      }
    }, [tasks.length, prevTaskLength]);


  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
     </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
          {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {tasklist}
      </ul>
    </div>
  );
}

