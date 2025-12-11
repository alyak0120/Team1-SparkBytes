import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutClient from '../about/about-client'

import { createClient } from '@supabase/supabase-js';

describe('About client component', () => {
    it('renders the login and sign up buttons', () => {
        render(<AboutClient/>);
        expect(screen.getByLabelText('about-client-login-button')).toBeInTheDocument();
        expect(screen.getByLabelText('about-client-sign-up-button')).toBeInTheDocument();
    })
});