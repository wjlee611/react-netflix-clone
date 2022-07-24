import {
  AnimatePresence,
  motion,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getTvDetail,
  getTvsLatest,
  getTvsPopular,
  getTvsToday,
  getTvsTop,
  IGetTvDetail,
  IgetTvsResult,
  ITv,
} from "../api";
import TvContentSlider from "../Components/TvContentSlider";
import TvDetail from "../Components/TvDetail";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  overflow: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 72px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 2;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 3;
`;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const calcScrollY = useTransform(scrollY, (value) => value + 100);
  const { data: latestData, isLoading: latestIsLoading } = useQuery<ITv>(
    ["tvs", "latest"],
    getTvsLatest
  );
  const { data: todayData, isLoading: todayIsLoading } =
    useQuery<IgetTvsResult>(["tvs", "today"], getTvsToday);
  const { data: popularData, isLoading: popularIsLoading } =
    useQuery<IgetTvsResult>(["tvs", "popular"], getTvsPopular);
  const { data: topData, isLoading: topIsLoading } = useQuery<IgetTvsResult>(
    ["tvs", "top"],
    getTvsTop
  );
  const { data: latestDetail, isLoading: latestDetailIsLoading } =
    useQuery<IGetTvDetail>(["tvs", "detail", latestData?.id], () =>
      getTvDetail(latestData?.id ? latestData.id : 0)
    );
  const onOverlayClick = () => {
    history.goBack();
  };
  const clickedTv =
    bigTvMatch?.params.tvId &&
    (todayData?.results.find(
      (tv) => String(tv.id) === bigTvMatch.params.tvId
    ) ||
      popularData?.results.find(
        (tv) => String(tv.id) === bigTvMatch.params.tvId
      ) ||
      topData?.results.find((tv) => String(tv.id) === bigTvMatch.params.tvId));
  useEffect(() => {
    if (clickedTv) document.body.style.overflowY = "hidden";
    else document.body.style.overflowY = "scroll";
  }, [clickedTv]);
  return (
    <Wrapper>
      {latestIsLoading ||
      todayIsLoading ||
      popularIsLoading ||
      topIsLoading ||
      latestDetailIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(latestDetail?.backdrop_path || "")}>
            <h1 style={{ color: "red", fontWeight: 700 }}>Latest!</h1>
            <Title>{latestDetail?.name}</Title>
            <Overview>{latestDetail?.overview}</Overview>
          </Banner>
          <TvContentSlider data={todayData} title={"Airing Today"} />
          <TvContentSlider data={popularData} title={"Popular Tv Show"} />
          <TvContentSlider data={topData} title={"Top Rated Tv Show"} />
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigTvMatch.params.tvId}
                  style={{
                    top: calcScrollY,
                  }}
                >
                  {clickedTv && (
                    <TvDetail
                      clickedTv={clickedTv}
                      id={Number(bigTvMatch.params.tvId)}
                    />
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
