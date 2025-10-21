import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hooks examples', () => {
  render(<App />);
  const heading = screen.getByText(/Window Clicks/i);
  expect(heading).toBeInTheDocument();
});
