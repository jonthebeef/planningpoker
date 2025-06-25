import '../styles/globals.css';
import { PlanningPokerProvider } from '../contexts/PlanningPokerContext';

export default function App({ Component, pageProps }) {
  return (
    <PlanningPokerProvider>
      <Component {...pageProps} />
    </PlanningPokerProvider>
  );
} 