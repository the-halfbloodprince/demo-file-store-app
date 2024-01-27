import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createClient, User } from '@supabase/supabase-js';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './App.module.css';
import Button from './components/Button';
import Collapsible from './components/Collapsible';
import FileRow from './components/File';
import config from './config';
import FileDetails from './types/schema/FileDetails';

function App() {
  const supabase = useMemo(
    () => createClient(config.supabase.publicURL, config.supabase.publicKey),
    [],
  );

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: config.aws.accessKeyID,
      secretAccessKey: config.aws.secretAccessKey,
      sessionToken: config.aws.sessionToken,
    },
    region: config.aws.region,
  });

  const [user, setUser] = useState<User | undefined | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [files, setFiles] = useState<FileDetails[] | null>([]);

  // fetchFiles
  const fetchFiles = useCallback(async () => {
    const { data, error } = await supabase.from('files').select();
    if (error) {
      console.error('Error fetching file names');
      console.error(error);
    }
    return data;
  }, [user]);

  // login
  const login = async () => {
    console.log('login started');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      return <div>Error Signing In</div>;
    }
    console.log('login done');
  };

  // logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      return <div>Error signing out</div>;
    }
  };

  // initial authentication
  useEffect(() => {
    supabase.auth.getSession().then((res) => setUser(res.data.session?.user));

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          supabase.auth.getUser().then((res) => setUser(res.data.user));
          break;
        case 'SIGNED_OUT':
          setUser(null);
          break;
        default:
      }
    });

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

  const uploadFile = async () => {
    console.log('Upload');
    if (!fileRef.current || !user) return;
    const file = fileRef.current;
    const params = {
      Bucket: import.meta.env.VITE_AWS_BUCKET,
      Key: `${user.id}.+.${file.name}`,
      Body: file,
    };

    try {
      const putObjectCommand = new PutObjectCommand(params);
      const res = await s3Client.send(putObjectCommand);
      console.log(res);
      console.log(`${file.name} uploaded to bucket`);
      setUploadMsg('file uploaded (1/2)');
      try {
        await supabase.from('files').insert({
          file_name: params.Key,
        });
        const files = await fetchFiles();
        setFiles(files);
        setUploadMsg('file saved');
        // console.log()
      } catch (err) {
        console.error('Error saving entry to supabase (2/2)');
        console.error(err);
      }
    } catch (err) {
      console.error('Error uploading file');
      console.error(err);
    }

    setTimeout(() => setUploadMsg(null), 2000);
  };

  return (
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
            <h3>{user.email} logged in</h3>
            <Collapsible summary="User Details" content={JSON.stringify(user)} />

            <div>
              {uploadMsg && uploadMsg}
              <input type="file" name="file" onChange={handleFileSelect} />
              <Button onClick={uploadFile}>Upload File</Button>
            </div>

            <div className={styles.filesHeader}>
              <h3>Your Files</h3>
            </div>
            <div className={styles.filesList}>
              {files?.map((file, idx) => (
                <FileRow fileDetails={file} key={idx} />
              ))}
            </div>
          </div>
        ) : (
          <div>Please log in to view your files</div>
        )}
      </main>
    </div>
  );
}

export default App;
