import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, domAnimation } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@fontsource-variable/inter/index.css';
import '@fontsource/noto-sans-telugu/400.css';
import '@fontsource/noto-sans-telugu/600.css';
import './theme/tokens.css';
import queryClient from './lib/queryClient';
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* `strict` is intentionally omitted: every layout component here uses the full
          `motion.*` API (matching the spec's own component code), and `strict` mode
          throws at runtime unless everything is converted to the lazy `m.*` component. */}
      <LazyMotion features={domAnimation}>
        <App />
      </LazyMotion>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);
