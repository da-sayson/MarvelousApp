import * as React from 'react'
import { useState } from 'react'
import { Task, TaskObject, TaskSorter } from './Task'
import { v4 as uuidv4 } from 'uuid'

type CheckList = {
    title: string;
    taskName: string[];
}

const CheckList = (props) => {
    return (
        <div>
            <h3>{props.title}</h3>
            <hr />
            <ul>
                {props.taskList.map((todo: TaskObject) => (
                    <li key={ todo.taskId }><Task taskObject={todo} checkHandler={props.checkHandler} /></li>
                ))}
            </ul>
        </div>
    );
}

export const Form = () => {
    const [toAdd, setToAdd] = useState('');
    const [todoList, setTodo] = useState<TaskObject[]>([]);
    const [doneList, setDone] = useState<TaskObject[]>([]);

    const handleChange = (event) => {
        setToAdd(event.target.value);
    }

    const handleClick = (event) => {
        event.preventDefault();
        if (toAdd.length === 0) {
            return;
        }
        const newAdd = {name: toAdd, taskId: uuidv4()};
        const newList = todoList.concat(newAdd).sort(TaskSorter);
        setTodo(newList);
        setToAdd('');
    }

    const handleCheck = (taskObject) => {
        const newTodoList = todoList.filter((todo) => todo.taskId !== taskObject.taskId);
        setTodo(newTodoList);
        const newDoneList = doneList.concat(taskObject).sort(TaskSorter);
        setDone(newDoneList);
    }

    const handleUncheck = (event) => {

    }
    

    return (
        <div>
            <h1>Marvelous v2.0</h1>
            <input
                type="text"
                name="toAdd"
                onChange={handleChange}
                value={ toAdd }
            />
            <button onClick={handleClick}>Add</button>
            <CheckList title='To Do' taskList={todoList} checkHandler={handleCheck} />
            <CheckList title='Done' taskList={doneList} checkHandler={handleCheck} />
        </div>
    );
}