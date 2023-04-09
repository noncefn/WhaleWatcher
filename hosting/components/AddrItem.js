import styles from '/styles/components/addrItem.module.css'

export default function Index(props) {
  const data = props.data 
  return (
    <div className={styles.row}>
      <div>{data.address}</div>
      <div>{data.final_balance}</div>
      <div>{data.total_sent}</div>
    </div>
  )
}
