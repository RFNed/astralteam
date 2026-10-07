import "./profile.scss";

import { Helmet } from "react-helmet-async";

export default function Profile() {
    return (
        <>
            <Helmet>
                <title>Профиль</title>
            </Helmet>

            <div className="profile-box">
                <div className="profile-box__head">
                    <div className="profile-box__avatar"></div>
                </div>
            </div>
        </>
    );
}