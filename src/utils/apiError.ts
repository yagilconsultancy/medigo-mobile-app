/**
 * Pulls a user-facing message out of an API error.
 * Backend shape: { success, message, error_code, details }. FastAPI's own
 * errors use { detail } (string or list), so that is kept as a fallback.
 */
export const getApiErrorMessage = (error: any, fallback: string): string => {
  const data = error?.response?.data;

  // Validation errors carry a generic message; the field problem is in details.
  if (Array.isArray(data?.details) && data?.error_code === "VALIDATION_ERROR") {
    const first = data.details[0];
    if (typeof first?.msg === "string" && first.msg) {
      return first.msg;
    }
  }

  if (typeof data?.message === "string" && data.message) {
    return data.message;
  }

  const detail = data?.detail;
  if (typeof detail === "string" && detail) {
    return detail;
  }
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") {
    return detail[0].msg;
  }

  return fallback;
};
