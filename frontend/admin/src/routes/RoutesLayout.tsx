import { Outlet } from "react-router-dom"
import { Header } from "../components"

const RoutesLayout = () => {
  return (
    <>
    <Header />
    <Outlet />
    </>
  )
}
export default RoutesLayout