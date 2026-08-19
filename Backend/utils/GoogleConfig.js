import {google} from 'googleapis'

const client_id=process.env.google_client_id;
const google_client_secret_id=process.env.google_client_secret_id;

 export const OAuth2Client=new google.auth.OAuth2(
    client_id,
    google_client_secret_id,
    'postmessage'
)