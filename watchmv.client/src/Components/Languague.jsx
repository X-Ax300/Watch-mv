import React, { useEffect, useState } from 'react';

function Languague() {
    const [languagueList, setLanguagueList] = useState([]);

    const getlanguague = () => {
        fetch("https://api.themoviedb.org/3/configuration/languages?api_key=f04dcdf0234a51eeaa40083ac3596bff")
            .then(res => res.json())
            .then(json => setLanguagueList(json));
    };

    useEffect(() => {
        getlanguague();
    }, []);

    console.log(languagueList);

    return (
        <>
            {languagueList.map((lang) => (
                <option key={lang.iso_639_1} value={lang.iso_639_1}>
                    {lang.english_name}
                </option>
            ))}
        </>
    );
}

export default Languague;
