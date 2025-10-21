import React from "react";

function useInput(initialValue) {
    const [value, setValue] = React.useState(initialValue);
    const onChange = e => setValue(e.target.value);
    const reset = () => setValue(initialValue);
    return { value, onChange, reset };
}

function Form(){
    const name = useInput('');
    return(
        <input {...name} type="text" placeholder="Enter name:"/>
    );
};

function useWindowWidth() {
    const [width, setWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    React.useEffect(()=>{
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
}

function Header(){
    const width = useWindowWidth();
    return <h1>Window width: {width}px</h1>;
}

const AuthContext = React.createContext();

function useAuth(){
    const context = React.useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

function useLocalStorage(key, initialValue){
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (e) {
            return initialValue;
        }
    });

    React.useEffect(()=>{
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (e) {
            setStoredValue(initialValue);
        }
    }, [key, initialValue]);

    const setValue = value => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
    };

    return [storedValue, setValue];
}

function AddToLocalStorageDemo(){
    const [name, setName] = useLocalStorage('name', 'Guest');
    const [value, setValue] = React.useState(name ?? '');
    React.useEffect(() => { setValue(name ?? ''); }, [name]);
    return(
        <div>
            <p>Name: {name}</p>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <button onClick={() => setName(value)}>Save Name</button>

        </div>
    );
}

export { useInput, Form, useWindowWidth, Header, useAuth, AuthContext, useLocalStorage, AddToLocalStorageDemo };