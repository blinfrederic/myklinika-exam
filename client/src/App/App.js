import React, { useState, useEffect } from 'react';
import Layout from "./components/Layout/Layout/Layout";
import MapPage from "./components/HomePage/MapPage/MapPage";
import { AuthProvider } from "./components/Layout/AuthProvider";
import { LogPage } from "./components/LogPage/LogPage";
import ProfilUser from "./components/ProfilUser/ProfilUser";
import { MessageProvider } from "./components/Layout/MessageContext";
import { MapProvider } from './MapContext';

function App() {
  const [page, setPage] = useState("MapPage");
  const [displayForm, setDisplayForm] = useState("login");
  const [changePassword, setChangePassword] = useState("changePassword");
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const token = window.location.pathname.split('/resetpassword/')[1];
    if (token) {
      setHasToken(true);
      setPage("connexion")
      setDisplayForm("forgetPassword")
    }
  }, [])

  return (
    <AuthProvider setPage={setPage} >
      <MessageProvider>
        <MapProvider>
          <Layout setPage={setPage} page={page} setDisplayForm={setDisplayForm} displayForm={displayForm}>
            {page === 'connexion' && <LogPage displayForm={displayForm} setDisplayForm={setDisplayForm} setPage={setPage} hasToken={hasToken} setHasToken={setHasToken} />}
            {page === 'MapPage' && <MapPage />}
            {page === 'ProfilUser' && <ProfilUser changePassword={changePassword} setChangePassword={setChangePassword} setPage={setPage} />}
          </Layout>
        </MapProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;





