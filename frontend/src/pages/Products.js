import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const handleInvest = async (id) => {
    try {
      await API.post("/investments", { productId: id, amount: 1000 });
      alert("Investment successful!");
    } catch (err) {
      alert("Investment failed.");
    }
  };

  return (
    <div>
      <h2>Available Products</h2>
      {products.map((p) => (
        <div key={p.id} className="product-card">
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <button onClick={() => handleInvest(p.id)}>Invest ₹1000</button>
        </div>
      ))}
    </div>
  );
}
