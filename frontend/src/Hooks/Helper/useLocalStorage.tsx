const useLocalStorage = (keyName: string, data?: any) => {
  const localData = localStorage.getItem(keyName);
  if (!data) return localData ? JSON.parse(localData) : null;

  setItemToLocalStorage(keyName, data);
  return localData ? JSON.parse(localData) : null;
};
export default useLocalStorage;

export function setItemToLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}
