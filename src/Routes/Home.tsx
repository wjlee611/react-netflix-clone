import {
  AnimatePresence,
  motion,
  useTransform,
  useViewportScroll,
} from "framer-motion";
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
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
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
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -60px;
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
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
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
