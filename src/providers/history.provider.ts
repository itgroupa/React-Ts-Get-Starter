import { BASE_PATH } from '../env/environment';

import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
  basename: BASE_PATH,
});
