import { useState } from 'react';

import styles from './App.module.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <h1>Upload App</h1>
        {user ? <button>Sign out</button> : <button>Sign In</button>}
      </nav>

      <main>
        {user ? (
          <div>
            <h2>User logged in</h2>

            <h2>Files</h2>
          </div>
        ) : (
          <div>Please log in to view your files</div>
        )}
      </main>
    </div>
  );
}

export default App;
