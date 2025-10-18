<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Vue TSOA MongoDB Template
        </h1>
        <p class="text-gray-600 text-sm">A Vue TSOA MongoDB Application</p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
          </h2>
          <p class="text-gray-600 text-sm">
            {{ isSignUp ? 'Create your account' : 'Sign in to your account' }}
          </p>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
          <!-- Email Input -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700" for="email">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input id="email" v-model="email" type="email" autocomplete="email" placeholder="Enter your email"
                @blur="validateEmail" @input="emailError = ''" :class="[
                  'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white',
                  emailError ? 'border-red-300 focus:ring-red-500 focus:border-transparent' : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                ]" />
            </div>
            <div v-if="emailError" class="text-sm text-red-600 flex items-center mt-1">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ emailError }}
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700" for="password">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input id="password" v-model="password" type="password"
                :autocomplete="isSignUp ? 'new-password' : 'current-password'" placeholder="Enter your password"
                @blur="validatePassword" @input="passwordError = ''" :class="[
                  'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white',
                  passwordError ? 'border-red-300 focus:ring-red-500 focus:border-transparent' : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                ]" />
            </div>
            <div v-if="passwordError" class="text-sm text-red-600 flex items-center mt-1">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ passwordError }}
            </div>
            <!-- Password Requirements (Sign Up only) -->
            <div v-if="isSignUp && password" class="text-xs text-gray-600 space-y-1 mt-2">
              <p class="font-medium">Password must contain:</p>
              <ul class="space-y-1">
                <li :class="password.length >= 8 ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  At least 8 characters
                </li>
                <li :class="/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  One uppercase letter
                </li>
                <li :class="/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  One lowercase letter
                </li>
                <li :class="/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  One number
                </li>
              </ul>
            </div>
          </div>

          <!-- Confirm Password Input (Sign Up) -->
          <div v-if="isSignUp" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700" for="confirmPassword">Confirm Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input id="confirmPassword" v-model="confirmPassword" type="password" autocomplete="new-password"
                placeholder="Confirm your password" @blur="validateConfirmPassword" @input="confirmPasswordError = ''"
                :class="[
                  'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white',
                  confirmPasswordError ? 'border-red-300 focus:ring-red-500 focus:border-transparent' : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                ]" />
            </div>
            <div v-if="confirmPasswordError" class="text-sm text-red-600 flex items-center mt-1">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ confirmPasswordError }}
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-700 font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="!isFormValid"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:transform-none">
            <span class="flex items-center justify-center">
              <svg v-if="!isSignUp" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {{ isSignUp ? 'Create Account' : 'Sign In' }}
            </span>
          </button>

          <!-- Toggle Mode -->
          <div class="text-center pt-4 border-t border-gray-100">
            <p class="text-sm text-gray-600 mb-2">
              {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            </p>
            <button type="button"
              class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline focus:outline-none focus:underline"
              @click="toggleMode">
              {{ isSignUp ? 'Sign in instead' : 'Create one now' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-xs text-gray-500">
          Secure login protected by modern encryption
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { z } from 'zod';
import { setAuthToken } from '@/core/http';
import { signup, login } from '@stupid-project-api/index';
import { useRouter } from 'vue-router';
const router = useRouter();

const isSignUp = ref(false);

const error = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Zod schemas
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const loginPasswordSchema = z.string()
  .min(1, 'Password is required');

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

// Form validation
const isFormValid = computed(() => {
  try {
    if (isSignUp.value) {
      signUpSchema.parse({
        email: email.value.trim(),
        password: password.value,
        confirmPassword: confirmPassword.value
      });
    } else {
      loginSchema.parse({
        email: email.value.trim(),
        password: password.value
      });
    }
    return true;
  } catch {
    return false;
  }
});

// Validate email
function validateEmail() {
  emailError.value = '';
  try {
    emailSchema.parse(email.value.trim());
  } catch (error) {
    if (error instanceof z.ZodError) {
      emailError.value = error.issues[0]?.message || 'Invalid email';
    }
  }
}

// Validate password
function validatePassword() {
  passwordError.value = '';
  try {
    const schema = isSignUp.value ? passwordSchema : loginPasswordSchema;
    schema.parse(password.value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      passwordError.value = error.issues[0]?.message || 'Invalid password';
    }
  }
}

// Validate confirm password
function validateConfirmPassword() {
  confirmPasswordError.value = '';
  if (isSignUp.value) {
    if (!confirmPassword.value) {
      confirmPasswordError.value = 'Please confirm your password';
    } else if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = "Passwords don't match";
    }
  }
}

// Clear errors when switching modes
function toggleMode() {
  isSignUp.value = !isSignUp.value;
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  error.value = '';
}

async function submit() {
  error.value = '';

  // Validate all fields before submission
  validateEmail();
  validatePassword();
  if (isSignUp.value) {
    validateConfirmPassword();
  }

  // Check if there are any validation errors
  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    error.value = 'Please fix the errors above';
    return;
  }

  try {
    const formData = {
      email: email.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value
    };

    if (isSignUp.value) {
      // Validate sign up form
      signUpSchema.parse(formData);

      const signUpResponse = await signup({
        body: { email: formData.email, password: formData.password },
      });

      if (signUpResponse.error) {
        error.value = signUpResponse.error;
        return;
      }

      // Switch to login mode after successful signup
      isSignUp.value = false;
      email.value = formData.email;
      password.value = '';
      confirmPassword.value = '';
      error.value = '';

    } else {
      // Validate login form
      loginSchema.parse({ email: formData.email, password: formData.password });

      const loginResponse = await login({
        body: { email: formData.email, password: formData.password }
      });

      if (loginResponse.error) {
        error.value = loginResponse.error;
        return;
      }

      if (!loginResponse.data?.token) {
        error.value = 'Missing token';
        return;
      }

      setAuthToken(loginResponse.data.token, { persist: true });
      router.push('/admin/dashboard');
    }
  } catch (validationError) {
    if (validationError instanceof z.ZodError) {
      error.value = validationError.issues[0]?.message || 'Form validation failed';
    } else {
      error.value = 'An unexpected error occurred';
    }
  }
}
</script>
