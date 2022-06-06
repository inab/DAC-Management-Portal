import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import NavItem from './NavItem';
import NavRoutes from './Routes';
import logo from '../assets/img/logo.png';

export default function Navbar() {
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
    <section className="navigation">
      <div className="nav-container">
        <div className="brand">
          <Image src={logo} width="70" height="70" alt="logo" />
          <Link href="/panel">
            DAC Management Portal
          </Link>
        </div>
        <nav>
          <ul className="nav-list">
            {NavRoutes.map((menu, idx) => (
              <NavItem {...menu} key={idx} />
            ))}
            <li><a onClick={() => logoutHandler()}> Logout </a></li>
          </ul>
        </nav>
      </div>
    </section>

  )
}