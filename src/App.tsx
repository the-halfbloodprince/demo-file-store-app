import { User } from '@supabase/supabase-js';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import styles from './App.module.css';
import Button from './components/Button';
import Collapsible from './components/Collapsible';
import YourFiles from './components/YourFiles';
import { services } from './config/services';
import { userContext } from './contexts/UserContext';
import FileDetails from './types/schema/FileDetails';
import { fetchFiles, uploadFile } from './utils/fileUtils';

function App() {
  const [user, setUser] = useState<User | undefined | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [files, setFiles] = useState<FileDetails[] | null>([]);

  // login
  const login = async () => {
    console.log('login started');
    const { error } = await services.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      return <div>Error Signing In</div>;
    }
    console.log('login done');
  };

  // logout
  const logout = async () => {
    const { error } = await services.supabase.auth.signOut({ scope: 'local' });
    if (error) {
      return <div>Error signing out</div>;
    }
  };

  // initial authentication
  useEffect(() => {
    services.supabase.auth.getSession().then((res) => setUser(res.data.session?.user));

    const { data: authListener } = services.supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case 'SIGNED_IN':
            services.supabase.auth.getUser().then((res) => setUser(res.data.user));
            break;
          case 'SIGNED_OUT':
            setUser(null);
            break;
          default:
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // fetch files
  useEffect(() => {
    (async () => {
      const files = await fetchFiles();
      console.log(files);
      setFiles(files);
    })();
  }, []);

  // file uploading
  const fileRef = useRef<File | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    fileRef.current = file;
  };

  const upload = async () => {
    if (!fileRef.current) {
      console.error('No file selected');
      return;
    }

    if (!user) {
      console.error('Not signed in');
      return;
    }

    await uploadFile(fileRef.current, user, {
      uploadedToBucketCallback: () => setUploadMsg('File Uploaded (1/2)'),
      savedToDBCallback: () => setUploadMsg('File Saved to DB (2/2)'),
    });

    const newFiles = await fetchFiles();
    setFiles(newFiles);

    setTimeout(() => setUploadMsg(null), 2000);
  };

  return (
    <userContext.Provider value={user}>
      <div className={styles.app}>
        <nav className={styles.nav}>
          <h1>Upload App</h1>
          {user ? (
            <Button onClick={logout}>Sign out</Button>
          ) : (
            <Button onClick={login}>Sign In</Button>
          )}
        </nav>

        {/* <Collapsible summary="Env Variables" content={JSON.stringify(import.meta.env)} /> */}
        {/* <Collapsible summary="Config" content={JSON.stringify(import.meta.env)} /> */}

        <main>
          {user ? (
            <div>
              <section className={styles.sec2}>
                <h3 className={styles.authMsg} data-loggedIn={true}>
                  logged in as {user.user_metadata.full_name} ({user.email})
                </h3>
                <Collapsible summary="User Details" content={JSON.stringify(user)} />

                <div>
                  <input type="file" name="file" onChange={handleFileSelect} />
                  <Button onClick={upload} disabled={uploadMsg}>
                    {uploadMsg ? uploadMsg : 'Upload File'}
                  </Button>
                </div>
              </section>
              <section>
                <YourFiles files={files || []} />
              </section>
            </div>
          ) : (
            <div>
              <h3 className={styles.authMsg} data-loggedIn={false}>
                Not logged in. Please log in to view your files
              </h3>
            </div>
          )}
        </main>
      </div>
    </userContext.Provider>
  );
}

export default App;
