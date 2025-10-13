import { commonContainer, commonItem, commonPrice, commonTitle } from "../style/commonStyle";
import { productList } from "./productList";


const common = ()=>{
    return (
        <div style={commonContainer}>
            <h1 style={commonTitle}>product Page</h1>
            <ul>
                {productList.map(common => (
                    <li key={common.id} style={commonItem}>
                        <span>{common.name}</span>
                        <span style={commonPrice} >${common.price}</span>
                    </li>
                ))}
            </ul>
            <a href="/" className="">首頁</a>
        </div>
    )
}
export default common;