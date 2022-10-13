import HomePage from "../src/pagesContainer/homePage/HomePage";
import api from "./../services/api";

// console.log("process.env.base_url >>>>>>>>>>", process.env.base_url);

export async function getStaticProps() {
  const { data } = await api.get("/albums");

  return {
    props: {
      albums: data,
      revalidate: 1800,
    },
  };
}

const index = ({ albums }) => <HomePage albums={albums} />;

export default index;
