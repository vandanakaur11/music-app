import AlbumPage from "../../src/pagesContainer/albumPage/AlbumPage";
import api from "../../services/api";

const index = ({ songs, album }) => {
  // console.log("songs>>>>>>>>>>>", songs);
  // console.log("album>>>>>>>>>>>", album);

  // console.log("ndnsnsn>>>>>", process.env.base_url);

  return <AlbumPage songs={songs} album={album} />;
};

export default index;

export const getStaticPaths = async () => {
  const { data } = await api.get(`/albums`);

  const paths = data.map((curObj) => {
    return {
      params: {
        albumName: curObj.Album_Name.toString(),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };

  /* const pathWithParams = albumIds.map((obj) => ({
    params: { albumId: obj.Album_Name },
  }));
  // if you provide all possible ids so "next" will pre-generate all pages in advance of these ids so the use { fallback:false } otherwise use { fallback:true }.
  return {
    paths: pathWithParams,
    fallback: true,

    // paths: [{ params: { albumId: "p1" } }, { params: { albumId: "p2" } }],
    // fallback: true,

    // by this replacement of this file will execute after the page fully loaded on server-side.
    // fallback: "blocking",
  }; */
};

export async function getStaticProps(context) {
  const { albumName } = context.params;

  // console.log("albumName >>>>>>>>>>>>>>>", albumName);

  const { data } = await api.get(`/songs/${albumName}`);

  // if (!data?.length) {
  //   // return { notFound: true };
  //   return { hasError: true };
  // }

  // console.log("data >>>>>>>>>>>", data);

  return {
    props: {
      songs: data[0],
      album: data[1],
    },
    revalidate: 1800,
  };
}

/* export const getStaticPaths = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();

  const paths = data.map((curElem) => {
    return {
      params: {
        albumId: curElem.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.albumId;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const data = await res.json();

  const paths = data.map((curElem) => {
    return {
      props: {
        data,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

const myData = () => {
  return <div>Hello Dynamic</div>;
};

export default myData; */
