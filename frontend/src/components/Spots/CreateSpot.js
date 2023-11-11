import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSpotWithImages } from "../../store/spots";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CreateSpot = () => {
  const dispatch = useDispatch();
  //   const history = useHistory();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    dispatch(
      createSpotWithImages(
        {
          country,
          address,
          city,
          state,
          lat,
          lng,
          name,
          description,
          price,
        },
        previewImage,
        image1,
        image2,
        image3,
        image4
      )
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });

    // const newSpot = await response.json();
    // if (newSpot) {
    //   history.push(`/spots/${newSpot.id}`);
    // }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Create a new Spot</h2>
        <div>
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            id="country"
          ></input>
          {errors.country && <p className="error">{errors.country}</p>}
        </div>
        <div>
          <label htmlFor="street-address">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            id="street-address"
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            id="city"
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="STATE"
            id="state"
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div>
          <label htmlFor="latitude">Latitude</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            id="latitude"
          />
          {errors.lat && <p className="error">{errors.lat}</p>}
        </div>
        <div>
          <label htmlFor="longitude">Longitude</label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
            id="longitude"
          />
          {errors.lng && <p className="error">{errors.lng}</p>}
        </div>
        <div>
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
        </div>
        <div>
          <label htmlFor="place-description"></label>
          <input
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            id="place-description"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
        </div>
        <div>
          <label htmlFor="spot-name"></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            id="spot-name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
        </div>
        <div>
          <label htmlFor="price">$ </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            id="price"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
        </div>
        <div>
          <label htmlFor="previewImage"></label>
          <input
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            id="previewImage"
            required
          />
          <br></br>
          <br></br>

          <label htmlFor="image1"></label>
          <input
            type="text"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            placeholder="Image URL"
            id="image1"
          />
          <br></br>
          <br></br>
          <label htmlFor="image2"></label>
          <input
            type="text"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
            id="image2"
          />
          <br></br>
          <br></br>
          <label htmlFor="image3"></label>
          <input
            type="text"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
            id="image3"
          />
          <br></br>
          <br></br>
          <label htmlFor="image4"></label>
          <input
            type="text"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
            id="image4"
          />
          <br></br>
          <br></br>
        </div>
        <br></br>
        <div>
          <button type="submit">Create a Spot</button>
        </div>
      </form>
    </>
  );
};

export default CreateSpot;
