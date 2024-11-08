/// <reference path="login.jsx" />
useEffect(() => {
    $('.emailInput, .passwordInput').focus(function () {
        setFocus(false);
    });

    $('.emailInput, .passwordInput').blur(function () {
        setFocus(false);
    });
}, []);

