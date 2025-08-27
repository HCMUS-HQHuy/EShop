import AddToFavButton from "./AddToFavButton/AddToFavButton.tsx";
import BuyButton from "./BuyButton/BuyButton.tsx";
import CustomNumberInput from "./CustomNumberInput/CustomNumberInput.tsx";
import s from "./ProductDealingControls.module.scss";
import type { ProductDetailType } from "src/Types/product.ts";

type Props = {
  productData: ProductDetailType;
}

const ProductDealingControls = ({ productData }: Props) => {
  return (
    <section className={s.dealing}>
      <CustomNumberInput />

      <div className={s.buttons}>
        <BuyButton />
        <AddToFavButton productData={productData} />
      </div>
    </section>
  );
};
export default ProductDealingControls;
