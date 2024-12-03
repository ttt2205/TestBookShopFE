import { useLoaderData, useNavigate } from "react-router-dom";
import { getReceiptById } from "services/purchaseServices";

export async function loader({ params }) {
  let id = params.receiptId;
  let { receipt } = await getReceiptById(id);
  return { receipt: receipt || {}, id };
}

// "receipt": {
//     "receipt_id": 1,
//     "total": 0,
//     "provider_id": 1,
//     "createdAt": "2024-11-19T13:12:01.000Z",
//     "updatedAt": "2024-11-19T13:12:02.000Z",
//     "batches": [
//       {
//         "price": 0,
//         "book": {
//           "book_id": 3,
//           "title": "Faker! What was that????"
//         },
//         "detail": {
//           "quantity": 100
//         }
//       }
//     ],
//     "provider": {
//       "name": "Global Books Supply"
//     }
//   }

const ChiTietPhieuNhap = () => {
  const { receipt, id } = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
      <h1>Chi tiết phiếu nhập</h1>
      <div>Mã phiếu nhập: {id}</div>
      <div className="">Nhà cung cấp: {receipt.provider?.name}</div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {receipt.batches.map((batch) => (
            <tr key={batch.book.book_id}>
              <td>{batch.book.book_id}</td>
              <td>{batch.book.title}</td>
              <td>{batch.detail.quantity}</td>
              <td>{new Intl.NumberFormat("en-US").format(batch.price || 0)}</td>
              <td>
                {new Intl.NumberFormat("en-US").format(
                  (batch.detail?.quantity || 0) * batch.price
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">Tổng cộng</td>
            <td>
              {new Intl.NumberFormat("en-US").format(
                receipt.batches.reduce(
                  (total, batch) =>
                    total + (batch.detail?.quantity || 0) * batch.price,
                  0
                )
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      <button onClick={(e) => navigate(-1)}>Cancel</button>
    </>
  );
};

export default ChiTietPhieuNhap;
