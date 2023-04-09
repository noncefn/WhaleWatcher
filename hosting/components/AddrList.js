import AddrItem from './AddrItem'
import styles from '/styles/components/addrList.module.css'

export default function Index(props) {
  return (
    <div className={styles.container}>
      <div className={styles.tableHead}>
        <div>Address</div>
        <div>Balance</div>
        <div>Seven days in-out</div>
      </div>
      {
        props.data.map(s => {
          return <AddrItem key={s.address} data={s} />
        })
      }
    </div>
  )
}
