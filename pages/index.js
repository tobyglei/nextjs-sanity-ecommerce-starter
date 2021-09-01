import Error from "next/error";
import { useRouter } from "next/router";
import { getClient, usePreviewSubscription } from "../utils/sanity";
import ProductsPage from "../components/ProductsPage";

import { urlFor } from "../utils/sanity";
import { downloadFile } from "../utils/yunbox";

const query = `//groq
  *[_type == "product" && defined(slug.current)]
`;

function IndexPage(props) {
  const { productsData, preview } = props;
  const router = useRouter();

  if (!router.isFallback && !productsData) {
    return <Error statusCode={404} />;
  }
  const { data: products } = usePreviewSubscription(query, {
    initialData: productsData,
    enabled: preview || router.query.preview !== null,
  });

  return (
    <div className="my-8">
      <div className="mt-4">
        <ProductsPage products={products} />
      </div>
    </div>
  );
}

export async function getStaticProps({ params = {}, preview = false }) {
  const productsData = await getClient(preview).fetch(query);

  let promises = productsData.map(async (pd) => {
    const image = pd['mainImage'];
    const sanityImage = urlFor(image)
                .auto("format")
                .fit("crop")
                .width(750)
                .quality(80);
    const imageURL = sanityImage.url();
    const fn = image.asset._ref.replace('image-', '').replace('-jpg', '');
    const destPath = `../public/images/${fn}.jpg`;
    return await downloadFile(imageURL, destPath);
  });

  for await (let val of promises){
     console.log(val);
  }
  
  return {
    props: {
      preview,
      productsData,
    },
  };
}

export default IndexPage;
