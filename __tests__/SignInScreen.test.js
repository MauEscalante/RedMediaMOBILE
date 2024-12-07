import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import SignInScreen from '../src/screens/SignInScreen';
import { useToggleContext } from '../src/context/AuthProvider';

jest.mock('../src/context/AuthProvider', () => ({
  useToggleContext: jest.fn(),
}));

jest.mock('../src/context/ThemeContext', () => ({
  useToggleMode: jest.fn(() => ({
    colors: { primary: 'blue', secondary: 'red' },
  })),
}));

const mockNavigation = { navigate: jest.fn() };

beforeEach(() => {
  useToggleContext.mockReturnValue({ login: jest.fn() });
});

describe('SignInScreen Component - Validations', () => {
  it('shows error for invalid email format', async () => {
    render(<SignInScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('email'), 'invalidemail');
    });
    expect(screen.getByTestId('error-email').props.children).toBe('Email must be well-formed');
  });

  it('shows error for empty password', async () => {
    render(<SignInScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), '');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password is required');
  });

  it('shows error for password less than 8 characters', async () => {
    render(<SignInScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa1!');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password must be at least 8 characters');
  });

  it('shows error for password greater than 16 characters', async () => {
    render(<SignInScreen />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa1!23456789012345');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password must be at most 16 characters');
  });

  it('shows error for password without uppercase letters', async () => {
    render(<SignInScreen />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'aa1!2345');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers');
  });

  it('shows error for password without lowercase letters', async () => {
    render(<SignInScreen />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'AA1!2345');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers');
  });

  it('shows error for password without a special character', async () => {
    render(<SignInScreen />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa123456');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers');
  });

  it('shows error for password without two non-consecutive numbers', async () => {
    render(<SignInScreen />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa1!1123');
    });
    expect(screen.getByTestId('error-password').props.children).toBe('Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers');
  });

  it('accepts valid email and password', async () => {
    const loginMock = jest.fn();
    useToggleContext.mockReturnValue({ login: loginMock });

    render(<SignInScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('email'), 'test@example.com');
      fireEvent.changeText(screen.getByTestId('password'), 'Aa1!2345');
    });
    await act(async () => {
      fireEvent.press(screen.getByTestId('Login'));
    });

    expect(loginMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Aa1!2345',
    });
  });
});
