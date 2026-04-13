// Purpose: This module handles application logic and UI.

import Navbar from "../../components/Navbar";

// Render the main application component.
export default function ModulesLayout({ children }) {
  // Render the JSX layout for this section.
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

