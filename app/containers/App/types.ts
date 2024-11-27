export const fetchFileUrl = 'app/fetchFileUrl';
export const triggerHeardBeat = 'app/triggerHeardBeat';
export const stopHeartBeat = 'app/stopHeartBeat';

export interface FetchFileUrl {
  id: string | number;
}

export interface FetchFileUrlResponseData {
  resource_url: string;
  id: number;
}

export interface FetchFileUrlResponse {
  file_download_file: FetchFileUrlResponseData;
}

export interface FileUpload {
  Policy: string;
  'X-Amz-Algorithm': string;
  'X-Amz-Credential': string;
  'X-Amz-Date': string;
  'X-Amz-Signature': string;
  bucket: string;
  key: string;
  url: string;
}

export const postFileUpload = 'app/postFileUpload';

export interface FileUploadApiResponse {
  data?: {
    file_upload_file?: {
      id: number;
      data?: FileUpload;
      expires_in?: number;
      key?: string;
    };
  };
}

export interface HeartBeat {
  drive_occurrence_id?: number;
  test_instance_id?: number;
}
