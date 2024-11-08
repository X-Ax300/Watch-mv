import { createBrowserRouter } from 'react-router-dom';
import Login from '../Login.jsx';
import HomePage from '../HomePage.jsx';
import PrivateRoute from '../PrivateRoute.jsx';
import Perfil from '../Perfil.jsx';
import GentePopulares from '../assets/PageGenteP/GentePopulares.jsx';
import PeliculasPopulares from '../assets/PagePeliculasP/Populares.jsx';
import P_Proximamente from '../assets/PagePeliculasP/Proximamente.jsx';
import Encartelera from '../assets/PagePeliculasP/Encartelera.jsx';
import S_Populares from '../assets/PageSeriesP/PopularesSres.jsx';
import MovieDetail from '../MovieDetail.jsx';
import SeriesDetail from '../SeriesDetail.jsx';
import ProximamenteDetails from '../assets/PagePeliculasP/ProximamenteDetails.jsx';
import EnCarteleraDetails from '../assets/PagePeliculasP/EnCarteleraDetails.jsx';
import SeriesPopularesDetails from '../assets/PageSeriesP/SeriesPopularesDetails.jsx';
import GentePopularesDetails from '../assets/PageGenteP/GentePopularesDetails.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/HomePage',
        element: (
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/Perfil',
        element: (
            <PrivateRoute>
                <Perfil />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/GentePopulares',
        element: (
            <PrivateRoute>
                <GentePopulares />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/GentePopulares/:id',
        element: (
            <PrivateRoute>
                <GentePopularesDetails />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/Populares',
        element: (
            <PrivateRoute>
                <PeliculasPopulares />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/Proximamente',
        element: (
            <PrivateRoute>
                <P_Proximamente />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/Proximamente/:id',
        element: (
            <PrivateRoute>
                <ProximamenteDetails />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/EnCartelera',
        element: (
            <PrivateRoute>
                <Encartelera />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/EnCartelera/:id',
        element: (
            <PrivateRoute>
                <EnCarteleraDetails />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/SeriesPopulares',
        element: (
            <PrivateRoute>
                <S_Populares />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/SeriesPopulares/:id',
        element: (
            <PrivateRoute>
                <SeriesPopularesDetails />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/movie/:id',
        element: (
            <PrivateRoute>
                <MovieDetail />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    },
    {
        path: '/series/:id',
        element: (
            <PrivateRoute>
                <SeriesDetail />
            </PrivateRoute>
        ),
        errorElement: <div>Error: Pagina no encontrada</div>
    }
]);
