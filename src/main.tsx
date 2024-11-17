import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import SortingVisualizer from './components/sorting-visualizer.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SortingVisualizer />
  </StrictMode>,
)
