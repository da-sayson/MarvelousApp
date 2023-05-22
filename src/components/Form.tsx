import * as React from 'react'
import { useState, useEffect } from 'react'
import { CheckList } from './CheckList'
import { TaskObject, TaskSorter } from './Task'
import { Modal } from './Modal'

import './Form.css'

export const Form = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const [toAdd, setToAdd] = useState('');
    const [todoList, setTodo] = useState<TaskObject[]>([]);
    const [doneList, setDone] = useState<TaskObject[]>([]);

    const loadTasksFromServer = async () => {
        try {
            const response = await fetch('https://localhost:8888/allTasks');
            const returnedTask: TaskObject[] = await response.json();

            const returnedTodoList = returnedTask.filter((task: TaskObject) => !task.checked);
            setTodo(returnedTodoList);

            const returnedDoneList = returnedTask.filter((task: TaskObject) => task.checked);
            setDone(returnedDoneList);
        } catch (error) {
            setError(error);
        }
        setIsLoaded(true);
    }
    useEffect(loadTasksFromServer, []);

    const handleAddChange = (event) => {
        setToAdd(event.target.value);
    }

    const handlePressEnter = (event) => {
        if (event.key === 'Enter') {
            handleClick(event);
        }
    }

    const addTaskToServer = async () => {
        try {
            const response = await fetch(
                'https://localhost:8888/allTasks',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ name: toAdd })
                }
            );
            const returnedTask: TaskObject = await response.json();

            const newAdd = {
                name: returnedTask.name,
                taskId: returnedTask.taskId,
                checked: returnedTask.checked,
                dateDone: returnedTask.dateDone
            }
            const newList = todoList.concat(newAdd).sort(TaskSorter);
            setTodo(newList);
            setToAdd('');
        } catch (error) {
            setError(error);
        }
    }
    const handleClick = (event) => {
        event.preventDefault();
        if (toAdd.length === 0) {
            return;
        }
        addTaskToServer();
    }

    const checkServerTask = async (taskObject: TaskObject) => {
        try {
            const response = await fetch(
                'https://localhost:8888/allTasks/check/' + taskObject.taskId,
                { method: 'PUT' }
            )
            const returnedTask: TaskObject = await response.json();
            const newTodoList: TaskObject[] = todoList.filter((todo: TaskObject) => todo.taskId !== returnedTask.taskId);
            setTodo(newTodoList);
            const newDoneList: TaskObject[] = doneList.concat(returnedTask).sort(TaskSorter);
            setDone(newDoneList);
        } catch (error) {
            setError(error);
        }

    }
    const handleCheck = (taskObject: TaskObject) => {
        checkServerTask(taskObject);
    }

    const uncheckServerTask = async (taskObject: TaskObject) => {
        try {
            const response = await fetch(
                'https://localhost:8888/allTasks/uncheck/' + taskObject.taskId,
                { method: 'PUT' }
            );
            const returnedTask: TaskObject = await response.json();

            const newDoneList: TaskObject[] = doneList.filter((done: TaskObject) => done.taskId !== returnedTask.taskId);
            setDone(newDoneList);

            const newTodoList: TaskObject[] = todoList.concat(returnedTask).sort(TaskSorter);
            setTodo(newTodoList);
        } catch (error) {
            setError(error);
        }
    }
    const handleUncheck = (taskObject: TaskObject) => {
        uncheckServerTask(taskObject);
    }

    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    }

    const deleteAllOnServer = async () => {
        try {
            const response = await fetch('https://localhost:8888/allTasks', { method: 'DELETE' });
            if (response.ok) {
                setTodo([]);
                setDone([]);
            } else {
                setError('Error:' + response.status.toString() + ':' + response.statusText);
            }
        } catch (error) {
            setError(error);
        }
        setModalOpen(false);
    }
    const deleteTasks = () => {
        deleteAllOnServer();
    }

    const [toSearch, setToSearch] = useState('');
    const handleSearchChange = (event) => {
        setToSearch(event.target.value);
    }

    if (error) {
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div className="formContainer">
                <div className="formRow">
                    <h1>Marvelous v2.0</h1>

                    <div className="floatRightContents">
                        <button className="deleteLinkButton" onClick={openModal}>Delete all tasks</button>
                    </div>
                </div>

                <div className="formRow">
                    <div id="addInputGroup">
                        <input
                            type="text"
                            name="toAdd"
                            className="textInput"
                            onChange={handleAddChange}
                            onKeyPress={handlePressEnter}
                            value={toAdd}
                        />
                        <button className="formButton" onClick={handleClick}>Add</button>
                    </div>

                    <input
                        type="text"
                        id="searchBar"
                        name="toSearch"
                        className="textInput"
                        onChange={handleSearchChange}
                        value={toSearch}
                        placeholder="Search.."
                    />
                </div>

                <div class="formRow">
                    <CheckList
                        title='To Do'
                        taskList={todoList}
                        checkHandler={handleCheck}
                        uncheckHandler={handleUncheck}
                        searchTerm={toSearch}
                    />
                    <CheckList
                        title='Done'
                        taskList={doneList}
                        checkHandler={handleCheck}
                        uncheckHandler={handleUncheck}
                        searchTerm={toSearch}
                        countLimit={10} />
                </div>

                {modalOpen && <Modal modalOpenSetter={setModalOpen} modalTaskDeleter={deleteTasks} />}
            </div>
        );
    }
}