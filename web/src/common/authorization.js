import * as axios from 'axios';

export const CLIENT_ID = '12to6uxur1fhzkl5rheff3cfb6qmvmljg059e61a';

export function setAuthToken(access_token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
}
export async function getLoggedInUser() {
  const accessToken = sessionStorage.getItem('access_token');
  if (!accessToken) return null;

  var data = new FormData();
  data.append('client_id', CLIENT_ID);
  data.append('access_token', accessToken);

  let user = await axios
    .post('/api/v1/oauth/login', data)
    .then(response => {
      setAuthToken(accessToken);
      return response.data;
    })
    .catch(error => {
      console.log(error);
      setAuthToken(null);
      return null;
    });

  return user;
}
