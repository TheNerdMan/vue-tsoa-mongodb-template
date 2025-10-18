import { mount, type VueWrapper } from '@vue/test-utils';
import AdminLogin from './AdminLogin.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the API functions
vi.mock('@vue-tsoa-mongodb-template-api/index', () => ({
  signup: vi.fn(),
  login: vi.fn(),
}));

// Mock the http module
vi.mock('@/core/http', () => ({
  setAuthToken: vi.fn(),
}));

describe('AdminLogin.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminLogin>>;

  beforeEach(() => {
    wrapper = mount(AdminLogin);
  });

  it('renders email and password inputs', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('renders login button', () => {
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows sign up mode when toggled', async () => {
    const toggleButton = wrapper.find('button[type="button"]');
    await toggleButton.trigger('click');

    expect(wrapper.text()).toContain('Create Account');
    expect(wrapper.find('#confirmPassword').exists()).toBe(true);
  });

  it('validates email format', async () => {
    const emailInput = wrapper.find('#email');
    await emailInput.setValue('invalid-email');
    await emailInput.trigger('blur');

    expect(wrapper.text()).toContain('Please enter a valid email address');
  });

  it('validates password requirements in sign up mode', async () => {
    const toggleButton = wrapper.find('button[type="button"]');
    await toggleButton.trigger('click');

    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue('weak');
    await passwordInput.trigger('blur');

    expect(wrapper.text()).toContain('Password must be at least 8 characters long');
  });

  it('validates password confirmation in sign up mode', async () => {
    const toggleButton = wrapper.find('button[type="button"]');
    await toggleButton.trigger('click');

    const passwordInput = wrapper.find('#password');
    const confirmPasswordInput = wrapper.find('#confirmPassword');

    await passwordInput.setValue('Password123');
    await confirmPasswordInput.setValue('Different123');
    await confirmPasswordInput.trigger('blur');

    expect(wrapper.text()).toContain("Passwords don't match");
  });

  it('disables submit button when form is invalid', async () => {
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('enables submit button when form is valid for login', async () => {
    const emailInput = wrapper.find('#email');
    const passwordInput = wrapper.find('#password');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password');

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeUndefined();
  });
});
