import { gql } from '@apollo/client';

export const OTP_REQUEST = gql(
  `mutation requestOtp($username: String!) {
    auth_request_verification_code(username: $username) {
     message
    }
   }`
);

export const VERIFY_OTP = gql(
  `mutation verifyOtp ($payload: canx_verify_otp_input!) {
    canx_verify_otp(
      data: $payload
    ) {
      error_message
      success
       data {
        id_token
      }
    }
  }`
);

export const SIGNUP = gql(`
  mutation candidateSignup($payload: [canx_signup_input]!) {
    canx_signup(data: $payload) {
      success
      error_message
      data {
        access_token
        candidate {
          country
          email
          external_id
          first_name
          is_tnc_accepted
          last_name
          middle_name
          phone_number
          user_id
        }
        tenant_id
      }
    }
  }
`);

export const GET_CUSTOM_TOKEN = gql(`
  mutation getCustomToken($hash_token: String!) {
    auth_get_custom_token(hash_token: $hash_token) {
      custom_token
      tenant_identity_id
    }
  }
`);

export const GET_ACCESS_TOKEN = gql(`
  mutation getAccessToken($payload: auth_get_access_token_input!) {
    auth_get_access_token(data: $payload) {
      data {
        access_token
        custom_token
        refresh_token
        expires_in
      }
      success
      error_message
    }
  }
`);

export const GET_CURRENT_USER = gql(`
  query getCurrentUser {
    auth_user_me {
      email
      id
      name
      phone_number
      username
      external_id
      old_id
      profile_pic_file_id
      tenant_id
      tenant {
        name
        id
      }
    }
  }
`);

export const FIND_EXISTING_USER = gql`
  query findCandidate($email: citext!) {
    can_candidate(where: { email: { _eq: $email } }, order_by: { id: desc }, limit: 1) {
      email
      country
      first_name
      id
      last_name
      middle_name
      is_active
    }
  }
`;
