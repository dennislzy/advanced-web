"use client"

import { useState, useEffect } from "react";
import { commonContainer, commonItem, commonPrice, commonTitle } from "../style/commonStyle";

interface Product {
    id: number;
    name: string;
    price: number;
}

const Product = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/product');
            const result = await response.json();
            if (result.data) {
                setProducts(result.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {

        const price = parseFloat(newProductPrice);

        const newProduct: Product = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: newProductName,
            price: price
        };

        setProducts([...products, newProduct]);
        setNewProductName("");
        setNewProductPrice("");
    };

    return (
        <div style={commonContainer}>
            <h1 style={commonTitle}>Product Page</h1>

            <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>新增產品</h2>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="產品名稱"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            minWidth: "200px",
                            flex: 1
                        }}
                    />
                    <input
                        type="number"
                        placeholder="價格"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            width: "150px",
                            flexShrink: 0
                        }}
                    />
                    <button
                        onClick={handleAddProduct}
                        style={{
                            padding: "8px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            flexShrink: 0
                        }}
                    >
                        新增
                    </button>
                </div>
            </div>

            {loading ? (
                <p>載入中...</p>
            ) : (
                <ul>
                    {products.map(product => (
                        <li key={product.id} style={commonItem}>
                            <span>{product.name}</span>
                            <span style={commonPrice}>${product.price}</span>
                        </li>
                    ))}
                </ul>
            )}
            <a href="/" className="">首頁</a>
        </div>
    )
}
export default Product