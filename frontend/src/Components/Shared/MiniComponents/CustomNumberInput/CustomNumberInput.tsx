import { useDispatch, useSelector } from "react-redux";
import { MAXIMUM_QUANTITY, MINIMUM_QUANTITY } from "src/Data/globalVariables.tsx";
import s from "./CustomNumberInput.module.scss";
import CustomNumberInputButtons, {
  updateProductQuantity,
} from "./CustomNumberInputButtons/CustomNumberInputButtons.tsx";
import type { ProductType } from "src/Types/product.ts";
import type { RootState } from "src/Types/store.ts";

type Props = {
  product: ProductType;
  quantity: number;
};

const CustomNumberInput = ({ product, quantity }: Props) => {
  const { cartProducts } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  function handleChangeQuantityInput(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = parseInt(e.target.value);
    const updatedProduct = { ...product };

    if (isNaN(inputValue)) return;

    const isBelowMinimum = inputValue < MINIMUM_QUANTITY;
    const isAboveMaximum = inputValue > MAXIMUM_QUANTITY;

    if (isBelowMinimum) {
      updatedProduct.stockQuantity = MINIMUM_QUANTITY;
    } else if (isAboveMaximum) {
      updatedProduct.stockQuantity = MAXIMUM_QUANTITY;
    } else {
      updatedProduct.stockQuantity = inputValue;
    }

    updateProductQuantity(updatedProduct, cartProducts, dispatch);
    return updatedProduct.stockQuantity;
  }

  return (
    <div className={s.numberInput}>
      <input
        type="number"
        value={quantity}
        placeholder="0"
        onChange={handleChangeQuantityInput}
        min={MINIMUM_QUANTITY}
        max={MAXIMUM_QUANTITY}
      />

      <CustomNumberInputButtons product={product} quantity={quantity} />
    </div>
  );
};
export default CustomNumberInput;
