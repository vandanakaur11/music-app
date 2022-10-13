import HistoryPage from "../../src/pagesContainer/historyPage/HistoryPage";

const index = ({ history, email }) => {
  return <HistoryPage history={history} userEmail={email} />;
};

export default index;

export async function getStaticProps(context) {
  const { userEmail } = context.params;
  // const { data } = await axios.get(`${process.env.base_url}/history/${userEmail.replace(/-/g, " ")}`);

  return {
    props: {
      history: "",
      email: userEmail,
      revalidate: 1800,
    },
  };
}

export async function getStaticPaths() {
  // if you provide all possible ids so "next" will pre-generate all pages in advance of these ids so the use { fallback:false } otherwise use { fallback:true }.
  return {
    paths: [],
    fallback: true,

    // paths: [{ params: { albumId: "p1" } }, { params: { albumId: "p2" } }],
    // fallback: true,

    // by this replacement of this file will execute after the page fully loaded on server-side.
    // fallback: "blocking",
  };
}
