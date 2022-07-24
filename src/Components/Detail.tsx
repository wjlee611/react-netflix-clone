import { useQuery } from "react-query";
import styled from "styled-components";
import { getMoviesDetail, IMovie, IMovieDetail } from "../api";
import { makeImagePath } from "../utils";

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h2`
  height: 100px;
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -100px;
  display: flex;
  align-items: flex-end;
`;

const BigContents = styled.div`
  width: 100%;
  height: calc(100% - 400px);
  position: absolute;
  top: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const DetailContents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  & > h3:first-child {
    font-size: 24px;
    font-weight: 700;
    border-bottom: 1px solid white;
    margin-bottom: 5px;
  }
`;

const Genres = styled.ul`
  display: flex;
  li {
    margin-right: 15px;
  }
`;

const DetailText = styled.div`
  margin-top: 10px;
  & > span:first-child {
    font-size: 18px;
    font-weight: 700;
    margin-right: 10px;
  }
  &:last-child {
    margin-bottom: 20px;
  }
`;

interface IDetail {
  clickedMovie: IMovie;
  id: number;
}
function Detail({ clickedMovie, id }: IDetail) {
  const { data, isLoading } = useQuery<IMovieDetail>(
    ["movies", "detail", id],
    () => getMoviesDetail(id)
  );
  console.log(data);
  return (
    <>
      <BigCover
        style={{
          backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(
            clickedMovie?.backdrop_path,
            "w500"
          )})`,
        }}
      />
      <BigTitle>{clickedMovie.title}</BigTitle>
      <BigContents>
        <BigOverview>{clickedMovie.overview}</BigOverview>
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <DetailContents>
            <h3>Genres</h3>
            <Genres>
              {data?.genres.map((genre) => (
                <li>{genre.name}</li>
              ))}
            </Genres>
            <DetailText>
              <span>Release Date</span>
              <span>{data?.release_date}</span>
            </DetailText>
            <DetailText>
              <span>RunTime</span>
              <span>{data?.runtime} mins</span>
            </DetailText>
            <DetailText>
              <span>Score</span>
              <span>
                {data?.vote_average} / 10 ({data?.vote_count} votes)
              </span>
            </DetailText>
          </DetailContents>
        )}
      </BigContents>
    </>
  );
}

export default Detail;
