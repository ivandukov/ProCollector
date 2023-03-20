import {Route, Routes} from "react-router-dom";
import {LandingPage} from "./pages/LandingPage";
import {Dashboard} from "./pages/Dashboard";
import {GuidesHome} from "./pages/Guides/GuidesHome";
import {GuidesDetails} from "./pages/Guides/GuidesDetails";
import * as React from "react";
import {PlayerDetails} from "./pages/PlayerDetails";
import {Settings} from "./pages/Settings";
import {GuidesNew} from "./pages/Guides/GuidesNew";
import {GuidesSearchResult} from "./pages/Guides/GuidesSearchResult";

/**
 * The routes for the application when the user is logged in.
 */
export const LoggedInRoutes = (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/guides" element={<GuidesHome/>}/>
        <Route path="/guides/:id" element={<GuidesDetails/>}/>
        <Route path="/guides/new" element={<GuidesNew/>}/>
        <Route path="/search" element={<PlayerDetails/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/public/guides/search" element={<GuidesSearchResult/>}/>
        <Route path="/public/guides" element={<GuidesHome isPublic={true}/>}/>
        <Route path="/public/guides/:id" element={<GuidesDetails isPublic={
            true}/>}/>
        {/* <Route path="*" element={<NotFound />} />*/}
    </Routes>
);

/**
 * The routes for the application when the user is not logged in.
 */
export const LoggedOutRoutes = (
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/public/guides" element={<GuidesHome isPublic={true}/>}/>
        <Route path="/public/guides/search" element={<GuidesSearchResult/>}/>
        <Route path="/public/guides/:id" element={<GuidesDetails isPublic={
            true}/>}/>
        <Route path="/search" element={<PlayerDetails/>}/>
        {/* <Route path="*" element={<NotFound />} />*/}
    </Routes>

);