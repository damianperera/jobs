import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search bar', () => {
  render(<App />);
  const searchBar = screen.getByPlaceholderText(/Search from 0 community sourced jobs in tech/i);
  expect(searchBar).toBeInTheDocument();
});
