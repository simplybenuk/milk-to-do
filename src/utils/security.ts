
/**
 * Security utility functions for input validation and sanitization
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validates and sanitizes task title input
 */
export function validateTaskTitle(title: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!title || typeof title !== 'string') {
    return { isValid: false, sanitized: '', error: 'Title is required' };
  }

  const sanitized = sanitizeHtml(title);
  
  if (sanitized.length < 1) {
    return { isValid: false, sanitized, error: 'Title cannot be empty' };
  }
  
  if (sanitized.length > 500) {
    return { isValid: false, sanitized, error: 'Title must be 500 characters or less' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates and sanitizes tag name input
 */
export function validateTagName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Tag name is required' };
  }

  const sanitized = name.replace(/[<>"'&]/g, '').trim();
  
  if (sanitized.length < 1) {
    return { isValid: false, sanitized, error: 'Tag name cannot be empty' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, sanitized, error: 'Tag name must be 50 characters or less' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validates username input
 */
export function validateUsername(username: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!username || typeof username !== 'string') {
    return { isValid: false, sanitized: '', error: 'Username is required' };
  }

  const sanitized = username.trim();
  
  if (sanitized.length < 3) {
    return { isValid: false, sanitized, error: 'Username must be at least 3 characters' };
  }
  
  if (sanitized.length > 30) {
    return { isValid: false, sanitized, error: 'Username must be 30 characters or less' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { isValid: true, sanitized };
}

/**
 * Rate limiting utility for client-side operations
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  /**
   * Check if an operation should be rate limited
   * @param key - Unique identifier for the operation
   * @param maxRequests - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   */
  isRateLimited(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return true;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return false;
  }
  
  /**
   * Clear rate limiting data for a key
   */
  clearKey(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Validates expiry date input
 */
export function validateExpiryDate(date: Date | string): { isValid: boolean; error?: string } {
  const expiryDate = new Date(date);
  const now = new Date();
  const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  if (isNaN(expiryDate.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (expiryDate <= now) {
    return { isValid: false, error: 'Expiry date must be in the future' };
  }
  
  if (expiryDate > oneYearFromNow) {
    return { isValid: false, error: 'Expiry date cannot be more than 1 year in the future' };
  }
  
  return { isValid: true };
}

/**
 * Logs security events for monitoring
 */
export function logSecurityEvent(event: string, details: any = {}) {
  console.warn(`Security Event: ${event}`, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details
  });
}
