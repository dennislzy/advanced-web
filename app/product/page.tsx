"use client"

import { useState, useEffect } from "react";
import { commonContainer, commonItem, commonPrice, commonTitle } from "../style/commonStyle";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { AuthRoute } from "../authRoute";

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
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

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

    const createProduct = async (name: string, price: number) => {
        // 輸入驗證
        if (!name.trim()) {
            alert('請輸入產品名稱');
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert('請輸入有效的價格');
            return;
        }

        try {
            const response = await fetch('/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, price }),
            });
            const result = await response.json();
            if (result.data) {
                setProducts((prevProducts) => [...prevProducts, result.data]);
                handleCloseDialog(); // 成功後關閉對話框並清空表單
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('新增產品失敗，請稍後再試');
        }
    };

    const handleAddProduct = () => {
        createProduct(newProductName, parseFloat(newProductPrice));
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProductName("");
        setNewProductPrice("");
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('確定要刪除這個產品嗎？')) {
            return;
        }

        try {
            const response = await fetch(`/api/product/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (!response.ok) {
                alert(`刪除產品失敗：${result.error || '未知錯誤'}`);
                return;
            }

            if (result.success) {
                setProducts((prevProducts) => prevProducts.filter(p => p.id !== id));
            } else {
                alert('刪除產品失敗：沒有返回成功狀態');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('刪除產品失敗，請稍後再試');
        }
    };

    const updateProduct = async (id: number, name: string, price: number) => {
        if (!name.trim()) {
            alert('請輸入產品名稱');
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert('請輸入有效的價格');
            return;
        }

        try {
            const response = await fetch(`/api/product/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, price }),
            });
            const result = await response.json();

            if (!response.ok) {
                alert(`更新產品失敗：${result.error || '未知錯誤'}`);
                return;
            }

            if (result.data) {
                setProducts((prevProducts) =>
                    prevProducts.map(p => p.id === id ? result.data : p)
                );
                handleCloseEditDialog();
            } else {
                alert('更新產品失敗：沒有返回資料');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('更新產品失敗，請稍後再試');
        }
    };

    const handleOpenEditDialog = (product: Product) => {
        setEditingProduct(product);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingProduct(null);
    };

    const handleUpdateProduct = () => {
        if (editingProduct) {
            updateProduct(editingProduct.id, editingProduct.name, editingProduct.price);
        }
    };

    return (
        <AuthRoute>
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
                        onClick={() => createProduct(newProductName, parseFloat(newProductPrice))}
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
                        <li key={product.id} style={{
                            ...commonItem,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                                <span>{product.name}</span>
                                <span style={commonPrice}>${product.price}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleOpenEditDialog(product)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    編輯
                                </button>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    刪除
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <a href="/" className="">首頁</a>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>新增產品</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            label="產品名稱"
                            variant="outlined"
                            fullWidth
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            label="價格"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={newProductPrice}
                            onChange={(e) => setNewProductPrice(e.target.value)}
                            InputProps={{
                                startAdornment: <span style={{ marginRight: "8px" }}>$</span>
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        取消
                    </Button>
                    <Button onClick={handleAddProduct} variant="contained" color="primary">
                        確認新增
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>編輯產品</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            label="產品名稱"
                            variant="outlined"
                            fullWidth
                            value={editingProduct?.name || ''}
                            onChange={(e) => setEditingProduct(prev =>
                                prev ? { ...prev, name: e.target.value } : null
                            )}
                            autoFocus
                        />
                        <TextField
                            label="價格"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={editingProduct?.price || ''}
                            onChange={(e) => setEditingProduct(prev =>
                                prev ? { ...prev, price: parseFloat(e.target.value) } : null
                            )}
                            InputProps={{
                                startAdornment: <span style={{ marginRight: "8px" }}>$</span>
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="inherit">
                        取消
                    </Button>
                    <Button onClick={handleUpdateProduct} variant="contained" color="primary">
                        確認更新
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        </AuthRoute>
    )
}
export default Product