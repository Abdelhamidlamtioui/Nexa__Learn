"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { TrendingUp, Tag } from 'lucide-react';
import { blogService } from '@/services/api';


export function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await blogService.getCategories();
        let names: string[] = [];
        if (response.data && response.data.success) {
          const data = response.data.data;
          names = Array.isArray(data) ? data.filter(Boolean) : [];
        }
        setCategories(names);
      } catch (error) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Always show 'All' as the first filter
  const allCategories = ['All', ...categories.filter(c => c && c.toUpperCase() !== 'ALL')];

  return (
    <nav className="mb-8">
      <ul className="flex space-x-2 overflow-x-auto pb-2">
        {loading ? (
          <li><span className="text-white">Loading...</span></li>
        ) : (
          allCategories.map((cat) => (
            <li key={cat}>
              <Button
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full ${activeCategory === cat ? 'bg-gradient-to-r from-cyan-500 to-yellow-500 text-white' : 'text-white border-white hover:bg-white hover:text-blue-900'}`}
              >
                <Tag className="mr-2 h-4 w-4 text-blue-500" />
                {cat}
              </Button>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}


