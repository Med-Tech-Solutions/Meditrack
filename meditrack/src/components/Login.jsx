import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

const Login = props => {
    
    const [errorMessage, setErrorMessage] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then((data) => {
            if (data.ok) return data.json()
            else {
                setErrorMessage(true)};
                throw new Error ({err: 'login credntials are incorrect'});
        }).then((data) => {
            if (data.firstName){
                console.log(data);
                localStorage.setItem('email', email);
                localStorage.setItem('firstName', data.firstName);
                navigate(`/dashboard/${email}`);
            }
        }).catch((Error) => {
            console.log(Error)
        })
    };
    
    return(
            <div style={{height: "89vh", overflow: "hidden"}}>
                <div className="form-container">
                    <h3>Login:</h3>
                    <form className="form-input" onSubmit={(event) => {
                        event.preventDefault();
                        handleLogin();
                        console.log('hello')}}>
                        <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        >
                        </input>
                        <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        >
                        </input><br></br>
                        <input type="submit"></input>
                    </form>
                    {errorMessage && <p className="login-error">Email or password is incorrect!</p>}
                </div>
            </div>
    );
};

export default Login;