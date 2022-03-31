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
      <title>DAC Management</title>
      <meta name="description" content="iPC DAC-Mgt Portal" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <br></br>
    <h2 class="title"> DAC Management Portal </h2>
    <br></br>
    <div class="form">
      <form onSubmit={(e) => submitHandler(e)} class="login-form">
        <label> Username </label>
        <input class="input" type="text" onChange={(e) => setUsername(e.target.value)}/>
        <label> Password </label>
        <input class="input" type="password" onChange={(e) => setPassword(e.target.value)}/>
        <button class="btn"> Log in </button>
      </form>
    </div>
  </>
}
