import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvDetail, ITv, IGetTvDetail } from "../api";
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
  & > h3:first-child,
  & > h3:nth-child(3) {
    font-size: 24px;
    font-weight: 700;
    border-bottom: 1px solid white;
    margin-bottom: 5px;
  }
  & > h3:nth-child(3) {
    margin-top: 15px;
  }
`;

const ListItems = styled.ul`
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

interface ITvDetail {
  clickedTv: ITv;
  id: number;
}
function TvDetail({ clickedTv, id }: ITvDetail) {
  const { data, isLoading } = useQuery<IGetTvDetail>(
    ["tvs", "detail", id],
    () => getTvDetail(id)
  );
  console.log(data);
  return (
    <>
      <BigCover
        style={{
          backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(
            clickedTv?.backdrop_path,
            "w500"
          )})`,
        }}
      />
      <BigTitle>{clickedTv.name}</BigTitle>
      <BigContents>
        <BigOverview>{clickedTv.overview}</BigOverview>
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <DetailContents>
            <h3>Genres</h3>
            <ListItems>
              {data?.genres.length ? (
                data?.genres.map((genre) => <li>{genre.name}</li>)
              ) : (
                <li>No data</li>
              )}
            </ListItems>
            <h3>Created by</h3>
            <ListItems>
              {data?.created_by.length ? (
                data?.created_by.map((creator) => <li>{creator.name}</li>)
              ) : (
                <li>No data</li>
              )}
            </ListItems>
            <DetailText>
              <span>Homepage</span>
              <span>
                <a href={data?.homepage} target="_blank" rel="noreferrer">
                  {data?.homepage}
                </a>
              </span>
            </DetailText>
            <DetailText>
              <span>Episodes</span>
              <span>{data?.number_of_episodes}</span>
            </DetailText>
            <DetailText>
              <span>Seasons</span>
              <span>{data?.number_of_seasons}</span>
            </DetailText>
          </DetailContents>
        )}
      </BigContents>
    </>
  );
}

export default TvDetail;
