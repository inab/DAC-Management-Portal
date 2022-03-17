import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";

export default function () {
  const { data: session} = useSession();
  return (
    <nav class="navbar navbar-light navbar-expand-sm">
        <div class="container-fluid">
            <Link class="navbar-brand" href="/">
                <a style={{fontWeight: 'bold', fontSize: 16, cursor: 'pointer', textDecoration: 'none'}}> DAC Management Portal </a>
            </Link>
            <button class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
              <ul class="navbar-nav ml-auto">
              {session?(<>
                <Link href="/create"> 
                  <a style={{fontWeight: 'bold', fontSize: 16, cursor: 'pointer', textDecoration: 'none'}}> Create DACs </a> 
                </Link>
                <Link href="/roles"> 
                  <a style={{fontWeight: 'bold', fontSize: 16, cursor: 'pointer', textDecoration: 'none'}}> DAC roles </a> 
                </Link>
                <Link href="/resources"> 
                  <a style={{fontWeight: 'bold', fontSize: 16, cursor: 'pointer', textDecoration: 'none'}}> DAC resources </a> 
                </Link>
                <button onClick={() => signOut()}>Sign out</button></>):
                (<button onClick={() => signIn()}>Sign in</button>)}
              </ul>
            </div>
        </div>
    </nav>
)}