import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatePrice, getNumericPrice } from "src/Functions/formatting.ts";
import ConfirmOrderProductBtn from "./ConfirmOrderProductBtn.tsx";
import s from "./OrderProduct.module.scss";
import RemoveOrderProductBtn from "./RemoveOrderProductBtn.tsx";
import type { ProductOrderType } from "src/Types/product.ts";

type Props = {
  data: ProductOrderType
}

const OrderProduct = ({ data } : Props) => {
  const { id, name, img, shortName, afterDiscount, quantity, status } = data;
  const priceAfterDiscount = getNumericPrice(afterDiscount);
  const subTotal = formatePrice((quantity * priceAfterDiscount).toFixed(2));
  const { t } = useTranslation();

  // const translatedProduct = translateProduct({
  //   productName: shortName,
  //   translateMethod: t,
  //   translateKey: "shortName",
  // });

  return (
    <tr className={s.productContainer}>
      <td className={s.product}>
        <div className={s.imgHolder}>
          <img src={img} alt={`${shortName} product`} />
          <RemoveOrderProductBtn
            productName={shortName}
            translatedProduct={name}
          />
          <ConfirmOrderProductBtn
            productName={shortName}
            translatedProduct={name}
          />
        </div>

        <Link to={`/details?product=${id}`}>{name}</Link>
      </td>

      <td className={s.price}>{afterDiscount}</td>

      <td>{quantity}</td>

      <td>{subTotal}</td>
      <td className={s.status}>{`${status}`}</td>
    </tr>
  );
};
export default OrderProduct;

// export function translateProduct({
//   productName,
//   translateMethod,
//   translateKey,
//   uppercase = false,
//   dynamicData = {},
// }) {
//   const shortNameKey = productName?.replaceAll(" ", "");
//   const productTrans = `products.${shortNameKey}`;
//   const translateText = translateMethod(
//     `${productTrans}.${translateKey}`,
//     dynamicData
//   );
//   return uppercase ? translateText.toUpperCase() : translateText;
// }
