import * as React from 'react'
import { useState, useEffect } from 'react'
import { Task, TaskObject, TaskSorter } from './Task'
import { v4 as uuidv4 } from 'uuid'
import { Modal } from './Modal'

type CheckListProps = {
    checkHandler: (taskObject: TaskObject) => void;
    uncheckHandler: (taskObject: TaskObject) => void;
    countLimit?: number;
    taskList: TaskObject[];
    title: string;
    searchTerm: string;
}

const CheckList = (props: CheckListProps) => {
    const searchReducedList = props.taskList.filter((todo: TaskObject) => todo.name.toLowerCase().includes(props.searchTerm.toLowerCase()));
    const countLimitedList = props.countLimit ? searchReducedList.slice(0, props.countLimit) : searchReducedList;
    return (
        <div>
            <h3>{props.title}</h3>
            <hr />
            <ul>
                {countLimitedList
                    .map((todo: TaskObject) => (
                        <li key={todo.taskId}>
                            <Task
                                taskObject={todo}
                                checkHandler={props.checkHandler}
                                uncheckHandler={props.uncheckHandler}
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
}

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
        fetch(
            'https://localhost:8888/allTasks/check/' + taskObject.taskId,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({ name: toAdd })
            }
        )
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
        const newDoneList = doneList.filter((done) => done.taskId !== taskObject.taskId);
        setDone(newDoneList);
        const newTaskObject = { ...taskObject, checked: !taskObject.checked, dateDone: null };
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
            <div>
                <h1>Marvelous v2.0</h1>

                <button style={style} onClick={openModal}>Delete all tasks</button>
                <input
                    type="text"
                    name="toAdd"
                    onChange={handleAddChange}
                    value={toAdd}
                />
                <button onClick={handleClick}>Add</button>
                <input
                    type="text"
                    name="toSearch"
                    onChange={handleSearchChange}
                    value={toSearch}
                />
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
                {modalOpen && <Modal modalOpenSetter={setModalOpen} modalTaskDeleter={deleteTasks} />}
            </div>
        );
    }
}