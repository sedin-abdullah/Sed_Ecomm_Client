import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getApiErrorMessage } from './apiError';

function axiosErrorWith(data: unknown): AxiosError {
  const err = new AxiosError('Request failed');
  err.response = {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
  return err;
}

describe('getApiErrorMessage', () => {
  it('prefers the first field-level validation error', () => {
    const err = axiosErrorWith({
      success: false,
      message: 'Validation failed',
      errors: [{ field: 'description', message: 'String must contain at least 10 character(s)' }],
    });
    expect(getApiErrorMessage(err)).toBe('String must contain at least 10 character(s)');
  });

  it('falls back to the response message when there are no field errors', () => {
    const err = axiosErrorWith({ success: false, message: 'Forbidden' });
    expect(getApiErrorMessage(err)).toBe('Forbidden');
  });

  it('uses the provided fallback for non-axios errors', () => {
    expect(getApiErrorMessage(new Error('boom'), 'Failed to save')).toBe('Failed to save');
  });
});
