import * as React from 'react'
import { useState } from 'react'

export type TaskObject = {
    name: string;
    taskId: number;
}

export const TaskSorter = (a, b) => a.name > b.name ? 1 : -1;

type TaskProps = {
    taskObject: TaskObject
    checkHandler: (taskObject: TaskObject) => void
}

export const Task = (props: TaskProps) => {
    const [checked, setChecked] = useState(false);
    const handleChange = () => {
        setChecked(!checked);
        props.checkHandler(props.taskObject);
    }

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
                { props.taskObject.name }
            </label>
        </div>
    );
}