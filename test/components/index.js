import React, { useEffect, useState } from 'react';
import { useSyncState } from '../../public/index';

const App = () => {
    const [name, setName] = useSyncState('Tom')
    
    useEffect(() => {
        expect(name.state).toBe('Tom')
        expect(name.current).toBe('Tom')
    }, [])

    return <div>Hello</div>;
}

export default App