import Header from '../Header/Header';
import Footer from '../Footer/Footer';
function Layout({ setPage, page, children, setDisplayForm, displayForm}) {
    return (
        <>
            <Header setPage={setPage} page={page} setDisplayForm={setDisplayForm} displayForm={displayForm}/>
            {children}
            <Footer />
        </>
    );
}

export default Layout;