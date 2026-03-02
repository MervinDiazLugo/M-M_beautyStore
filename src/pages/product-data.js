import { getProducts } from '../lib/api';

export async function getStaticProps() {
  try {
    const products = await getProducts();
    const productsMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
    
    return {
      props: {
        products: productsMap
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: {}
      },
      revalidate: 60
    };
  }
}

function ProductData({ products }) {
    return (
        <div>
            <h1>Product Data Page</h1>
            <pre>{JSON.stringify(products, null, 2)}</pre>
        </div>
    );
}
export default ProductData;
