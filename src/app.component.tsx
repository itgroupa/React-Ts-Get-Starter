import { Loading } from './components/loading.component';
import { Root } from './components/root.component';
import { GlobalProvider } from './providers';

import React, { FC, useState } from 'react';

export const App: FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <GlobalProvider.Provider value={
            setLoading
        }
    >
      {!loading
        ? <Root />
        : <Loading />}
    </GlobalProvider.Provider>
  );
};
