import Head from 'next/head';
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/login`, { username, password });
      router.push("/panel");
    } catch (e) {
      alert(e)
    }
  };

  return <>
    <Head>
      <title>DAC Management Portal</title>
      <meta name="description" content="iPC DAC-Mgt Portal" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="login-wrapper">
      <div className="form">
        <p className="form-header"> Sign in to your account </p>
        <form onSubmit={(e) => submitHandler(e)} className="login-form">
          <label> Username </label>
          <input className="input" type="text" onChange={(e) => setUsername(e.target.value)} />
          <label> Password </label>
          <input className="input" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button className="btn"> Log in </button>
        </form>
      </div>
    </div>
  </>
}
