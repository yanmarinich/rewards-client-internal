import React from 'react'

import {
  // BrowserRouter as Router,
  RouterProvider,
  Route,
  useParams
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';

// import { } from "react-router-dom";
import router from "@app/router/";

import MProvider from "@app/providers";
import store from '@app/store';

import { CustomLoader } from "@app/components/common/app/CustomLoader";

// import { getPageComponent } from "@app/router";

import 'react-toastify/dist/ReactToastify.min.css';
import "@app/App.css";
import "@app/styles/App.scss";
import '@app/styles/swal-override.scss';

function App() {
  // const PageComponent = getPageComponent();
  const loader = store.system((state) => (state.get().loader));

  return (
    <div style={{ height: '100%' }}>
      <ToastContainer />
      <MProvider>
        {loader && (<CustomLoader loader={loader} />)}

        <RouterProvider
          router={router}
          fallbackElement={<div> Loading ... </div>}
        />
        {/* <PageComponent /> */}
      </MProvider>
    </div>
  )
}

export default App;
