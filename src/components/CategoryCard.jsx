import { useNavigate } from "react-router-dom";

function CategoryCard({ icon, title, count }) {

  const navigate = useNavigate();

  function openCategory() {

    navigate(
      `/services?category=${encodeURIComponent(title)}`
    );

  }

  return (

    <div
      className="category-card"
      onClick={openCategory}
    >

      <div className="category-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{count} services</p>

    </div>

  );
}

export default CategoryCard;