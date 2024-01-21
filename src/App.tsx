import { createClient, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import styles from './App.module.css';

function App() {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
  );

  const [user, setUser] = useState<User | undefined | null>(null);

  const checkAndUpdateUser = () =>
    supabase.auth.getSession().then((session) => setUser(session.data.session?.user));

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      return <div>Error Signing In</div>;
    }
    checkAndUpdateUser();
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      return <div>Error signing out</div>;
    }
    checkAndUpdateUser();
  };

  useEffect(() => {
    checkAndUpdateUser();
  }, []);

  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <h1>Upload App</h1>
        {user ? (
          <button onClick={logout}>Sign out</button>
        ) : (
          <button onClick={login}>Sign In</button>
        )}
      </nav>

      <details className={styles.collapsible}>
        <summary>Env Variables</summary>
        <code>{JSON.stringify(import.meta.env)}</code>
      </details>

      <main>
        {user ? (
          <div>
            <h3>{user.email} logged in</h3>
            <details className={styles.collapsible}>
              <summary>User details</summary>
              <code>{JSON.stringify(user)}</code>
            </details>

            <h3>Files</h3>
          </div>
        ) : (
          <div>Please log in to view your files</div>
        )}
      </main>
    </div>
  );
}

export default App;
