import { Link } from "react-router-dom";
import { formatePrice, getNumericPrice } from "src/Functions/formatting.ts";
import CustomNumberInput from "../../Shared/MiniComponents/CustomNumberInput/CustomNumberInput.tsx";
import s from "./CartProduct.module.scss";
import RemoveCartProductBtn from "./RemoveCartProductBtn.tsx";
import type { ProductType } from "src/Types/product.ts";

type Props = {
  data: ProductType;
}

const CartProduct = ({ data }: Props) => {
  const { imageUrl, name, shortName, afterDiscount, stockQuantity, productId } = data;
  const priceAfterDiscount = getNumericPrice(afterDiscount);
  const subTotal = formatePrice((stockQuantity * priceAfterDiscount).toFixed(2));

  return (
    <tr className={s.productContainer}>
      <td className={s.product}>
        <div className={s.imgHolder}>
          <img src={`${import.meta.env.VITE_PUBLIC_URL}/${imageUrl}`} alt={`${shortName} product`} />
          <RemoveCartProductBtn productId={productId} />
        </div>

        <Link to={`/details?product=${productId}`}>{name}</Link>
      </td>

      <td className={s.price}>{afterDiscount}</td>

      <td>
        <CustomNumberInput product={data} quantity={stockQuantity} />
      </td>

      <td>{subTotal}</td>
    </tr>
  );
};
export default CartProduct;

export function translateProduct({
  productName,
  translateMethod,
  translateKey,
  uppercase = false,
  dynamicData = {},
}: {
  productName: string | undefined;
  translateMethod: (key: string, options?: any) => string;
  translateKey: string;
  uppercase?: boolean;
  dynamicData?: Record<string, any>;
}) {
  if (!productName) return "";
  const shortNameKey = productName?.replaceAll(" ", "");
  const productTrans = `products.${shortNameKey}`;
  const translateText = translateMethod(
    `${productTrans}.${translateKey}`,
    dynamicData
  );
  return uppercase ? translateText.toUpperCase() : translateText;
}
