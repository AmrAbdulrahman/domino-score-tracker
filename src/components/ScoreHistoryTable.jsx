export default function ScoreHistoryTable({ history }) {
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Change</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {history.map((entry, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td className={entry.delta < 0 ? 'negative' : 'positive'}>
              {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
            </td>
            <td>{entry.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
