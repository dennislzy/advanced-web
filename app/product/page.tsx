"use client"

import { useState } from "react";
import { productList } from "./productList";
import { commonContainer, commonItem, commonPrice, commonTitle } from "../style/commonStyle";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";

interface Product {
    id: number;
    name: string;
    price: number;
}

const Product = () => {
    const [products, setProducts] = useState<Product[]>(productList);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProductName("");
        setNewProductPrice("");
    };

    const handleAddProduct = () => {
        if (!newProductName.trim() || !newProductPrice.trim()) {
            alert("請填寫產品名稱和價格");
            return;
        }

        const price = parseFloat(newProductPrice);
        if (isNaN(price) || price <= 0) {
            alert("請輸入有效的價格");
            return;
        }

        const newProduct: Product = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: newProductName,
            price: price
        };

        setProducts([...products, newProduct]);
        setNewProductName("");
        setNewProductPrice("");
        setOpenDialog(false);
    };

    return (
        <div style={commonContainer}>
            <h1 style={commonTitle}>Product Page</h1>

            <Box sx={{ marginBottom: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    sx={{ textTransform: "none" }}
                >
                    新增產品
                </Button>
            </Box>

            <ul>
                {products.map(product => (
                    <li key={product.id} style={commonItem}>
                        <span>{product.name}</span>
                        <span style={commonPrice}>${product.price}</span>
                    </li>
                ))}
            </ul>
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
        </div>
    )
}
export default Product