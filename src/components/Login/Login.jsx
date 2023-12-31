import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if (action.type === 'userInput') {
    return { value: action.val, isValid: action.val.includes('@') }
  }
  if (action.type === 'inputBlur') {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: false, }
}

const passwordReducer = (state, action) => {
  if (action.type === 'passwordInput') {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  }
  if (action.type === 'passwordBlur') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false, }
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: false,
  })

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: false,
  })

  const authCtx = useContext(AuthContext)

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500)
    return () => {
      console.log('cleanup')
      clearTimeout(identifier)
    }
  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'userInput', val: event.target.value })
    setFormIsValid(
      event.target.value.includes('@') && passwordState.isValid
    )
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'passwordInput', val: event.target.value });
    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    )
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'inputBlur' })
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'passwordBlur' })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value)
    } else if (!emailIsValid) {
      emailInputRef.current.focus()
    } else {
      passwordInputRef.current.focus()
    }
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
        ref={emailInputRef}
        id="email"
        label="E-Mail" 
        type="email" 
        isValid={emailIsValid} 
        value={emailState.value} 
        onChange={emailChangeHandler} 
        onBlur={validateEmailHandler} 
        />
        <Input 
        ref={passwordInputRef}
        id="password"
        label="Password" 
        type="password" 
        isValid={passwordIsValid} 
        value={passwordState.value} 
        onChange={passwordChangeHandler} 
        onBlur={validatePasswordHandler} 
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
