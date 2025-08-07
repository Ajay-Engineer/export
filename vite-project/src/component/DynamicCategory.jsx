import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
const CATEGORY_API = '/api/categories';
const PRODUCT_API = '/api/products';

export default function DynamicCategory() {
  const { categoryPath } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        // Fetch category details from backend
        const catRes = await fetch(`${CATEGORY_API}`);
        if (!catRes.ok) throw new Error('Failed to fetch categories');
        const allCategories = await catRes.json();
        const found = allCategories.find(c => c.path === categoryPath);
        if (!found) {
          setError('Category not found');
          setLoading(false);
          return;
        }
        setCategory(found);

        // Fetch products for this category from backend
        const prodRes = await fetch(`${PRODUCT_API}`);
        if (!prodRes.ok) throw new Error('Failed to fetch products');
        const allProducts = await prodRes.json();
        const filtered = allProducts.filter(p => p.category === categoryPath);
        setProducts(filtered || []);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to load category and products');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [categoryPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-red-600">
          {error || 'Category not found'}
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center text-red-600 hover:text-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Products
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-12">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 max-w-3xl mb-8">{category.description}</p>
      )}
      <div className="space-y-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Specifications:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.specifications.map((spec, index) => (
                        <li key={index} className="text-gray-600">{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.applications && product.applications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Applications:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.applications.map((app, index) => (
                        <li key={index} className="text-gray-600">{app}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Get Quote
                </button>
              </div>
              {product.imageUrl && (
                <div className="flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
