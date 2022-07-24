import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IgetMoviesResult, IgetTvsResult, searchMovie, searchTv } from "../api";
import ContentSlider from "../Components/ContentSlider";
import TvContentSlider from "../Components/TvContentSlider";

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

const Title = styled.div`
  margin-top: 100px;
  margin-left: 100px;
  font-size: 32px;
  & > span:last-child {
    font-weight: 700;
    margin-left: 15px;
  }
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: searchMovies, isLoading: searchMoviesIsLoading } =
    useQuery<IgetMoviesResult>(["movies", "search", keyword], () =>
      searchMovie(keyword ? keyword : "")
    );
  const { data: searchTvs, isLoading: searchTvsIsLoading } =
    useQuery<IgetTvsResult>(["tvs", "search", keyword], () =>
      searchTv(keyword ? keyword : "")
    );
  console.log(searchTvs);
  return (
    <Wrapper>
      {searchMoviesIsLoading || searchTvsIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Title>
            <span>Result of</span>
            <span>{keyword}</span>
          </Title>
          <div style={{ height: 150 }} />
          <ContentSlider
            data={searchMovies}
            title={"Movie Results"}
            from={"search"}
          />
          <TvContentSlider
            data={searchTvs}
            title={"Tv Results"}
            from={"search"}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Search;
