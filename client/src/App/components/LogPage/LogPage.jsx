import React, { useState } from 'react'
import { Login } from '../Layout/Login/Login'
import { ForgetPassword } from '../Layout/ForgetPassword/ForgetPassword'
import SignInForm from '../Layout/SignInForm/SignInForm'
import { ResetPassword } from '../Layout/ForgetPassword/ResetPassword/ResetPassword'

export function LogPage({ setDisplayForm, displayForm, setPage, hasToken }) {

    if (displayForm === "login") {

        return (
            <div>
                <Login setDisplayForm={setDisplayForm} displayForm={displayForm} setPage={setPage} />
            </div>
        )

    }

    else if (displayForm === "forgetPassword") {

        return (
            <div>
                {hasToken ? <ResetPassword setPage={setPage} /> : <ForgetPassword setDisplayForm={setDisplayForm} />}
            </div>
        )

    }

    else if (displayForm === "signIn") {

        return (
            <div>
                <SignInForm setDisplayForm={setDisplayForm} displayForm={displayForm} />
            </div>

        )

    }

}