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
  getMoviesLatest,
  getMoviesTop,
  getMoviesUpcoming,
  IgetMoviesResult,
} from "../api";
import ContentSlider from "../Components/ContentSlider";
import Detail from "../Components/Detail";
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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movie/:movieId");
  const { scrollY } = useViewportScroll();
  const calcScrollY = useTransform(scrollY, (value) => value + 100);
  const { data: latestData, isLoading: latestIsLoading } =
    useQuery<IgetMoviesResult>(["movies", "latest"], getMoviesLatest);
  const { data: topData, isLoading: topIsLoading } = useQuery<IgetMoviesResult>(
    ["movies", "top"],
    getMoviesTop
  );
  const { data: upcomingData, isLoading: upcomingIsLoading } =
    useQuery<IgetMoviesResult>(["movies", "upcoming"], getMoviesUpcoming);
  const onOverlayClick = () => {
    history.goBack();
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (latestData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    ) ||
      topData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.movieId
      ) ||
      upcomingData?.results.find(
        (movie) => String(movie.id) === bigMovieMatch.params.movieId
      ));
  useEffect(() => {
    if (clickedMovie) document.body.style.overflowY = "hidden";
    else document.body.style.overflowY = "scroll";
  }, [clickedMovie]);
  return (
    <Wrapper>
      {latestIsLoading || topIsLoading || upcomingIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(latestData?.results[0].backdrop_path || "")}
          >
            <Title>{latestData?.results[0].title}</Title>
            <Overview>{latestData?.results[0].overview}</Overview>
          </Banner>
          <ContentSlider data={latestData} title={"Latest Movies"} />
          <ContentSlider data={topData} title={"Top Rated Movies"} />
          <ContentSlider data={upcomingData} title={"Upcoming Movies"} />
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{
                    top: calcScrollY,
                  }}
                >
                  {clickedMovie && (
                    <Detail
                      clickedMovie={clickedMovie}
                      id={Number(bigMovieMatch.params.movieId)}
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

export default Home;
