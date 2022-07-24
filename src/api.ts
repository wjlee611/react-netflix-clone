const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

//Movie
export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IgetMoviesResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMoviesLatest() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function getMoviesTop() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getMoviesUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export interface IMovieDetail {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  genres: { name: string }[];
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
}

export async function getMoviesDetail(id: number) {
  const response = await fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`);
  const json = await response.json();
  return json;
  // return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((res) =>
  //   res.json()
  // );
}

//Tv
export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IgetTvsResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getTvsLatest() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTvsToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTvsPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTvsTop() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export interface ITvDetail {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  created_by: { name: string }[];
  genres: { name: string }[];
  homepage: string;
  number_of_episodes: number;
  number_of_seasons: number;
}

export function getTvDetail(id: number) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
