import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export const UserContext = React.createContext(null);
export const JobContext = React.createContext(null);

export default function MyApp({ Component, pageProps }) {
    const [user, setUser] = React.useState(null);
    const [job, setJob] = React.useState(null);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            <JobContext.Provider value={{ job: job, setJob: setJob }}>
                <Component {...pageProps} />
            </JobContext.Provider>
        </UserContext.Provider >
    )
}