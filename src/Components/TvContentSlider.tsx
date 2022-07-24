import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { IgetTvsResult } from "../api";
import { makeImagePath } from "../utils";
import leftBtn from "../Images/angle-left-solid.svg";
import rightBtn from "../Images/angle-right-solid.svg";

const Slider = styled.div`
  position: relative;
  top: -100px;
  width: 100vw;
  height: 300px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 50px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 170px;
  color: tomato;
  font-size: 64px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const SliderTitle = styled.div`
  height: 50px;
  font-size: 32px;
  font-weight: 700;
  margin-left: 50px;
`;
const Btn = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  position: absolute;
  top: 120px;
  z-index: 10;
  background-color: transparent;
  filter: invert(99%) sepia(0%) saturate(2022%) hue-rotate(289deg)
    brightness(109%) contrast(100%);
`;
const LeftBtn = styled(Btn)`
  left: 20px;
  background-image: url(${leftBtn});
`;
const RightBtn = styled(Btn)`
  right: 20px;
  background-image: url(${rightBtn});
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70px;
  bottom: -70px;
  color: ${(props) => props.theme.white.lighter};
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants: Variants = {
  hidden: (isNext: boolean) => ({
    x: isNext ? window.outerWidth + 5 : -(window.outerWidth + 5),
  }),
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => ({
    x: isNext ? -(window.outerWidth + 5) : window.outerWidth + 5,
  }),
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

interface IContentSlider {
  data: IgetTvsResult | undefined;
  title: string;
}
function ContentSlider({ data, title }: IContentSlider) {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isNext, setIsNext] = useState(true);
  const increaseIndex = () => {
    setIsNext(true);
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setIsNext(false);
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  return (
    <Slider>
      <SliderTitle>
        <h1>{title}</h1>
      </SliderTitle>
      <LeftBtn onClick={decreaseIndex} />
      <RightBtn onClick={increaseIndex} />
      <AnimatePresence
        custom={isNext}
        initial={false}
        onExitComplete={() => setLeaving(false)}
      >
        <Row
          custom={isNext}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * (index + 1))
            .map((tv) => (
              <Box
                layoutId={tv.id + ""}
                key={tv.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(tv.id)}
                bgphoto={makeImagePath(tv.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{tv.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default ContentSlider;
