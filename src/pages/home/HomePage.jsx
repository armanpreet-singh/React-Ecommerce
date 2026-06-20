import axios from "axios";
import { useEffect,useState } from "react";
import { Header } from "../../components/Header.jsx";
import "./HomePage.css";
import {ProductGrid} from  "./ProductsGrid"


export function HomePage({cart }) {
  const [products,setProducts] = useState([ ])
  
 
 useEffect(() => {
  axios.get('/api/products')
    .then((response) => {
      setProducts(response.data);
    });
  

}, []);

    return (
    <>
      <title>react-e_commerce</title>
      <Header cart ={cart} />

      <div className="home-page">
      <ProductGrid products = {products} />
      </div>
    </>
  );
}
