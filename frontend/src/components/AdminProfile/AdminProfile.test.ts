import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AdminProfile from './AdminProfile.vue';
import * as httpModule from '@/core/http';
import router from '@/router';

// Mock the http module
vi.mock('@/core/http', () => ({
  isAuthenticated: vi.fn(),
  clearAuthToken: vi.fn(),
}));

// Mock the router
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('AdminProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders correctly when not authenticated', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(false);
    localStorageMock.getItem.mockReturnValue(null);

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Not Authenticated');
    expect(wrapper.text()).toContain('You are not currently logged in');
  });
  it('renders user profile when authenticated with valid token', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);

    // Create a real JWT payload for testing
    const payload = {
      email: 'test@example.com',
      userId: '123',
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };

    // Create a mock JWT token with real base64 encoded payload
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = 'mock-signature';
    const mockToken = `${header}.${payloadB64}.${signature}`;

    localStorageMock.getItem.mockReturnValue(mockToken);

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Admin Profile');
    expect(wrapper.text()).toContain('User Information');
    expect(wrapper.text()).toContain('Token Claims');
    expect(wrapper.text()).toContain('Raw Token');
  });

  it('displays token information correctly', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);

    // Create a real JWT payload for testing
    const payload = {
      email: 'admin@example.com',
      userId: '123',
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };

    // Create a mock JWT token with real base64 encoded payload
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = 'mock-signature';
    const mockToken = `${header}.${payloadB64}.${signature}`;

    localStorageMock.getItem.mockReturnValue(mockToken);

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('admin@example.com');
    expect(wrapper.text()).toContain('123');
    expect(wrapper.text()).toContain('Valid');
  });

  it('handles token copying', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);
    const mockToken = 'mock-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    const copyButton = wrapper.find('[data-testid="copy-token-btn"]');
    await copyButton.trigger('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockToken);
  });

  it('handles logout correctly', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);
    localStorageMock.getItem.mockReturnValue('mock-token');

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    const logoutButton = wrapper.find('[data-testid="logout-btn"]');
    await logoutButton.trigger('click');

    expect(httpModule.clearAuthToken).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/admin/login');
  });

  it('handles refresh correctly', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);
    const mockToken = 'initial-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    // Change the token in localStorage
    const newToken = 'new-token';
    localStorageMock.getItem.mockReturnValue(newToken);

    const refreshButton = wrapper.find('[data-testid="refresh-btn"]');
    await refreshButton.trigger('click');

    // Should call getItem again to reload token info
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(2);
  });

  it('handles expired token correctly', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);

    // Create an expired token
    const payload = {
      email: 'admin@example.com',
      userId: '123',
      iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
    };

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = 'mock-signature';
    const mockToken = `${header}.${payloadB64}.${signature}`;

    localStorageMock.getItem.mockReturnValue(mockToken);

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Expired');
  });

  it('handles invalid token gracefully', async () => {
    vi.mocked(httpModule.isAuthenticated).mockReturnValue(true);
    localStorageMock.getItem.mockReturnValue('invalid-token');

    const wrapper = mount(AdminProfile);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Unable to decode token claims');
  });
});
