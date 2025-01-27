import React, { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { t } from "i18next";
import { withTranslation } from "react-i18next";
import errorimg from "src/assets/images/error.svg"
import { truncate } from "src/utils";
const Live = ({ data, playBtn }) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [loading]);

    return (
        <Fragment>
            <div className="row">
                {loading ? (
                    <div className="text-center">
                        <Skeleton count={5} />
                    </div>
                ) : (
                    <>
                        {data ? (
                            data?.map((livedata, index) => {
                                return (
                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={index}>
                                        <div className="card">
                                            <div className="card-image">
                                                <img src={livedata.image} alt="wrteam" />
                                            </div>
                                            <div className="card-details">
                                                <div className="card-title">
                                                    <div className="titleDataDiv">
                                                        <h3>{truncate(livedata.name, 23)}</h3>
                                                        {/* <span className="dropIcon"><FaChevronDown /></span> */}
                                                    </div>
                                                    <p>{truncate(livedata.description, 27)}</p>
                                                </div>

                                                <div className="card-footer">
                                                    <div className="upper-footer">
                                                        <div className="card-entry-fees text-center">
                                                            <p>{t("entry_fees")}</p>
                                                            <span>{livedata.entry} {t("coins")}</span>
                                                        </div>

                                                        <div className="card-players text-center">
                                                            <p>{t("Players")}</p>
                                                            <span>{livedata.participants}</span>
                                                        </div>
                                                        <div className="card-ends-on text-center">
                                                            <p>{t("ends_on")}</p>
                                                            <span>{livedata.end_date}</span>
                                                        </div>

                                                    </div>

                                                    <div className="bottom-footer" onClick={() => playBtn(livedata.id, livedata.entry)}>
                                                        <div className="card-btn-play">
                                                            <p className="btn btn-play" >
                                                                {t("play")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center mt-4 commonerror">
                                <img src={errorimg.src} title="wrteam" className="error_img" />
                                <p>{t("no_live_contest")}</p>
                            </div>

                        )}
                    </>
                )}
            </div>
        </Fragment>
    );
};

export default withTranslation()(Live);
