"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useGraphQL";
import { ArticleCategory } from "@/types/article";

export default function CategoriesDebug() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCategories } = useCategories();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Debug: Fetching categories...');
        
        const response = await getCategories();
        console.log('🔍 Debug: Full response:', response);
        
        if (response.success && response.data?.categories) {
          setCategories(response.data.categories);
          console.log('🔍 Debug: Categories set:', response.data.categories);
        } else {
          setError('No categories found in response');
          console.log('🔍 Debug: No categories found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('🔍 Debug: Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getCategories]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid #ccc', 
      padding: '10px', 
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4>🔍 Categories Debug</h4>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>Error:</strong> {error || 'None'}</p>
      <p><strong>Categories Count:</strong> {categories.length}</p>
      <div>
        <strong>Categories:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          {categories.map(cat => (
            <li key={cat.id}>{cat.name} ({cat.slug})</li>
          ))}
        </ul>
      </div>
      <p style={{ fontSize: '10px', color: '#666' }}>
        API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql'}
      </p>
    </div>
  );
}
