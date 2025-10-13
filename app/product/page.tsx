import { productList } from "./productList";
import { productContainer, productItem, productPrice, productTitle } from "./productStyle";


const Product = ()=>{
    return (
        <div style={productContainer}>
            <h1 style={productTitle}>Product Page</h1>
            <ul>
                {productList.map(product => (
                    <li key={product.id} style={productItem}>
                        <span>{product.name}</span>
                        <span style={productPrice} >${product.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Product;