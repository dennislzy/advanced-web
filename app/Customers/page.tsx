import { commonContainer, commonItem, commonPrice, commonTitle } from '../style/commonStyle'
export const customersList = [
    { id: 'c1', name: '王小明', level: 'Gold' },
    { id: 'c2', name: '陳語彤', level: 'Silver' }
  ]
const Customer = ()=>{
    return (
        <div style={commonContainer}>
            <h1 style={commonTitle}>customer Page</h1>
            <ul>
                {customersList.map(common => (
                    <li key={common.id} style={commonItem}>
                        <span>{common.name}</span>
                        <span style={commonPrice} >{common.level}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Customer;