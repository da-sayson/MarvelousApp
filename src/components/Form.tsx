import * as React from 'react'
import { useState } from 'react'
import { Task, TaskObject, TaskSorter } from './Task'
import { v4 as uuidv4 } from 'uuid'
import { Modal } from './Modal'

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
                    <li key={todo.taskId}><Task taskObject={todo} checkHandler={props.checkHandler} uncheckHandler={props.uncheckHandler} /></li>
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
        const newAdd = {name: toAdd, taskId: uuidv4(), checked: false};
        const newList = todoList.concat(newAdd).sort(TaskSorter);
        setTodo(newList);
        setToAdd('');
    }

    const handleCheck = (taskObject) => {
        const newTodoList = todoList.filter((todo) => todo.taskId !== taskObject.taskId);
        setTodo(newTodoList);
        const newTaskObject = { ...taskObject, checked: !taskObject.checked };
        const newDoneList = doneList.concat(newTaskObject).sort(TaskSorter);
        setDone(newDoneList);
    }

    const handleUncheck = (taskObject) => {
        const newDoneList = doneList.filter((done) => done.taskId !== taskObject.taskId);
        setDone(newDoneList);
        const newTaskObject = { ...taskObject, checked: !taskObject.checked };
        const newTodoList = todoList.concat(newTaskObject).sort(TaskSorter);
        setTodo(newTodoList);
    }

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    }

    const deleteTasks = () => {
        setTodo([]);
        setDone([]);
        setModalOpen(false);
    }

    const style = {
        background: 'none!important',
        border: 'none',
        padding: '0!important',
        fontFamily: 'arial, sans-serif',
        color: '#069',
        textDecoration: 'underline',
        cursor: 'pointer'
    }

    return (
        <div>
            <h1>Marvelous v2.0</h1>
            
            <button style={style} onClick={openModal}>Delete all tasks</button>
            <input
                type="text"
                name="toAdd"
                onChange={handleChange}
                value={ toAdd }
            />
            <button onClick={handleClick}>Add</button>
            <CheckList title='To Do' taskList={todoList} checkHandler={handleCheck} uncheckHandler={handleUncheck} />
            <CheckList title='Done' taskList={doneList} checkHandler={handleCheck} uncheckHandler={handleUncheck} />
            {modalOpen && <Modal modalOpenSetter={setModalOpen} modalTaskDeleter={deleteTasks} />}
        </div>
    );
}