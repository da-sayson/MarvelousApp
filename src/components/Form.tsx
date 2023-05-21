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

    useEffect(() => {
        fetch('https://localhost:8888/allTasks')
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);

                    const serverTodoList = result.filter((task: TaskObject) => !task.checked);
                    setTodo(serverTodoList);

                    const serverDoneList = result.filter((task: TaskObject) => task.checked);
                    setDone(serverDoneList);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    const handleAddChange = (event) => {
        setToAdd(event.target.value);
    }

    const handlePressEnter = (event) => {
        if (event.key === 'Enter') {
            handleClick(event);
        }
    }

    const handleClick = (event) => {
        event.preventDefault();
        if (toAdd.length === 0) {
            return;
        }
        fetch(
            'https://localhost:8888/allTasks',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ name: toAdd })
            }
        )
        .then(res => res.json())
        .then(
            (result: TaskObject) => {
                const newAdd = { name: result.name, taskId: result.taskId, checked: result.checked, dateDone: result.dateDone };
                const newList = todoList.concat(newAdd).sort(TaskSorter);
                setTodo(newList);
                setToAdd('');
            },
            (error) => {
                setError(error);
            }
        )
    }

    const handleCheck = (taskObject) => {
        fetch('https://localhost:8888/allTasks/check/' + taskObject.taskId, { method: 'PUT' })
        .then(res => res.json())
        .then(
            (result: TaskObject) => {
                const newTodoList = todoList.filter((todo) => todo.taskId !== result.taskId);
                setTodo(newTodoList);
                const newDoneList = doneList.concat(result).sort(TaskSorter);
                setDone(newDoneList);
            },
            (error) => {
                setError(error);
            }
        )
    }

    const handleUncheck = (taskObject) => {
        fetch('https://localhost:8888/allTasks/uncheck/' + taskObject.taskId, { method: 'PUT' })
        .then(res => res.json())
        .then(
            (result: TaskObject) => {
                const newDoneList = doneList.filter((done) => done.taskId !== result.taskId);
                setDone(newDoneList);
                const newTodoList = todoList.concat(result).sort(TaskSorter);
                setTodo(newTodoList);
            },
            (error) => {
                setError(error);
            }
        )
    }

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    }

    const deleteTasks = () => {
        fetch('https://localhost:8888/allTasks', { method: 'DELETE' })
        .then(
            () => {
                setTodo([]);
                setDone([]);
                setModalOpen(false);
            },
            (error) => {
                setModalOpen(false);
                setError(error);
            }
        )
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