import ProductCard from "../components/ProductCard";
import { useContext } from 'react';
import { SearchContext } from '../components/SearchContext';
import { PRODUCTS } from './product-data';

export default function Home() {
  const { searchTerm, updateSearchTerm } = useContext(SearchContext);

  const filteredProducts = Object.entries(PRODUCTS)
    .filter(([key, product]) => {
      const productName = product.name.toLowerCase();
      const productSku = product.sku.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return productName.includes(searchTermLower) || productSku.includes(searchTermLower);
    })
    .map(([key, product]) => ({ key, product }));

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, color: '#9c27b0' }}>
        <h1>Mi Tienda</h1>
        <nav>Catálogo</nav>
      </header>
      <div style={{ backgroundColor: '#f5f0f7', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por título o SKU"
          value={searchTerm}
          onChange={(e) => updateSearchTerm(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
        />
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {filteredProducts.map(({ key, product }) => (
          <ProductCard key={key} product={product} />
        ))}
      </div>
    </main>
  )
}