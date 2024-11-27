import { gql } from '@apollo/client';

export const FETCH_FILE_URL = gql(`
  query file_download_file($id: Int!) {
    file_download_file(id: $id) {
      resource_url
      id
    }
  }
`);

export const UPLOAD_FILE = gql`
  mutation uploadFile($file_type_id: Int!, $original_name: String!, $owner_id: Int!, $extension: String!) {
    file_upload_file(
      file_type_id: $file_type_id
      original_name: $original_name
      owner_id: $owner_id
      extension: $extension
    ) {
      id
      data
      expires_in
      key
    }
  }
`;

export const HEART_BEAT = gql(`
  query heartBeat($test_instance_id: Int!, $seconds_elapsed: Int) {
    canx_heart_beat(test_instance_id: $test_instance_id, seconds_elapsed: $seconds_elapsed) {
      test_instance_id
    }
  }
`);
