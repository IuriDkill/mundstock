import './index.css'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from "react-i18next";

import AppRouter from '@/routes/AppRouter.tsx'
import i18n from '@/config/i18n.ts';

createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <AppRouter />
  </I18nextProvider>
)
