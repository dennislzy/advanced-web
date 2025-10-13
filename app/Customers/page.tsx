import { commonContainer, commonItem, commonPrice, commonTitle } from '../style/commonStyle'
import { customers } from './customers'

const Customer = ()=>{
    return (
        <div style={commonContainer}>
            <h1 style={commonTitle}>customer Page</h1>
            <ul>
                {customers.map(common => (
                    <li key={common.id} style={commonItem}>
                        <span>{common.name}</span>
                        <span style={commonPrice} >${common.level}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Customer;