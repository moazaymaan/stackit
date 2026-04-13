// Purpose: This module handles application logic and UI.

import { redirect } from 'next/navigation';

// Render the main application component.
export default function RootPage() {
  redirect('/auth');
}

