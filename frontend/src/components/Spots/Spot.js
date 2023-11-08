const Spot = ({ spot }) => {
  return (
    <div className="spot-div">
      <div>
        <img className="spot-image" src={spot.previewImage} alt="preview" />
      </div>
      <div className="spot-location-stars">
        <div>
          {spot.city}, {spot.state}
        </div>
        <div>
          <i class="fa-solid fa-star"></i> {spot.avgRating}
        </div>
      </div>
      <div>${spot.price} night</div>
    </div>
  );
};

export default Spot;
