import { App } from './app.component';

import React from 'react';
import renderer from "react-test-renderer";

describe('<App />', () => {
  test('App should create', async () => {
    const el = renderer.create(<App/>)
        .toJSON();
    console.log(el);
    expect(el).toMatchSnapshot();
  });
});
