import * as React from 'react'
import { useState } from 'react'

export type TaskObject = {
    name: string;
    taskId: number;
    checked: boolean;
    dateDone: Date;
}

export const TaskSorter = (a, b) => a.name > b.name ? 1 : -1;

type TaskProps = {
    taskObject: TaskObject;
    checkHandler: (taskObject: TaskObject) => void;
    uncheckHandler: (TaskObject: TaskObject) => void;
}

export const Task = (props: TaskProps) => {
    const handleChange = () => {
        props.taskObject.checked ? props.uncheckHandler(props.taskObject)
            : props.checkHandler(props.taskObject);
    }

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={props.taskObject.checked}
                    onChange={handleChange}
                />
                { props.taskObject.name }
            </label>
        </div>
    );
}