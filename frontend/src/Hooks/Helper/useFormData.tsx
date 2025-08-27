import { useState } from "react";
import { setItemToLocalStorage } from "./useLocalStorage.tsx";

type Props = {
  initialValues: any,
  onSubmit: (values: any) => void
  storeInLocalStorage: boolean,
  localStorageKey: string
}

const useFormData = ({ initialValues, onSubmit, storeInLocalStorage, localStorageKey }: Props) => {
  const valuesLocal = localStorage.getItem(localStorageKey);
  const hasDataInLocal = valuesLocal;

  const [values, setValues] = useState(
    hasDataInLocal ? JSON.parse(valuesLocal) : initialValues
  );

  console.log(values);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setValues((prevValues: typeof values) => {
      const values = { ...prevValues, [name]: value };

      if (storeInLocalStorage) setItemToLocalStorage(localStorageKey, values);
      return values;
    });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return { values, handleChange, handleSubmit };
};

export default useFormData;
