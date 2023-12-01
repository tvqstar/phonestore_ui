import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layouts from './Layouts';
import { publicRoutes, privateRoutes } from './routes';


import { useContext } from 'react';
import { DataContext } from './Provider';

function App() {
    // const history = useHistory();
    const value = useContext(DataContext);
    const [user] = value.user;

    let RouterUI = publicRoutes;
    if (user.isAdmin == true) {
        RouterUI = privateRoutes;
    }
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Home page */}
                    {RouterUI.map((route, index) => {
                        let Layout = Layouts;

                        // const PrivateRoute = ({ children }) => {
                        //     const token = localStorage.getItem('login');
                        //     return <>{token === null ? <Navigate to="/login" /> : children}</>;
                        // };
                        // if (user.isAdmin == true) {
                        //     window.location.replace('/admin');
                        // }

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
