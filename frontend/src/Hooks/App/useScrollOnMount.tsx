import { useEffect } from "react";

const useScrollOnMount = (top = 0, left = 0, behavior: ScrollBehavior = "instant") => {
  useEffect(() => {
    window.scrollTo({ top, left, behavior });
  }, []);
};
export default useScrollOnMount;
