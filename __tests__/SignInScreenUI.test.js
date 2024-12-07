import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInScreen from '../src/screens/SignInScreen';
import { AuthProvider, useUserContext } from '../src/context/AuthProvider';
import * as Keychain from 'react-native-keychain';
import { signIn as signInAPI } from '../src/controller/miApp.controller';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn().mockResolvedValue(null),
  setGenericPassword: jest.fn().mockResolvedValue(undefined),
  resetGenericPassword: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/controller/miApp.controller', () => ({
  signIn: jest.fn(),
}));

jest.mock('../src/context/ThemeContext', () => ({
  useToggleMode: jest.fn(() => ({
    colors: { primary: 'blue', secondary: 'red' },
  })),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({
      user: {
        email: 'test@example.com',
        id: '1234567890',
      },
    }),
    signOut: jest.fn(),
  },
}));

describe('SignInScreen with AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log in successfully, save token, update authState.isAuthenticated=true to navigate to Home', async () => {
    const mockNavigate = jest.fn();

    signInAPI.mockResolvedValue({
      token: 'mocked-token',
      user: { email: 'bautistafantauzzo@gmail.com', name: 'bautista' },
    });

    let authState;
    const TestComponent = () => {
      authState = useUserContext();
      return <SignInScreen navigation={{ navigate: mockNavigate }} />;
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.changeText(getByTestId('email'), 'bautistafantauzzo@gmail.com');
    fireEvent.changeText(getByTestId('password'), 'Redmedi@2');
    fireEvent.press(getByTestId('Login'));

    await waitFor(() => {
      expect(signInAPI).toHaveBeenCalledWith({
        email: 'bautistafantauzzo@gmail.com',
        password: 'Redmedi@2',
      });
    });

    await waitFor(() => {
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'username',
        'mocked-token',
        { service: 'token' }
      );
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'username',
        JSON.stringify({ email: 'bautistafantauzzo@gmail.com', name: 'bautista' }),
        { service: 'user' }
      );
    });

    await waitFor(() => {
      expect(authState.isAuthenticated).toBe(true);
    });
  });
});
