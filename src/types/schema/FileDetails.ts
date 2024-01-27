type FileDetails = {
  id: string;
  file_name: string;
  created_at: string;
  bucket: string | null;
  region: string | null;
  user_id: string;
};

export default FileDetails;
