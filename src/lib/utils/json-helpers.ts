// ============================================
// CREATE THIS FILE
// Path: src/lib/utils/json-helpers.ts
// ============================================

/**
 * Converts typed objects to JSON-compatible format for Supabase
 * This is needed because Supabase expects Json type for JSONB columns
 */
export function toJson<T>(value: T): any {
  return JSON.parse(JSON.stringify(value))
}

/**
 * Safely converts arrays to JSON format
 */
export function arrayToJson<T>(array: T[]): any[] {
  return JSON.parse(JSON.stringify(array))
}

/**
 * Type guard to check if value is valid JSON
 */
export function isValidJson(value: any): boolean {
  try {
    JSON.parse(JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Convert from Supabase Json back to typed object
 */
export function fromJson<T>(value: any): T {
  return value as T
}

// ============================================
// ALTERNATIVE: If you don't want to create the file
// Just use inline conversion in your quoteService.ts
// ============================================

// Replace this:
// import { toJson } from '@/lib/utils/json-helpers'

// With this inline helper at the top of quoteService.ts:
// const toJson = <T,>(value: T): any => JSON.parse(JSON.stringify(value))

// Then use it as:
// incomers: toJson(item.incomers),