import * as React from 'react';
import { Form } from './components/Form';

function App() {
    const personName = {
        firstName: 'Bruce',
        lastName: 'Wayne'
    }

    const nameList = [
        {
            firstName: 'Bruce',
            lastName: 'Wayne'
        },
        {
            firstName: 'Clark',
            lastName: 'Kent'
        },
        {
            firstName: 'Princess',
            lastName: 'Diana'
        }
    ]

    return (
        <div className="App">
            <Form />
        </div>
    )
}

export default App;
