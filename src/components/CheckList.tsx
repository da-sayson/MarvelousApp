import * as React from 'react';
import { Task, TaskObject, TaskSorter } from './Task';

type CheckListProps = {
    checkHandler: (taskObject: TaskObject) => void;
    uncheckHandler: (taskObject: TaskObject) => void;
    countLimit?: number;
    taskList: TaskObject[];
    title: string;
    searchTerm: string;
}

export const CheckList = (props: CheckListProps) => {
    const searchReducedList = props.taskList.filter((todo: TaskObject) => todo.name.toLowerCase().includes(props.searchTerm.toLowerCase()));
    const newList = !props.countLimit ? searchReducedList
        : searchReducedList.sort((a, b) => a.dateDone > b.dateDone ? -1 : 1)
            .slice(0, props.countLimit)
            .sort(TaskSorter);
    return (
        <div>
            <h3>{props.title}</h3>
            <hr />
            <ul>
                {newList
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