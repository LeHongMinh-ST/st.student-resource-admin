import nookies from 'nookies';
import { useCallback } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { RefreshTokenPrams, useAuthService } from '@/services/authService';
import { User } from '@/types';

const { persistAtom } = recoilPersist();
const MILLISECOND = 1000;

export type AuthState = {
  isAuthentication: boolean;
  authUser: User | null;
  isRemember: boolean;
  expiresIn: number;
  refreshTokenTimeout: number;
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isAuthentication: false,
    authUser: null,
    isRemember: false,
    expiresIn: 0,
    refreshTokenTimeout: 0,
  },
  effects_UNSTABLE: [persistAtom],
});

export const useAuth = () => useRecoilValue(authState);

export const useSetAuth = () => {
  const setState = useSetRecoilState(authState);
  const setAuthState = useCallback(setState, [setState]);
  return setAuthState;
};

const getIsAuthentication = selector({
  key: 'getIsAuthentication',
  get: ({ get }) => get(authState).isAuthentication,
});

const getAuthUser = selector({
  get: ({ get }) => get(authState).authUser,
  key: 'getAuthUser',
});

const getExpiresIn = selector({
  key: 'getExpiresIn',
  get: ({ get }) => get(authState).expiresIn,
});

export const useAuthStore = () => {
  const [state, setState] = useRecoilState(authState);

  const setIsAuthentication = (isAuthentication: boolean) => {
    setState((prevState) => ({ ...prevState, isAuthentication }));
  };

  const setAuthUser = (user: User | null) => {
    setState((prevState) => ({ ...prevState, authUser: user }));
  };

  const setIsRemember = (value: boolean) => {
    setState((prevState) => ({ ...prevState, isRemember: value }));
  };

  const setExpiresIn = (expiresIn: number) => {
    setState((prevState) => ({ ...prevState, expiresIn }));
  };

  const setAccessToken = (accessToken: string, ctx = null) => {
    nookies.set(ctx, 'accessToken', accessToken, {
      maxAge: 60,
      path: '/',
    });
  };

  const setRefreshToken = (refreshToken: string, ctx = null) => {
    nookies.set(ctx, 'refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  };

  const handleRefresh = async (ctx = null) => {
    const cookies = nookies.get(ctx);
    const refreshToken = cookies?.refreshToken;
    if (refreshToken) {
      const authService = useAuthService();
      const partial = { refreshToken } as RefreshTokenPrams;

      try {
        const res: any = await authService.refreshToken(partial);
        setAccessToken(res?.data.access_token, ctx);
        startRefreshTokenTimer();
      } catch (error) {
        logout(ctx);
      }
    }
  };

  const startRefreshTokenTimer = () => {
    const timeout = state.expiresIn * MILLISECOND; // Timeout in milliseconds
    const timer = setTimeout(() => handleRefresh(), timeout);

    // Update state with the new timeout ID
    setState((prevState: AuthState) => ({
      ...prevState,
      refreshTokenTimeout: Number(timer),
    }));
  };

  const stopRefreshTokenTimer = () => {
    clearTimeout(state.refreshTokenTimeout);

    // Reset the refresh token timeout ID in the state
    setState((prevState: AuthState) => ({
      ...prevState,
      refreshTokenTimeout: 0,
    }));
  };

  const logout = (ctx = null) => {
    setState({
      isAuthentication: false,
      authUser: null,
      isRemember: false,
      expiresIn: 0,
      refreshTokenTimeout: 0,
    });
    nookies.destroy(ctx, 'accessToken');
    nookies.destroy(ctx, 'refreshToken');
    stopRefreshTokenTimer();
  };

  return {
    ...state,
    setIsAuthentication,
    setAuthUser,
    setIsRemember,
    setExpiresIn,
    setAccessToken,
    setRefreshToken,
    handleRefresh,
    startRefreshTokenTimer,
    stopRefreshTokenTimer,
    logout,
  };
};

// To use selectors:
export const useIsAuthentication = () => useRecoilValue(getIsAuthentication);
export const useAuthUser = () => useRecoilValue(getAuthUser);
export const useExpiresIn = () => useRecoilValue(getExpiresIn);
