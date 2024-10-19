import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from 'reactstrap';
import logo from '../../public/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const router = useRouter(); // Get Next.js router

  // Helper function to determine if nav item is active
  const navItemIsActive = (path: string) => {
    return router.pathname === path;
  }

  return (
    <div>
      <Navbar container expand="md">
        <NavbarBrand href="/">
          <img
            alt="Custom Silicone Wristbands by Silicone Wristbands Australia"
            src={logo.src}
            style={{
              height: 40,
              width: 220
            }}
          />
        </NavbarBrand>
        <div className='d-flex ml-auto'>
          <NavbarText>
            <div className='d-block d-md-none'>
              <a
                href="tel:+61390014888"
                style={{
                  fontWeight: 400,
                  textDecoration: 'none',
                  color: 'inherit',
                  marginRight: '0.4rem',
                }}
              >
                <FontAwesomeIcon icon={faPhone} />
              </a>
            </div>
          </NavbarText>
          <NavbarToggler onClick={toggle}>
            <span className="navbar-toggler-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </span>
          </NavbarToggler>
        </div>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem active={navItemIsActive('/')}>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem active={navItemIsActive('/order')}>
              <NavLink href="/order">Order Now</NavLink>
            </NavItem>
            <NavItem active={navItemIsActive('/about')}>
              <NavLink href="/about">About</NavLink>
            </NavItem>
            <NavItem active={navItemIsActive('/faq')}>
              <NavLink href="/faq">FAQ</NavLink>
            </NavItem>
            <NavItem active={navItemIsActive('/contact')}>
              <NavLink href="/contact">Contact</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <NavbarText>
          <div className='d-none d-lg-block d-xl-bloxk'>
            <a
              href="tel:+61390014888"
              style={{
                fontWeight: 400,
                textDecoration: 'none',
                color: 'inherit',
                marginRight: '0.4rem',
              }}
            >
              <FontAwesomeIcon icon={faPhone} />
            </a>
            {' '}
            <a
              href="tel:+61390014888"
              style={{
                fontWeight: 900,
                letterSpacing: '1px',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              (03) 9001 4888
            </a>
          </div>
        </NavbarText>
      </Navbar>
    </div>
  );
}

export default TopBar;
