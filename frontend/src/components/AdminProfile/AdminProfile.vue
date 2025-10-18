<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Profile
        </h1>
        <p class="text-gray-600">Your authentication details and token information</p>
      </div>

      <div class="space-y-6">
        <!-- User Information Card -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800">User Information</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p class="text-gray-900 font-mono text-sm">{{ userEmail || 'Not available' }}</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">User ID</label>
              <p class="text-gray-900 font-mono text-sm">{{ userId || 'Not available' }}</p>
            </div>
          </div>
        </div>

        <!-- Token Claims Card -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800">Token Claims</h2>
          </div>

          <div v-if="tokenClaims" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Issued At</label>
                <p class="text-gray-900 text-sm">{{ formatTimestamp(tokenClaims.iat) }}</p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Expires At</label>
                <p class="text-gray-900 text-sm">{{ formatTimestamp(tokenClaims.exp) }}</p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">All Claims</label>
              <pre
                class="text-xs text-gray-700 overflow-x-auto bg-white p-3 rounded border">{{ JSON.stringify(tokenClaims, null, 2) }}</pre>
            </div>
          </div>

          <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-yellow-800">Unable to decode token claims. The token may be invalid or malformed.</p>
          </div>
        </div>

        <!-- Raw Token Card -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m-6 2a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H7z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800">Raw Token</h2>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-600">JWT Token</label>
              <button @click="copyToken" data-testid="copy-token-btn"
                class="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <div class="bg-white p-3 rounded border max-h-32 overflow-y-auto">
              <p class="text-xs text-gray-700 font-mono break-all">{{ rawToken }}</p>
            </div>
          </div>
        </div>

        <!-- Token Status -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800">Token Status</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                isTokenExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              ]">
                <span :class="[
                  'w-1.5 h-1.5 rounded-full mr-1.5',
                  isTokenExpired ? 'bg-red-400' : 'bg-green-400'
                ]"></span>
                {{ isTokenExpired ? 'Expired' : 'Valid' }}
              </span>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Time Until Expiry</label>
              <p class="text-gray-900 text-sm">{{ timeUntilExpiry }}</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Token Age</label>
              <p class="text-gray-900 text-sm">{{ tokenAge }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center space-x-4">
          <button @click="refreshTokenInfo" data-testid="refresh-btn"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          <button @click="logout" data-testid="logout-btn"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { isAuthenticated, clearAuthToken } from '@/core/http';
import { useRouter } from 'vue-router';

const router = useRouter();

// Types
interface TokenClaims {
  iat?: number;
  exp?: number;
  email?: string;
  userId?: string;
  id?: string;
  sub?: string;
  [key: string]: unknown;
}

// Reactive state
const copied = ref(false);
const currentTime = ref(Date.now());

// Token management
const rawToken = ref<string>('');
const tokenClaims = ref<TokenClaims | null>(null);

// Update current time every second
let timeInterval: NodeJS.Timeout;

onMounted(() => {
  loadTokenInfo();
  timeInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

// JWT decoder utility
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Load token information
function loadTokenInfo() {
  try {
    const token = localStorage.getItem('memory-soup:auth-token');
    if (token) {
      rawToken.value = token;
      tokenClaims.value = decodeJWT(token);
    }
  } catch (error) {
    console.error('Error loading token:', error);
  }
}

const userEmail = computed(() => {
  return tokenClaims.value?.email || tokenClaims.value?.sub || null;
});

const userId = computed(() => {
  return tokenClaims.value?.userId || tokenClaims.value?.id || tokenClaims.value?.sub || null;
});

const isTokenExpired = computed(() => {
  if (!tokenClaims.value?.exp) return false;
  return tokenClaims.value.exp * 1000 < currentTime.value;
});

const timeUntilExpiry = computed(() => {
  if (!tokenClaims.value?.exp) return 'Unknown';

  const expiryTime = tokenClaims.value.exp * 1000;
  const timeDiff = expiryTime - currentTime.value;

  if (timeDiff <= 0) return 'Expired';

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
});

const tokenAge = computed(() => {
  if (!tokenClaims.value?.iat) return 'Unknown';

  const issuedTime = tokenClaims.value.iat * 1000;
  const timeDiff = currentTime.value - issuedTime;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Utility functions
function formatTimestamp(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp * 1000).toLocaleString();
}

function copyToken() {
  if (rawToken.value) {
    navigator.clipboard.writeText(rawToken.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}

function refreshTokenInfo() {
  loadTokenInfo();
}

function logout() {
  clearAuthToken();
  router.push('/admin/login');
}
</script>
