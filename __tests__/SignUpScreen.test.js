import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import SignUpScreen from '../src/screens/SignUpScreen';
import { signUp } from '../src/controller/miApp.controller';

jest.mock('../src/controller/miApp.controller');

jest.mock('../src/context/ThemeContext', () => ({
  useToggleMode: jest.fn(() => ({
    colors: { primary: 'blue', secondary: 'red' },
  })),
}));

describe('SignUpScreen - Validations', () => {
  beforeEach(() => {
    signUp.mockReset();
  });

  const renderComponent = () => {
    render(<SignUpScreen />);
  };

  it('shows error for name with less than 3 characters', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('name'), 'Jo');
    });
    expect(screen.getByTestId('error-name').props.children).toContain(
      'Name must contain only letters and be 3 to 16 characters long'
    );
  });

  it('shows error for name with more than 16 characters', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId('name'),
        'JohnJacobJingleheimerSchmidt'
      );
    });
    expect(screen.getByTestId('error-name').props.children).toContain(
      'Name must contain only letters and be 3 to 16 characters long'
    );
  });

  it('shows error for name containing numbers', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('name'), 'John123');
    });
    expect(screen.getByTestId('error-name').props.children).toContain(
      'Name must contain only letters and be 3 to 16 characters long'
    );
  });

  it('shows error for name containing special characters', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('name'), 'John@Doe');
    });
    expect(screen.getByTestId('error-name').props.children).toContain(
      'Name must contain only letters and be 3 to 16 characters long'
    );
  });

  it('shows error for invalid email', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('email'), 'invalidemail');
    });
    expect(screen.getByTestId('error-email').props.children).toBe(
      'Email must be well-formed'
    );
  });

  it('shows error for password less than 8 characters', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa1!');
    });
    expect(screen.getByTestId('error-password').props.children).toBe(
      'Password must be at least 8 characters'
    );
  });

  it('shows error for password without uppercase letters', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'aa1!2345');
    });
    expect(screen.getByTestId('error-password').props.children).toBe(
      'Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers'
    );
  });

  it('shows error for password without lowercase letters', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'AA1!2345');
    });
    expect(screen.getByTestId('error-password').props.children).toBe(
      'Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers'
    );
  });

  it('shows error for password without a special character', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa123456');
    });
    expect(screen.getByTestId('error-password').props.children).toBe(
      'Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers'
    );
  });

  it('shows error for password without two non-consecutive numbers', async () => {
    renderComponent();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('password'), 'Aa1!1123');
    });
    expect(screen.getByTestId('error-password').props.children).toBe(
      'Password must include at least one uppercase letter, one lowercase letter, one special character, and at least two non-consecutive numbers'
    );
  });
});
