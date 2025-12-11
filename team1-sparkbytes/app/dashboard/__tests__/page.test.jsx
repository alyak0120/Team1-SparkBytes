import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DashboardPage from '../page'

import { createClient } from '@supabase/supabase-js';

import { Input } from 'antd';
import Text from "antd/lib/typography/Text";

const supabaseTest = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, // Test Supabase URL
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY // Test Supabase anon key
);

const testUser = {
    email: 'confirmeduser@bu.edu',
    password: 'test1234',
    name: "Test User",
    BUID: "UXXXXXXXX"
};

const testReservations =
[
    {
        id: 0,
        title: "Reservation 1",
    },
    {
        id: 1,
        title: "Reservation 2"
    }
];

const testBookmarks =
[
    {
        id: 0,
        event_title: "Bookmark 1",
    },
    {
        id: 1,
        event_title: "Bookmark 2"
    }
];

// Unit tests
describe('Dashboard account page', () => {
    beforeEach(() => {
        // Clears all mocks before each test runs
        jest.clearAllMocks();
    })

    it('renders the account page and the page section headers', () => {
        render(<DashboardPage/>);

        expect(screen.getByText("Account Information")).toBeInTheDocument();
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Reservations")).toBeInTheDocument();
        expect(screen.getByText("Bookmarks")).toBeInTheDocument();
        expect(screen.getByText("Notifications")).toBeInTheDocument();
    });
    
    it('renders the Profile section headers', () => {
        render(<DashboardPage/>);

        expect(screen.getByText('Full Name:')).toBeInTheDocument();
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('BU ID:')).toBeInTheDocument();
    })
    it('renders the update profile image button', () => {
        render(<DashboardPage/>);

        expect(screen.getByText("Update Profile Image")).toBeInTheDocument();
    })
})

describe('Profile section', () => {
    it('renders a user\'s information onto the profile section', () => {
        render(
            <div style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 20 }}>Full Name:</Text>
                <Input aria-label='input_name' style={{ width: 200 }} value={testUser.name} readOnly />
                <Text style={{ fontSize: 20 }}>Email:</Text>
                <Input aria-label='input_email' style={{ width: 200 }} value={testUser.email} readOnly />
                <Text style={{ fontSize: 20 }}>BU ID:</Text>
                <Input aria-label='input_BUID' style={{ width: 200 }} value={testUser.BUID} readOnly />
            </div>
        );

        expect(screen.getByRole('textbox', {name: "input_name"})).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: "input_email"})).toBeInTheDocument();
        expect(screen.getByRole('textbox', {name: "input_BUID"})).toBeInTheDocument();
    });
});

describe('Reservations section', () => {
    it('renders a user\'s reservations onto the reservation section', () => {
        render(
            <div style={{ paddingLeft: 10 }}>
                {testReservations.length > 0 ? (
                    testReservations.map((r) => (
                    <div key={r.id}>
                        <Text style={{ fontSize: 20 }}>&quot;{r.title}&quot;</Text>
                        <br />
                    </div>
                    ))
                ) : (
                    <Text style={{ fontSize: 20 }}>None yet</Text>
                )}
            </div>
        );

        expect(screen.getByText('\"Reservation 1\"')).toBeInTheDocument();
        expect(screen.getByText('\"Reservation 2\"')).toBeInTheDocument();

        expect(screen.queryByText('\"Reservation 3\"')).not.toBeInTheDocument();
    });

    it('renders the default text when a user has no reservations', () => {
        render(
            <div style={{ paddingLeft: 10 }}>
                {[].length > 0 ? (
                    [].map((r) => (
                    <div key={r.id}>
                        <Text style={{ fontSize: 20 }}>&quot;{r.title}&quot;</Text>
                        <br />
                    </div>
                    ))
                ) : (
                    <Text style={{ fontSize: 20 }}>None yet</Text>
                )}
            </div>
        );

        expect(screen.getByText('None yet')).toBeInTheDocument();

        expect(screen.queryByText('\"Reservation 1\"')).not.toBeInTheDocument();
        expect(screen.queryByText('\"Reservation 2\"')).not.toBeInTheDocument();
        expect(screen.queryByText('\"Reservation 3\"')).not.toBeInTheDocument();
    });
});

describe('Bookmarks section', () => {
    it('renders a user\'s bookmarks when they have some', () => {
        render(
            <div style={{ paddingLeft: 10 }}>
                {testBookmarks.length > 0 ? (
                    testBookmarks.map((b) => (
                    <div key={b.id}>
                        <Text style={{ fontSize: 20 }}>&quot;{b.event_title}&quot;</Text>
                        <br />
                    </div>
                    ))
                ) : (
                    <Text style={{ fontSize: 20 }}>None</Text>
                )}
            </div>
        );

        expect(screen.getByText('\"Bookmark 1\"')).toBeInTheDocument();
        expect(screen.getByText('\"Bookmark 2\"')).toBeInTheDocument();
        expect(screen.queryByText('\"Bookmark 3\"')).not.toBeInTheDocument();
    });

    it('renders the default text when a user has no bookmarks', () => {
        render(
            <div style={{ paddingLeft: 10 }}>
                {[].length > 0 ? (
                    [].map((b) => (
                    <div key={b.id}>
                        <Text style={{ fontSize: 20 }}>&quot;{b.event_title}&quot;</Text>
                        <br />
                    </div>
                    ))
                ) : (
                    <Text style={{ fontSize: 20 }}>None</Text>
                )}
            </div>
        );
        
        expect(screen.getByText('None')).toBeInTheDocument();

        expect(screen.queryByText('\"Bookmark 1\"')).not.toBeInTheDocument();
        expect(screen.queryByText('\"Bookmark 2\"')).not.toBeInTheDocument();
        expect(screen.queryByText('\"Bookmark 3\"')).not.toBeInTheDocument();
    });
});