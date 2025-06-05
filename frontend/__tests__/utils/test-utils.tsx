import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function that includes common providers
export function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add any global providers here
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { act };

// Export custom render as render
export { customRender as render };

// Export userEvent with setup
export { userEvent };

// Utility to wait for async operations
export const waitForAsync = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

// Mock data generators
export const mockData = {
  user: (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  }),
  
  product: (overrides = {}) => ({
    id: '1',
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    ...overrides,
  }),
};

// Custom assertions
export const customAssertions = {
  toBeAccessible: async (container: HTMLElement) => {
    // Basic accessibility checks
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
    });
    
    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  },
};