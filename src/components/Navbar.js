import React from 'react';
import Image from 'next/image'
import { useRouter } from "next/router";
import axios from "axios";
import NavItem from './NavItem';
import NavRoutes from './Routes';
import logo from '../assets/img/logo.png';

export default function () {
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      const response = await axios.get("/api/auth/logout");
      alert(response.data.message)
      router.push("/");
    } catch (e) {
      alert(e)
    }
  };

  return (
    <section class="navigation">
      <div class="nav-container">
        <div class="brand">
          <Image src={logo} width="70" height="70" />
          <a href="/panel">
            DAC Management Portal
          </a>
        </div>
        <nav>
          <ul class="nav-list">
            {NavRoutes.map((menu, idx) => (
              <NavItem {...menu} />
            ))}
            <li><a onClick={() => logoutHandler()}> Logout </a></li>
          </ul>
        </nav>
      </div>
    </section>

  )
}