import "./Datatable.css";
export default function Datatable({ columns, data }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>No Data Found</td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={index}>
              {columns.map((col, i) => {
                let value;

                if (typeof col.accessor === "function") {
                  value = col.accessor(row, index);
                } else {
                  value = row[col.accessor];
                }
                return <td key={i}>{value}</td>;
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
