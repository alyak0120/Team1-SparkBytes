import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutClient from '../about/about-client'

import { Button } from 'antd';
import Link from 'antd/lib/typography/Link';
import { beforeEach } from 'node:test';

describe('SparkBytes! header', () => {
    describe('Navigation buttons', () => {
        it('only render the About section when no user is present', () => {
            let testUser = null;
            render(
                <div>
                    { testUser == null ? ( // Simulating that no user is logged in
                        <div className="max-w-6xl py-3 px-4 flex gap-2 items-center">
                            <Button aria-label='nav-button-about' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/">About</Link></Button>
                        </div> ) : (
                        <div className="max-w-6xl py-3 px-4 flex gap-2 items-center">
                            <Button aria-label='nav-button-events' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/event">Events</Link></Button>
                            <Button aria-label='nav-button-account' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/dashboard">Your Account</Link></Button>
                            <Button aria-label='nav-button-about' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/">About</Link></Button>
                        </div> ) 
                    }
                </div>
            );

            expect(screen.getByLabelText('nav-button-about')).toBeInTheDocument();
            
            expect(screen.queryByLabelText('nav-button-events')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('nav-button-account')).not.toBeInTheDocument();
        });
        
        it('render all buttons when a user is present', () => {
            let testUser = { // Sample user object
                name: "user name",
                email: "testuser@bu.edu",
            };
            render(
                <div>
                    { testUser == null ? ( // Simulating the an authenticated user
                        <div className="max-w-6xl py-3 px-4 flex gap-2 items-center">
                            <Button aria-label='nav-button-about' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/">About</Link></Button>
                        </div> ) : (
                        <div className="max-w-6xl py-3 px-4 flex gap-2 items-center">
                            <Button aria-label='nav-button-events' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/event">Events</Link></Button>
                            <Button aria-label='nav-button-account' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/dashboard">Your Account</Link></Button>
                            <Button aria-label='nav-button-about' size="sm" style={{backgroundColor: "#CC0000", color: "white"}}><Link href="/">About</Link></Button>
                        </div> ) 
                    }
                </div>
            );

            expect(screen.getByLabelText('nav-button-about')).toBeInTheDocument();
            expect(screen.getByLabelText('nav-button-events')).toBeInTheDocument();
            expect(screen.getByLabelText('nav-button-account')).toBeInTheDocument();
        });

    });

    describe('Authentication buttons', () => {
        it('renders the sign up and sign in buttons when no user is authenticated', () => {
            let testUser = null;
            render(
                <div>
                    { testUser == null ? (
                        <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline">
                                <Link href="/auth/login">Sign in</Link>
                            </Button>
                            <Button asChild size="sm" variant="default" style={{backgroundColor: "#CC0000", color: "white"}}>
                                <Link href="/auth/sign-up">Sign up</Link>
                            </Button>
                        </div> ) : (
                        <div style={{color: "black"}} className="flex items-center gap-4">
                            Hey, {testUser.email}!
                            <Button
                                size="sm"
                                style={{ backgroundColor: "#CC0000", color: "white" }}
                            >
                                Logout
                            </Button>
                        </div> )
                    }
                </div>
            );

            expect(screen.getByText("Sign up")).toBeInTheDocument();
            expect(screen.getByText("Sign in")).toBeInTheDocument();

            expect(screen.queryByText("Logout")).not.toBeInTheDocument();
            // expect(screen.queryByText(`${testUser.email}`)).not.toBeInTheDocument();
        });
        
        it('renders the logout button and the user\'s email when the user is authenticated', () => {
            let testUser = { // Sample user object
                name: "user name",
                email: "testuser@bu.edu",
            };
            render(
                <div>
                    { testUser == null ? (
                        <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline">
                                <Link href="/auth/login">Sign in</Link>
                            </Button>
                            <Button asChild size="sm" variant="default" style={{backgroundColor: "#CC0000", color: "white"}}>
                                <Link href="/auth/sign-up">Sign up</Link>
                            </Button>
                        </div> ) : (
                        <div style={{color: "black"}} className="flex items-center gap-4">
                            Hey, {testUser.email}!
                            <Button
                                size="sm"
                                style={{ backgroundColor: "#CC0000", color: "white" }}
                            >
                                Logout
                            </Button>
                        </div> )
                    }
                </div>
            );

            expect(screen.queryByText("Logout")).toBeInTheDocument();

            expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
            expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
        });
    });
});